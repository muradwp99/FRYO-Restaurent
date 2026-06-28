import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";

export type RedirectType = "301" | "302";
export type RedirectStatus = "Active" | "Disabled";
export type Redirect = {
  id: string;
  from: string;
  to: string;
  type: RedirectType;
  status: RedirectStatus;
};

const COLLECTION = "redirects";

const seed: Redirect[] = [
  { id: "r-1", from: "/menu", to: "/#menu", type: "301", status: "Active" },
  { id: "r-2", from: "/offers", to: "/deals", type: "301", status: "Active" },
  { id: "r-3", from: "/book", to: "/", type: "302", status: "Disabled" },
];

export type RedirectInput = Omit<Redirect, "id"> & { id?: string };

export async function listRedirects(): Promise<Redirect[]> {
  return readCollection<Redirect>(COLLECTION, seed);
}

export async function saveRedirect(input: RedirectInput): Promise<Redirect> {
  const rows = await listRedirects();
  if (input.id) {
    let updated: Redirect | null = null;
    const next = rows.map((r) => {
      if (r.id !== input.id) return r;
      updated = { ...r, ...input, id: r.id };
      return updated;
    });
    await writeCollection(COLLECTION, next);
    return updated ?? rows[0];
  }
  const id = uniqueId(input.from || "redirect", rows.map((r) => r.id));
  const redirect: Redirect = { ...input, id };
  await writeCollection(COLLECTION, [...rows, redirect]);
  return redirect;
}

export async function deleteRedirect(id: string): Promise<void> {
  const rows = await listRedirects();
  await writeCollection(COLLECTION, rows.filter((r) => r.id !== id));
}
