import "server-only";
import { readCollection, writeCollection } from "./store";

export type Backup = {
  id: string;
  date: string;
  size: string;
  status: "Complete" | "Running";
};

const COLLECTION = "backups";

const seed: Backup[] = [
  { id: "bk-2026-06-28", date: "28 Jun 2026, 03:00 AM", size: "4.2 MB", status: "Complete" },
  { id: "bk-2026-06-27", date: "27 Jun 2026, 03:00 AM", size: "4.1 MB", status: "Complete" },
  { id: "bk-2026-06-26", date: "26 Jun 2026, 03:00 AM", size: "4.0 MB", status: "Complete" },
];

export async function listBackups(): Promise<Backup[]> {
  return readCollection<Backup>(COLLECTION, seed);
}

export async function createBackup(): Promise<Backup> {
  const rows = await listBackups();
  const now = new Date();
  const date = now.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const backup: Backup = {
    id: `bk-${now.getTime()}`,
    date,
    size: `${(4 + rows.length * 0.1).toFixed(1)} MB`,
    status: "Complete",
  };
  await writeCollection(COLLECTION, [backup, ...rows]);
  return backup;
}

export async function deleteBackup(id: string): Promise<void> {
  const rows = await listBackups();
  await writeCollection(COLLECTION, rows.filter((b) => b.id !== id));
}
