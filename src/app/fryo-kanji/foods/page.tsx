"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Edit2, Trash2, Star } from "lucide-react";

const foods = [
  { id: 1, name: "Classic Smash Burger", category: "Burgers", price: "$12.40", rating: 4.9, orders: 342, status: "Available", emoji: "🍔" },
  { id: 2, name: "Super Charger Wrap", category: "Wraps", price: "$13.01", rating: 4.7, orders: 218, status: "Available", emoji: "🌯" },
  { id: 3, name: "BBQ Stack Burger", category: "Burgers", price: "$14.20", rating: 4.8, orders: 195, status: "Available", emoji: "🍔" },
  { id: 4, name: "FRYO Fries (Large)", category: "Sides", price: "$5.80", rating: 4.9, orders: 287, status: "Available", emoji: "🍟" },
  { id: 5, name: "Lemonade", category: "Drinks", price: "$4.00", rating: 4.5, orders: 164, status: "Available", emoji: "🍋" },
  { id: 6, name: "Chicken Wrap", category: "Wraps", price: "$12.60", rating: 4.6, orders: 98, status: "Available", emoji: "🌯" },
  { id: 7, name: "Onion Rings", category: "Sides", price: "$4.80", rating: 4.4, orders: 76, status: "Unavailable", emoji: "🧅" },
  { id: 8, name: "Chocolate Shake", category: "Drinks", price: "$6.20", rating: 4.8, orders: 134, status: "Available", emoji: "🥤" },
];

const categories = ["All", "Burgers", "Wraps", "Sides", "Drinks"] as const;

export default function FoodsPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [search, setSearch] = useState("");

  const filtered = foods.filter((f) => {
    const matchCat = category === "All" || f.category === category;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search menu items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors ml-auto">
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 w-fit flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              category === c
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Food grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* "Image" placeholder */}
            <div className="h-32 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-5xl border-b border-slate-100">
              {food.emoji}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-slate-800 text-sm leading-snug">{food.name}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    food.status === "Available"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {food.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-3">{food.category}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-slate-900">{food.price}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-slate-600 font-medium">{food.rating}</span>
                  <span className="text-xs text-slate-400">({food.orders})</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/fryo-kanji/foods/${food.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </Link>
                <button className="flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="font-medium">No items found</p>
        </div>
      )}
    </div>
  );
}
