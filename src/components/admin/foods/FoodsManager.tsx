"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Plus, Pencil, Trash2, Star, X, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatGBP } from "@/lib/utils";
import type { AdminMenuItem, MenuItemInput, MenuStatus } from "@/server/menu";
import { saveMenuItemAction, deleteMenuItemAction, setMenuStatusAction } from "@/server/actions/menu";

const IMAGE_OPTIONS = [
  "/products/assembled.webp",
  "/products/stack.webp",
  "/products/build.webp",
  "/products/explode.webp",
];
const STATUSES: MenuStatus[] = ["Active", "Sold out", "Hidden"];

const statusStyle: Record<MenuStatus, string> = {
  Active: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  "Sold out": "bg-orange-400/10 text-orange-300 ring-orange-400/20",
  Hidden: "bg-white/5 text-slate-400 ring-white/10",
};

const emptyForm: MenuItemInput = {
  name: "",
  price: 0,
  category: "Burgers",
  tagline: "",
  description: "",
  image: IMAGE_OPTIONS[0],
  badge: undefined,
  featured: false,
  heat: 0,
  calories: 0,
  rating: 4.5,
  ingredients: [],
  status: "Active",
};

const inputCls =
  "w-full px-3 py-2 text-sm bg-royal/20 border border-white/10 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-100 placeholder:text-slate-600 tracking-wide";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5 tracking-wide";

