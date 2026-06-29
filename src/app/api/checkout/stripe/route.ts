import { NextResponse } from "next/server";
import { getPaymentSettings, stripeConfigured } from "@/server/finance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LineIn = { name: string; price: number; qty: number };

/** Creates a Stripe Checkout Session and returns its hosted URL. */
export async function POST(req: Request) {
  const settings = await getPaymentSettings();
  if (!settings.card) return NextResponse.json({ error: "Card payments are disabled." }, { status: 400 });
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Card payments are not configured yet (missing Stripe key)." }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as { lines?: LineIn[]; deliveryFee?: number; orderId?: string } | null;
  const lines = body?.lines ?? [];
  if (!lines.length) return NextResponse.json({ error: "Empty order." }, { status: 400 });

  // Load the SDK lazily so the app builds/runs without the dependency configured.
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  const origin = new URL(req.url).origin;
  const line_items = lines.map((l) => ({
    quantity: l.qty,
    price_data: {
      currency: "gbp",
      product_data: { name: l.name },
      unit_amount: Math.round(l.price * 100),
    },
  }));
  if (body?.deliveryFee && body.deliveryFee > 0) {
    line_items.push({
      quantity: 1,
      price_data: { currency: "gbp", product_data: { name: "Delivery" }, unit_amount: Math.round(body.deliveryFee * 100) },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${origin}/order-confirmed?paid=1${body?.orderId ? `&order=${body.orderId}` : ""}`,
    cancel_url: `${origin}/checkout?canceled=1`,
    metadata: body?.orderId ? { orderId: body.orderId } : undefined,
  });

  return NextResponse.json({ url: session.url });
}
