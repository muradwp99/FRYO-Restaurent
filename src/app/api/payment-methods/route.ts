import { NextResponse } from "next/server";
import { getCheckoutPayment } from "@/server/finance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public, secret-free payment config for the checkout page.
export async function GET() {
  const cfg = await getCheckoutPayment();
  return NextResponse.json(cfg, { headers: { "Cache-Control": "no-store" } });
}