export function FoodsManager({ items, categories }: { items: AdminMenuItem[]; categories: string[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const tabs = ["All", ...categories];
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<MenuItemInput | null>(null); // open modal when non-null
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = items.filter((f) => {
    const matchCat = category === "All" || f.category === category;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openNew = () => setEditing({ ...emptyForm });
  const openEdit = (item: AdminMenuItem) =>
    setEditing({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      tagline: item.tagline,
      description: item.description,
      image: item.image,
      badge: item.badge,
      featured: !!item.featured,
      heat: item.heat,
      calories: item.calories,
      rating: item.rating,
      ingredients: item.ingredients ?? [],
      status: item.status,
    });

  const save = (data: MenuItemInput) => {
    startTransition(async () => {
      await saveMenuItemAction(data);
      setEditing(null);
      router.refresh();
    });
  };

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete “${name}”? This removes it from the live site too.`)) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteMenuItemAction(id);
      setBusyId(null);
      router.refresh();
    });
  };

  const changeStatus = (id: string, status: MenuStatus) => {
    setBusyId(id);
    startTransition(async () => {
      await setMenuStatusAction(id, status);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-5 max-w-350">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search menu items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-royal/20 border border-white/8 rounded-lg outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all text-slate-200 placeholder:text-slate-600 tracking-wide"
          />
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-gold/20 tracking-wide ml-auto"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 bg-royal/20 p-1 rounded-lg border border-white/8 w-fit flex-wrap">
        {tabs.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all tracking-wide ${
              category === c ? "bg-gold text-navy shadow-sm shadow-gold/20" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((food) => (
          <div
            key={food.id}
            className="bg-ink-2 rounded-xl border border-white/8 shadow-[0_1px_4px_rgba(0,0,0,0.5)] hover:border-gold/25 transition-all overflow-hidden flex flex-col"
          >
            <div className="relative h-32 bg-linear-to-br from-navy to-royal border-b border-white/8">
              <Image src={food.image} alt={food.name} fill sizes="320px" className="object-cover" />
              {food.featured && (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 text-[10px] font-semibold bg-navy/80 text-gold px-2 py-0.5 rounded-full backdrop-blur">
                  <Star className="w-3 h-3 fill-gold" /> Featured
                </span>
              )}
              <span className={`absolute right-2 top-2 text-[10px] px-2 py-0.5 rounded-full font-medium ring-1 tracking-wide ${statusStyle[food.status]}`}>
                {food.status}
              </span>
            </div>

            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-100 text-sm leading-snug tracking-wide">{food.name}</h3>
                <span className="font-bold text-white tracking-wide shrink-0">{formatGBP(food.price)}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 tracking-widest uppercase">{food.category}</p>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed tracking-wide">{food.tagline}</p>

              <div className="flex items-center gap-1 mt-2">
                <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                <span className="text-xs text-slate-300 font-medium tracking-wide">{food.rating}</span>
                <span className="text-xs text-slate-600 tracking-wide ml-1">· {food.calories} kcal</span>
              </div>

              {/* Quick status */}
              <select
                value={food.status}
                disabled={pending && busyId === food.id}
                onChange={(e) => changeStatus(food.id, e.target.value as MenuStatus)}
                className="mt-3 w-full text-xs bg-royal/20 border border-white/10 rounded-lg px-2 py-1.5 text-slate-300 outline-none focus:border-gold/40 tracking-wide"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-navy">
                    {s}
                  </option>
                ))}
              </select>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEdit(food)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium border border-white/8 rounded-lg text-slate-300 hover:bg-royal/30 hover:text-white transition-colors tracking-wide"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <Link
                  href={`/food/${food.id}`}
                  target="_blank"
                  title="View on site"
                  className="flex items-center justify-center py-1.5 px-2.5 text-xs border border-white/8 rounded-lg text-slate-400 hover:bg-royal/30 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => remove(food.id, food.name)}
                  disabled={pending && busyId === food.id}
                  className="flex items-center justify-center py-1.5 px-2.5 text-xs border border-rose-400/20 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50"
                >
                  {pending && busyId === food.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-600">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="font-medium tracking-wide">No items found</p>
        </div>
      )}

      {editing && (
        <MenuItemModal
          initial={editing}
          pending={pending}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function MenuItemModal({
  initial,
  pending,
  categories,
  onClose,
  onSave,
}: {
  initial: MenuItemInput;
  categories: string[];
  pending: boolean;
  onClose: () => void;
  onSave: (data: MenuItemInput) => void;
}) {
  const [form, setForm] = useState<MenuItemInput>(initial);
  const set = <K extends keyof MenuItemInput>(key: K, value: MenuItemInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      price: Number(form.price) || 0,
      calories: Number(form.calories) || 0,
      rating: Number(form.rating) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[8vh] px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative w-full max-w-2xl bg-ink-2 border border-white/10 rounded-2xl shadow-2xl max-h-[84vh] overflow-y-auto scroll-thin"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 sticky top-0 bg-ink-2 z-10">
          <h3 className="font-bold text-white tracking-wide">{form.id ? "Edit Menu Item" : "Add Menu Item"}</h3>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Name</label>
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Classic Burger" required />
          </div>

          <div>
            <label className={labelCls}>Category</label>
            <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {!categories.includes(form.category) && form.category && <option className="bg-navy" value={form.category}>{form.category}</option>}
              {categories.map((c) => (
                <option key={c} className="bg-navy" value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Price (£)</label>
            <input type="number" step="0.01" min="0" className={inputCls} value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Tagline</label>
            <input className={inputCls} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="The one that started it all." />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea rows={3} className={inputCls} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Image</label>
            <select className={inputCls} value={form.image} onChange={(e) => set("image", e.target.value)}>
              {IMAGE_OPTIONS.map((img) => (
                <option key={img} value={img} className="bg-navy">{img}</option>
              ))}
              {!IMAGE_OPTIONS.includes(form.image) && <option value={form.image} className="bg-navy">{form.image}</option>}
            </select>
            <input className={`${inputCls} mt-2`} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="/products/your-image.webp" />
          </div>

          <div>
            <label className={labelCls}>Badge</label>
            <select className={inputCls} value={form.badge ?? ""} onChange={(e) => set("badge", (e.target.value || undefined) as MenuItemInput["badge"])}>
              <option className="bg-navy" value="">None</option>
              <option className="bg-navy" value="Signature">Signature</option>
              <option className="bg-navy" value="Spicy">Spicy</option>
              <option className="bg-navy" value="BBQ">BBQ</option>
              <option className="bg-navy" value="Classic">Classic</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Heat level</label>
            <select className={inputCls} value={form.heat} onChange={(e) => set("heat", Number(e.target.value) as 0 | 1 | 2)}>
              <option className="bg-navy" value={0}>0 — None</option>
              <option className="bg-navy" value={1}>1 — Medium</option>
              <option className="bg-navy" value={2}>2 — Hot</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Calories (kcal)</label>
            <input type="number" min="0" className={inputCls} value={form.calories} onChange={(e) => set("calories", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>Rating</label>
            <input type="number" step="0.1" min="0" max="5" className={inputCls} value={form.rating} onChange={(e) => set("rating", Number(e.target.value))} />
          </div>

          <div>
            <label className={labelCls}>Status</label>
            <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value as MenuStatus)}>
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-navy">{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer tracking-wide">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="w-4 h-4 rounded accent-gold"
              />
              Featured (shows in homepage Lineup)
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Removable ingredients (comma-separated)</label>
            <input
              className={inputCls}
              value={form.ingredients.join(", ")}
              onChange={(e) => set("ingredients", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              placeholder="Lettuce, Pickles, B&H Mayo, Fillet"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8 sticky bottom-0 bg-ink-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-300 hover:text-white tracking-wide">
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gold hover:bg-gold-light text-navy text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-gold/20 tracking-wide disabled:opacity-60"
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            {form.id ? "Save Changes" : "Create Item"}
          </button>
        </div>
      </form>
    </div>
  );
}
