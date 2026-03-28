"use client";

import { useMemo } from "react";
import { fmtLocalDate } from "@/data/mockJournal";

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function CalendarView({
  month,
  entryDates,
  selectedDate,
  onSelectDate,
  onMonthChange,
}: {
  month: Date;
  entryDates: Set<string>;
  selectedDate: string | null;
  onSelectDate: (iso: string | null) => void;
  onMonthChange: (next: Date) => void;
}) {
  const { year, monthIndex, cells } = useMemo(
    () => buildMonthGrid(month),
    [month],
  );

  const title = `${year}년 ${monthIndex + 1}월`;

  return (
    <div className="rounded-3xl bg-white/90 p-4 shadow-md ring-1 ring-violet-100/80 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() =>
            onMonthChange(new Date(year, monthIndex - 1, 1))
          }
          className="rounded-xl px-2 py-1 text-sm text-violet-700 hover:bg-violet-50"
          aria-label="이전 달"
        >
          ‹
        </button>
        <h2 className="text-sm font-bold text-violet-950">{title}</h2>
        <button
          type="button"
          onClick={() =>
            onMonthChange(new Date(year, monthIndex + 1, 1))
          }
          className="rounded-xl px-2 py-1 text-sm text-violet-700 hover:bg-violet-50"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-violet-400">
        {WEEK_LABELS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (cell === null) {
            return <div key={`e-${i}`} className="aspect-square" />;
          }
          const iso = fmtLocalDate(new Date(year, monthIndex, cell));
          const has = entryDates.has(iso);
          const selected = selectedDate === iso;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(selected ? null : iso)}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-xs font-medium transition ${
                selected
                  ? "bg-violet-600 text-white shadow-md"
                  : "text-slate-700 hover:bg-violet-50"
              }`}
            >
              {cell}
              {has ? (
                <span
                  className={`mt-0.5 h-1 w-1 rounded-full ${
                    selected ? "bg-amber-200" : "bg-violet-400"
                  }`}
                />
              ) : (
                <span className="mt-0.5 h-1 w-1" />
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onSelectDate(null)}
        className="mt-3 w-full rounded-xl py-2 text-xs font-medium text-violet-600 hover:bg-violet-50"
      >
        이 달 전체 보기
      </button>
    </div>
  );
}

function buildMonthGrid(month: Date): {
  year: number;
  monthIndex: number;
  cells: (number | null)[];
} {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDow = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return { year, monthIndex, cells };
}
