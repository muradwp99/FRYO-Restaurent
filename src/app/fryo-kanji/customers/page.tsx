import { listCustomers } from "@/server/customers";
import { CustomersManager } from "@/components/admin/customers/CustomersManager";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await listCustomers();
  return <CustomersManager customers={customers} />;
}
