import { listBackups } from "@/server/backups";
import { BackupsManager } from "@/components/admin/system/BackupsManager";

export const dynamic = "force-dynamic";

export default async function BackupsPage() {
  const backups = await listBackups();
  return <BackupsManager backups={backups} />;
}
