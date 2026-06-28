import "server-only";
import { readCollection, writeCollection, uniqueId } from "./store";

export type UserRole = "owner" | "manager" | "editor" | "staff";
export type UserStatus = "Active" | "Invited" | "Suspended";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

export const USER_ROLES: UserRole[] = ["owner", "manager", "editor", "staff"];
export const USER_STATUSES: UserStatus[] = ["Active", "Invited", "Suspended"];

const COLLECTION = "users";

const seed: StaffUser[] = [
  { id: "u-1", name: "Orlando Laurentius", email: "orlando@fryo.co.uk", role: "owner", status: "Active" },
  { id: "u-2", name: "Sana Khalid", email: "sana@fryo.co.uk", role: "manager", status: "Active" },
  { id: "u-3", name: "Marco Reyes", email: "marco@fryo.co.uk", role: "editor", status: "Active" },
  { id: "u-4", name: "Dee Owens", email: "dee@fryo.co.uk", role: "staff", status: "Invited" },
];

export type UserInput = Omit<StaffUser, "id"> & { id?: string };

export async function listUsers(): Promise<StaffUser[]> {
  return readCollection<StaffUser>(COLLECTION, seed);
}

export async function saveUser(input: UserInput): Promise<StaffUser> {
  const rows = await listUsers();
  if (input.id) {
    let updated: StaffUser | null = null;
    const next = rows.map((u) => {
      if (u.id !== input.id) return u;
      updated = { ...u, ...input, id: u.id };
      return updated;
    });
    await writeCollection(COLLECTION, next);
    return updated ?? rows[0];
  }
  const id = uniqueId(input.name || input.email || "user", rows.map((u) => u.id));
  const user: StaffUser = { ...input, id };
  await writeCollection(COLLECTION, [...rows, user]);
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  const rows = await listUsers();
  await writeCollection(COLLECTION, rows.filter((u) => u.id !== id));
}
