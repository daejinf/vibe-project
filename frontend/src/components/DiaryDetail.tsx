"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { JournalEntry, WeatherId } from "@/types/journal";
import {
  getCategoryLabel,
  type DiaryCategoryId,
} from "@/constants/diaryCategories";
import { CategorySelect } from "./CategorySelect";
import { EmotionSelector } from "./EmotionSelector";
import { WeatherSelector } from "./WeatherSelector";
import { TagBadge } from "./TagBadge";
import { TagInput } from "./TagInput";

export function DiaryDetail({
  entry,
  onDelete,
  isDeleting,
  showEditLink = false,
  composeUserId,
  composeDefaultDate,
  composeDefaultCategory,
  onComposeSave,
  activeTag,
  onTagClick,
  tagSuggestions,
}: {
  entry: JournalEntry | null;
  onDelete: (id: string) => void | Promise<void>;
  isDeleting?: boolean;
  showEditLink?: boolean;
  composeUserId?: string;
  composeDefaultDate?: string;
  composeDefaultCategory?: DiaryCategoryId;
  onComposeSave?: (entry: JournalEntry) => void;
  activeTag?: string | null;
  onTagClick?: (tag: string) => void;
  tagSuggestions?: string[];
}) {
  if (!entry) {
    if (composeUserId && onComposeSave && composeDefaultDate) {
      return (
        <DiaryInlineCompose
          userId={composeUserId}
          defaultDate={composeDefaultDate}
          defaultCategory={composeDefaultCategory ?? "personal"}
          onSave={onComposeSave}
          tagSuggestions={tagSuggestions}
        />
      );
    }

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
            <TagBadge
              key={t}
              tag={t}
              onClick={
                onTagClick
                  ? () => {
                      onTagClick(t);
                    }
                  : undefined
              }
              active={activeTag === t}
            />
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

function DiaryInlineCompose({
  userId,
  defaultDate,
  defaultCategory,
  onSave,
  tagSuggestions,
}: {
  userId: string;
  defaultDate: string;
  defaultCategory: DiaryCategoryId;
  onSave: (entry: JournalEntry) => void;
  tagSuggestions?: string[];
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [category, setCategory] =
    useState<DiaryCategoryId>(defaultCategory);
  const [emotion, setEmotion] = useState("🌙");
  const [weather, setWeather] = useState<WeatherId>("cloudy");
  const [satisfaction, setSatisfaction] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setDate(defaultDate);
  }, [defaultDate]);

  useEffect(() => {
    setCategory(defaultCategory);
  }, [defaultCategory]);

  const resetToDefaults = () => {
    setTitle("");
    setContent("");
    setDate(defaultDate);
    setCategory(defaultCategory);
    setEmotion("🌙");
    setWeather("cloudy");
    setSatisfaction(4);
    setTags([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) return;

    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: trimmedTitle,
      content: trimmedContent,
      date,
      category,
      emotion,
      weather,
      satisfaction,
      tags,
      created_at: now,
      updated_at: now,
    };
    onSave(newEntry);
  };

  return (
    <article className="flex h-full min-h-0 flex-col rounded-3xl border border-violet-100/90 bg-white/95 p-6 shadow-lg shadow-violet-100/50 md:p-8">
      <header className="shrink-0 border-b border-violet-100 pb-5">
        <h1 className="text-lg font-bold text-violet-950 md:text-xl">
          새 기록 쓰기
        </h1>
        <p className="mt-1 text-sm text-violet-600/85">
          캘린더에서 고른 날짜가 있으면 아래에 반영돼요.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col gap-5 py-5"
      >
        <div>
          <label
            htmlFor="inline-diary-category"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-violet-400"
          >
            카테고리
          </label>
          <CategorySelect
            id="inline-diary-category"
            value={category}
            onChange={setCategory}
          />
        </div>

        <div>
          <label
            htmlFor="inline-diary-date"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-violet-400"
          >
            날짜
          </label>
          <input
            id="inline-diary-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-xl border border-violet-100 bg-white px-3 py-2.5 text-sm text-violet-950 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300/40"
          />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-violet-400">
            감정
          </p>
          <EmotionSelector value={emotion} onChange={setEmotion} />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-violet-400">
            날씨
          </p>
          <WeatherSelector value={weather} onChange={setWeather} />
        </div>

        <div>
          <label
            htmlFor="inline-diary-tags"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-violet-400"
          >
            태그
          </label>
          <TagInput
            id="inline-diary-tags"
            value={tags}
            onChange={setTags}
            suggestions={tagSuggestions}
          />
        </div>

        <div>
          <label
            htmlFor="inline-diary-title"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-violet-400"
          >
            제목
          </label>
          <input
            id="inline-diary-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="오늘 하루를 한 줄로"
            className="w-full rounded-xl border border-violet-100 px-3 py-2.5 text-sm text-violet-950 placeholder:text-violet-300 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300/40"
          />
        </div>

        <div className="min-h-0 flex-1">
          <label
            htmlFor="inline-diary-content"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-violet-400"
          >
            본문
          </label>
          <textarea
            id="inline-diary-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            placeholder="오늘 있었던 일을 자유롭게 적어보세요…"
            className="h-full min-h-[140px] w-full resize-y rounded-xl border border-violet-100 px-3 py-2.5 text-sm text-violet-950 placeholder:text-violet-300 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300/40"
          />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-violet-400">
            하루 만족도
          </p>
          <SatisfactionDotsEditable
            value={satisfaction}
            onChange={setSatisfaction}
          />
        </div>

        <footer className="flex shrink-0 flex-wrap items-center gap-3 border-t border-violet-100 pt-5">
          <button
            type="submit"
            className="rounded-xl bg-violet-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-800"
          >
            저장
          </button>
          <button
            type="button"
            onClick={resetToDefaults}
            className="rounded-xl border border-violet-100 bg-violet-50/80 px-5 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
          >
            취소
          </button>
        </footer>
      </form>
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

function SatisfactionDotsEditable({
  value,
  onChange,
}: {
  value: 1 | 2 | 3 | 4 | 5;
  onChange: (v: 1 | 2 | 3 | 4 | 5) => void;
}) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="만족도">
      {([1, 2, 3, 4, 5] as const).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`h-2.5 w-8 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
            n <= value ? "bg-violet-500" : "bg-violet-100 hover:bg-violet-200"
          }`}
          aria-pressed={n <= value}
          aria-label={`${n}점`}
        />
      ))}
    </div>
  );
}
