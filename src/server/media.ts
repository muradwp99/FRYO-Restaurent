import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";

export type MediaItem = {
  id: string;
  name: string;
  url: string;
  kind: string;
  addedAt: string;
};

const COLLECTION = "media";

const seed: MediaItem[] = [
  { id: "assembled", name: "assembled.webp", url: "/products/assembled.webp", kind: "image", addedAt: "Seed" },
  { id: "stack", name: "stack.webp", url: "/products/stack.webp", kind: "image", addedAt: "Seed" },
  { id: "build", name: "build.webp", url: "/products/build.webp", kind: "image", addedAt: "Seed" },
  { id: "explode", name: "explode.webp", url: "/products/explode.webp", kind: "image", addedAt: "Seed" },
  { id: "og", name: "og.webp", url: "/og.webp", kind: "image", addedAt: "Seed" },
];

export async function listMedia(): Promise<MediaItem[]> {
  return readCollection<MediaItem>(COLLECTION, seed);
}

export async function addMedia(input: { name: string; url: string }): Promise<MediaItem> {
  const rows = await listMedia();
  const id = uniqueId(input.name || "media", rows.map((m) => m.id));
  const item: MediaItem = { id, name: input.name || input.url, url: input.url, kind: "image", addedAt: "Uploaded" };
  await writeCollection(COLLECTION, [item, ...rows]);
  return item;
}

export async function deleteMedia(id: string): Promise<void> {
  const rows = await listMedia();
  await writeCollection(COLLECTION, rows.filter((m) => m.id !== id));
}
