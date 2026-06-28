import { listUsers } from "@/server/users";
import { UsersManager } from "@/components/admin/users/UsersManager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await listUsers();
  return <UsersManager users={users} />;
}
