import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { requireSession } from "@/server/auth";
import { getAdminBadges } from "@/server/dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FRYO Admin",
  description: "FRYO restaurant management dashboard",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth — the Proxy already gates this, but never render the shell
  // (or its children) without a verified session.
  const session = await requireSession();
  const badges = await getAdminBadges();

  return (
    <div className="admin-layout min-h-screen bg-ink flex text-cream">
      <AdminSidebar role={session.role} badges={badges} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={{ name: session.name, role: session.role }} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
