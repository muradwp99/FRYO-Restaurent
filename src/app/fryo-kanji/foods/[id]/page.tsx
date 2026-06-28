import Link from "next/link";
import { ArrowLeft, Star, ShoppingBag, DollarSign, TrendingUp, Edit2 } from "lucide-react";

const food = {
  id: 1,
  emoji: "🍔",
  name: "Classic Smash Burger",
  category: "Burgers",
  price: "$12.40",
  status: "Available",
  description:
    "Our signature smash-style beef patty, pressed to crispy-edged perfection on a flat-top griddle. Loaded with American cheese, house-made pickles, shredded lettuce, fresh tomato, and our secret FRYO sauce in a toasted brioche bun.",
  ingredients: ["100% Beef Patty (180g)", "American Cheese", "Brioche Bun", "House Pickles", "Lettuce", "Tomato", "FRYO Sauce", "Caramelised Onions"],
  nutrition: { calories: "620 kcal", protein: "38g", fat: "34g", carbs: "42g" },
  stats: { orders: 342, revenue: "$4,240.80", rating: 4.9, reviews: 128 },
};

export default function FoodDetailPage() {
  return (
    <div className="space-y-5 max-w-4xl">
      <Link
        href="/fryo-kanji/foods"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Foods
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left – food preview */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-slate-200 shadow-sm h-52 flex items-center justify-center text-8xl">
            {food.emoji}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: ShoppingBag, label: "Orders", value: food.stats.orders, c: "text-blue-600 bg-blue-50" },
              { icon: DollarSign, label: "Revenue", value: food.stats.revenue, c: "text-emerald-600 bg-emerald-50" },
              { icon: Star, label: "Rating", value: food.stats.rating, c: "text-amber-600 bg-amber-50" },
              { icon: TrendingUp, label: "Reviews", value: food.stats.reviews, c: "text-violet-600 bg-violet-50" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 text-center">
                  <div className={`w-7 h-7 rounded-lg ${s.c} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right – details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded font-medium">
                    {food.category}
                  </span>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    {food.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{food.name}</h2>
                <p className="text-2xl font-black text-emerald-600 mt-1">{food.price}</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors flex-shrink-0">
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{food.description}</p>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {food.ingredients.map((ing) => (
                <span key={ing} className="bg-slate-50 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Nutritional Info</h3>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(food.nutrition).map(([key, val]) => (
                <div key={key} className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="font-bold text-slate-800 text-sm">{val}</p>
                  <p className="text-xs text-slate-400 capitalize mt-0.5">{key}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
