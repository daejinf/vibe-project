"use client";

export function StreakCard({
  current,
  best,
}: {
  current: number;
  best: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 p-4 shadow-md ring-1 ring-amber-200/50">
      <div className="pointer-events-none absolute -right-6 -top-6 text-6xl opacity-20">
        🔥
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-900/70">
        연속 기록
      </p>
      <div className="mt-2 flex items-end gap-4">
        <div>
          <p className="text-3xl font-bold tabular-nums text-amber-950">
            {current}
            <span className="ml-1 text-base font-semibold text-amber-800">
              일
            </span>
          </p>
          <p className="text-xs text-amber-900/70">지금 streak</p>
        </div>
        <div className="mb-1 h-8 w-px bg-amber-300/80" />
        <div>
          <p className="text-lg font-bold tabular-nums text-rose-900">
            {best}
            <span className="ml-0.5 text-sm font-medium text-rose-800">일</span>
          </p>
          <p className="text-xs text-rose-900/70">최고 기록</p>
        </div>
      </div>
    </div>
  );
}
