import { notFound } from "next/navigation";
import { getMenuItem } from "@/server/menu";
import { getCustomizeOptions } from "@/server/modifiers";
import { FoodCustomizer } from "@/components/food/FoodCustomizer";

// CMS-backed: reflect admin edits to this item immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getMenuItem(id);
  return {
    title: item ? `${item.name} — FRYO` : "FRYO",
    description: item?.description,
  };
}

export default async function FoodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, options] = await Promise.all([getMenuItem(id), getCustomizeOptions()]);
  if (!item || item.status === "Hidden") notFound();
  return <FoodCustomizer item={item} options={options} />;
}
