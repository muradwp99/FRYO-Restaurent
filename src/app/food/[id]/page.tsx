import { notFound } from "next/navigation";
import { getItem, MENU } from "@/lib/menu";
import { FoodCustomizer } from "@/components/food/FoodCustomizer";

export function generateStaticParams() {
  return MENU.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getItem(id);
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
  const item = getItem(id);
  if (!item) notFound();
  return <FoodCustomizer item={item} />;
}
