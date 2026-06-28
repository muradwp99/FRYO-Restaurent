import { Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";

/* June 2026: starts on Monday */
const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const reservations: Record<number, { name: string; time: string; guests: number; status: string }[]> = {
  28: [
    { name: "Johnson Family", time: "12:30", guests: 4, status: "confirmed" },
    { name: "Garcia, M.", time: "19:00", guests: 2, status: "confirmed" },
    { name: "Lee Group", time: "20:15", guests: 6, status: "pending" },
  ],
  29: [
    { name: "Patel, P.", time: "13:00", guests: 3, status: "confirmed" },
    { name: "Wilson Corp.", time: "18:30", guests: 8, status: "confirmed" },
  ],
  30: [
    { name: "Martinez, Z.", time: "12:00", guests: 2, status: "confirmed" },
    { name: "Chen, R.", time: "19:30", guests: 4, status: "pending" },
    { name: "Kim, S.", time: "21:00", guests: 5, status: "confirmed" },
  ],
};

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
};

/* Build June 2026 grid (starts Mon 1) */
function buildCalendar() {
  const days: (number | null)[] = [];
  // June 1 = Monday (index 0) → no leading nulls
  for (let d = 1; d <= 30; d++) days.push(d);
  // Pad to full weeks
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

const calDays = buildCalendar();
const TODAY = 28;

export default function CalendarPage() {
  const upcoming = [28, 29, 30]
    .flatMap((d) =>
      (reservations[d] ?? []).map((r) => ({ ...r, day: d })),
    )
    .slice(0, 5);

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-500">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-slate-900">June 2026</h3>
            <button className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-500">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calDays.map((day, i) => {
              const hasRes = day !== null && reservations[day];
              const isToday = day === TODAY;
              return (
                <div
                  key={i}
                  className={`aspect-square flex flex-col items-center justify-start pt-1.5 rounded-lg text-sm transition-colors ${
                    day === null
                      ? ""
                      : isToday
                        ? "bg-emerald-600 text-white"
                        : hasRes
                          ? "bg-amber-50 hover:bg-amber-100 cursor-pointer text-slate-800"
                          : "hover:bg-slate-50 cursor-pointer text-slate-700"
                  }`}
                >
                  {day && (
                    <>
                      <span className={`font-medium text-xs ${isToday ? "text-white" : ""}`}>{day}</span>
                      {hasRes && !isToday && (
                        <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                          {reservations[day].slice(0, 3).map((_, ri) => (
                            <span key={ri} className="w-1 h-1 rounded-full bg-amber-500" />
                          ))}
                        </div>
                      )}
                      {hasRes && isToday && (
                        <div className="flex gap-0.5 mt-1">
                          {reservations[day].slice(0, 3).map((_, ri) => (
                            <span key={ri} className="w-1 h-1 rounded-full bg-emerald-200" />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming reservations */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">Upcoming Reservations</h3>
            <div className="space-y-3">
              {upcoming.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-slate-700 leading-none">
                      {r.day}
                    </span>
                    <span className="text-[9px] text-slate-400 leading-none">JUN</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{r.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {r.time}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {r.guests}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColors[r.status]}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Today's Summary</h3>
            <div className="space-y-2">
              {[
                { label: "Total Reservations", value: "3" },
                { label: "Total Guests", value: "12" },
                { label: "Confirmed", value: "2" },
                { label: "Pending", value: "1" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-sm font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
