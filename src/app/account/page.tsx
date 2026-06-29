import type { Metadata } from "next";
import { requireAccountSession } from "@/server/auth";
import { getAccount } from "@/server/account";
import { listCustomers } from "@/server/customers";
import { listOrders } from "@/server/orders";
import { getSocials, getNav, getFooterConfig, getTheme } from "@/server/appearance";
import { getContactContent, getNewsletterContent } from "@/server/content";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { Footer } from "@/components/sections/Footer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Account", description: "Your FRYO orders and profile." };

export default async function AccountPage() {
  const session = await requireAccountSession();
  const [account, customers, orders, socials, contact, newsletter, nav, footerConfig, theme] = await Promise.all([
    getAccount(session.uid),
    listCustomers(),
    listOrders(),
    getSocials(),
    getContactContent(),
    getNewsletterContent(),
    getNav(),
    getFooterConfig(),
    getTheme(),
  ]);

  const profile = {
    name: account?.name ?? session.name,
    email: account?.email ?? session.email,
    joined: account?.joined ?? "—",
    phone: account?.phone,
  };

  // match this customer's record + orders (by email / name)
  const record = customers.find((c) => c.email.toLowerCase() === profile.email.toLowerCase());
  const myOrders = orders
    .filter((o) => o.customer.toLowerCase() === profile.name.toLowerCase())
    .map((o) => ({ id: o.id, items: o.items, amount: o.amount, status: o.status, date: o.date }));

  const stats = {
    orders: record?.orders ?? myOrders.length,
    spent: record?.spent ?? "£0.00",
    status: record?.status ?? "New",
  };

  return (
    <>
      <AccountDashboard profile={profile} stats={stats} orders={myOrders} />
      <Footer
        socials={socials}
        contact={contact}
        newsletter={newsletter}
        navLinks={nav.links}
        footerConfig={footerConfig}
        theme={theme}
      />
    </>
  );
}
