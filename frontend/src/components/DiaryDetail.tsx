"use client";

import Link from "next/link";
import type { JournalEntry } from "@/types/journal";
import { getCategoryLabel } from "@/constants/diaryCategories";
import { EmotionSelector } from "./EmotionSelector";
import { WeatherSelector } from "./WeatherSelector";
import { TagBadge } from "./TagBadge";

export function DiaryDetail({
  entry,
  onDelete,
  isDeleting,
  showEditLink = false,
}: {
  entry: JournalEntry | null;
  onDelete: (id: string) => void | Promise<void>;
  isDeleting?: boolean;
  showEditLink?: boolean;
}) {
  if (!entry) {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-violet-200 bg-gradient-to-b from-white via-violet-50/30 to-rose-50/40 p-8 text-center shadow-inner md:min-h-0">
        <p className="text-lg font-semibold text-violet-900">
          오늘 하루 어땠나요?
        </p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-violet-700/85">
          왼쪽에서 날짜를 고르거나 기록을 선택하면, 감정과 날씨가 함께
          펼쳐져요.
        </p>
        <div className="mt-6 flex items-center gap-4 opacity-50">
          <EmotionSelector value="🌙" readOnly />
          <WeatherSelector value="rain" readOnly />
        </div>
      </div>
    );
  }

  return (
    <article className="flex h-full min-h-0 flex-col rounded-3xl border border-violet-100/90 bg-white/95 p-6 shadow-lg shadow-violet-100/50 md:p-8">
      <header className="shrink-0 border-b border-violet-100 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
            {getCategoryLabel(entry.category)}
          </span>
          {entry.tags.map((t) => (
            <TagBadge key={t} tag={t} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <EmotionSelector value={entry.emotion} readOnly />
          <WeatherSelector value={entry.weather} readOnly />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-violet-950 md:text-3xl">
          {entry.title}
        </h1>
        <p className="mt-2 text-sm text-violet-600/90">
          {new Date(entry.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </p>
        <div className="mt-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-violet-400">
            하루 만족도
          </p>
          <SatisfactionDots value={entry.satisfaction} />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto py-6">
        <div className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">
          {entry.content}
        </div>
      </div>

      <footer className="flex shrink-0 flex-wrap items-center gap-3 border-t border-violet-100 pt-5">
        {showEditLink ? (
          <Link
            href={`/diary/${entry.id}/edit`}
            className="rounded-xl bg-violet-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-800"
          >
            수정
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => void onDelete(entry.id)}
          disabled={isDeleting}
          className="rounded-xl border border-rose-100 bg-rose-50 px-5 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
        >
          {isDeleting ? "삭제 중…" : "삭제"}
        </button>
      </footer>
    </article>
  );
}

function SatisfactionDots({ value }: { value: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex items-center gap-1.5">
      {([1, 2, 3, 4, 5] as const).map((n) => (
        <span
          key={n}
          className={`h-2.5 w-8 rounded-full transition ${
            n <= value ? "bg-violet-500" : "bg-violet-100"
          }`}
        />
      ))}
    </div>
  );
}
