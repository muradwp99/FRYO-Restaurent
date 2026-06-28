import { NextResponse } from "next/server";
import { getDeliveryConfig } from "@/server/finance";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getDeliveryConfig();
  return NextResponse.json(config, { headers: { "Cache-Control": "no-store" } });
}
