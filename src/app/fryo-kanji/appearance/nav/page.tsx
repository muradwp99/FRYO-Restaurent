import { getNav } from "@/server/appearance";
import { NavEditor } from "@/components/admin/appearance/NavEditor";

export const dynamic = "force-dynamic";

export default async function NavAppearancePage() {
  const nav = await getNav();
  return <NavEditor initial={nav} />;
}
