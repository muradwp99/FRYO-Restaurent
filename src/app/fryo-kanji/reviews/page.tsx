import { Star, ThumbsUp } from "lucide-react";

const reviews = [
  { id: 1, customer: "Alex Johnson", rating: 5, item: "Classic Smash Burger", comment: "Absolutely incredible! The patty was perfectly smashed and the sauce was chef's kiss. Best burger I've had in NYC.", date: "28 Jun 2026", helpful: 14 },
  { id: 2, customer: "Maria Garcia", rating: 5, item: "Super Charger Wrap", comment: "The wrap was massive and packed with flavor. Fresh ingredients, great price. Will definitely be back!", date: "27 Jun 2026", helpful: 9 },
  { id: 3, customer: "James Lee", rating: 4, item: "BBQ Stack Burger", comment: "Really solid burger. The BBQ sauce is house-made and you can tell. Fries could be a bit crispier.", date: "26 Jun 2026", helpful: 7 },
  { id: 4, customer: "Priya Patel", rating: 5, item: "FRYO Fries (Large)", comment: "These fries are unreal. Perfectly seasoned, super crispy. I ordered them twice in the same visit!", date: "25 Jun 2026", helpful: 21 },
  { id: 5, customer: "Lily Thompson", rating: 5, item: "Classic Smash Burger", comment: "FRYO is my go-to spot now. The quality is consistent every time. The staff are super friendly too.", date: "24 Jun 2026", helpful: 18 },
  { id: 6, customer: "Ryan Chen", rating: 3, item: "BBQ Stack Burger", comment: "Good burger overall but had to wait about 25 minutes during lunch rush. The food was worth it though.", date: "22 Jun 2026", helpful: 4 },
  { id: 7, customer: "Sara Kim", rating: 4, item: "Super Charger Wrap", comment: "Really enjoyed the wrap. Great value for money. The lemonade paired perfectly with it.", date: "20 Jun 2026", helpful: 11 },
];

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${s} ${i <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
        />
      ))}
    </div>
  );
}

const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
  rating: r,
  count: reviews.filter((rv) => rv.rating === r).length,
}));

export default function ReviewsPage() {
  return (
    <div className="space-y-5 max-w-[1100px]">
      {/* Overview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          {/* Avg score */}
          <div className="text-center flex-shrink-0">
            <p className="text-6xl font-black text-slate-900">{avgRating.toFixed(1)}</p>
            <Stars rating={Math.round(avgRating)} size="md" />
            <p className="text-xs text-slate-400 mt-2">{reviews.length} reviews total</p>
          </div>

          {/* Rating breakdown */}
          <div className="flex-1 w-full space-y-2">
            {ratingCounts.map(({ rating, count }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12 flex-shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-slate-600 font-medium">{rating}</span>
                </div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${(count / reviews.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-sm font-bold flex-shrink-0">
                  {r.customer[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{r.customer}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Stars rating={r.rating} />
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-emerald-600 font-medium">{r.item}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 flex-shrink-0">{r.date}</p>
            </div>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{r.comment}</p>

            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-50">
              <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" />
                Helpful ({r.helpful})
              </button>
              <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
