import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, ExternalLink, Flame } from "lucide-react";
import { getMenuItem } from "@/server/menu";
import { formatGBP } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  "Sold out": "bg-orange-400/10 text-orange-300 ring-orange-400/20",
  Hidden: "bg-white/5 text-slate-400 ring-white/10",
};

export default async function FoodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const food = await getMenuItem(id);
  if (!food) notFound();

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <Link href="/fryo-kanji/foods" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors tracking-wide">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>
        <Link
          href={`/food/${food.id}`}
          target="_blank"
          className="inline-flex items-center gap-2 text-xs font-semibold bg-gold hover:bg-gold-light text-navy px-3.5 py-2 rounded-lg transition-colors tracking-wide"
        >
          View on site <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Preview */}
        <div className="space-y-4">
          <div className="relative h-52 rounded-xl overflow-hidden border border-white/8 bg-linear-to-br from-navy to-royal">
            <Image src={food.image} alt={food.name} fill sizes="400px" className="object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-ink-2 rounded-xl border border-white/8 p-4">
              <p className="text-xs text-slate-500 tracking-widest uppercase">Price</p>
              <p className="text-xl font-bold text-white mt-1 tracking-tight">{formatGBP(food.price)}</p>
            </div>
            <div className="bg-ink-2 rounded-xl border border-white/8 p-4">
              <p className="text-xs text-slate-500 tracking-widest uppercase">Rating</p>
              <p className="text-xl font-bold text-white mt-1 tracking-tight flex items-center gap-1">
                <Star className="w-4 h-4 text-gold fill-gold" /> {food.rating}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 bg-ink-2 rounded-xl border border-white/8 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500 tracking-widest uppercase mb-1">{food.category}</p>
              <h1 className="text-2xl font-bold text-white tracking-tight">{food.name}</h1>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ring-1 tracking-wide ${statusStyle[food.status]}`}>
              {food.status}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400 tracking-wide">
            <span>{food.calories} kcal</span>
            {food.heat > 0 && (
              <span className="inline-flex items-center gap-1 text-gold">
                <Flame className="w-3.5 h-3.5" /> Heat {food.heat}
              </span>
            )}
            {food.featured && <span className="text-gold">★ Featured</span>}
          </div>

          <p className="text-sm text-gold/90 mt-4 font-medium tracking-wide">{food.tagline}</p>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed tracking-wide">{food.description}</p>

          {food.ingredients.length > 0 && (
            <div className="mt-5">
              <p className="text-xs text-slate-500 tracking-widest uppercase mb-2">Removable Ingredients</p>
              <div className="flex flex-wrap gap-2">
                {food.ingredients.map((ing) => (
                  <span key={ing} className="text-xs bg-royal/30 border border-white/8 text-slate-300 px-2.5 py-1 rounded-full tracking-wide">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-slate-600 mt-6 tracking-wide">
            Edit this item from the <Link href="/fryo-kanji/foods" className="text-gold hover:text-gold-light">Menu list</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
