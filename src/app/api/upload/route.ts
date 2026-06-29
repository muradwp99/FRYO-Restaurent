import { NextResponse } from "next/server";
import { getSession } from "@/server/auth";
import { saveMediaBlob, mediaAvailable } from "@/server/media-blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "image/avif"];

export async function POST(req: Request) {
  // Admin-only upload.
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!mediaAvailable()) return NextResponse.json({ error: "Image storage is not configured (no database)." }, { status: 503 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Unsupported image type." }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image exceeds 5 MB." }, { status: 413 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const id = await saveMediaBlob(bytes, file.type, file.name || "upload");
  return NextResponse.json({ url: `/api/media/${id}`, id });
}
