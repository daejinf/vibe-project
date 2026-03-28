"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { TimeGroup } from "@/data/mockJournal";
import type { DiaryCategoryId } from "@/constants/diaryCategories";
import { DIARY_CATEGORY_OPTIONS } from "@/constants/diaryCategories";
import { DiaryCard } from "./DiaryCard";

export function DiaryList({
  groups,
  selectedId,
  onSelect,
  activeCategoryKey,
  categoryCounts,
  totalCount,
  scopeEmpty,
  activeTag,
  onTagClick,
}: {
  groups: TimeGroup[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeCategoryKey: "all" | DiaryCategoryId;
  categoryCounts: Record<DiaryCategoryId, number>;
  totalCount: number;
  scopeEmpty: boolean;
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.content.toLowerCase().includes(q) ||
            e.tags.some((t) => t.toLowerCase().includes(q)),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  const flatCount = filteredGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400">
          기록
        </p>
        <Link
          href="/write"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md transition hover:bg-violet-700"
          title="새 기록"
        >
          <span className="text-lg leading-none">+</span>
        </Link>
      </div>

      <div className="relative shrink-0">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-violet-300">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목, 본문, 태그로 찾기…"
          className="w-full rounded-2xl border border-violet-100 bg-white/90 py-2.5 pl-10 pr-3 text-sm text-violet-950 shadow-sm placeholder:text-violet-300 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
        />
      </div>

      {activeTag ? (
        <button
          type="button"
          onClick={() => onTagClick(activeTag)}
          className="shrink-0 rounded-xl bg-violet-100 px-3 py-1.5 text-left text-xs font-medium text-violet-800"
        >
          태그 필터: {activeTag} ✕
        </button>
      ) : null}

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        {flatCount === 0 ? (
          <div className="rounded-3xl border border-dashed border-violet-200 bg-gradient-to-b from-white to-violet-50/50 p-8 text-center shadow-inner">
            {totalCount === 0 ? (
              <>
                <p className="text-lg font-semibold text-violet-900">
                  오늘 하루 어땠나요?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-violet-700/80">
                  첫 기록을 남겨보세요. 짧은 한 줄도 충분해요.
                </p>
                <Link
                  href="/write"
                  className="mt-5 inline-flex rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700"
                >
                  기록 시작하기
                </Link>
              </>
            ) : scopeEmpty ? (
              <p className="text-sm text-violet-700">
                이 조건에 맞는 기록이 없어요. 캘린더나 태그를 바꿔 볼까요?
              </p>
            ) : (
              <p className="text-sm text-violet-600">검색 결과가 없습니다</p>
            )}
          </div>
        ) : (
          filteredGroups.map((group) => (
            <section key={group.label}>
              <h3 className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-violet-400">
                {group.label}
              </h3>
              <ul className="space-y-3">
                {group.items.map((e) => (
                  <li key={e.id}>
                    <DiaryCard
                      entry={e}
                      selected={e.id === selectedId}
                      onSelect={onSelect}
                      activeTag={activeTag}
                      onTagClick={onTagClick}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>

      <div className="shrink-0 border-t border-violet-100/80 pt-3 md:hidden">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-violet-400">
          카테고리
        </p>
        <div className="flex flex-wrap gap-2">
          <CategoryChip href="/" active={activeCategoryKey === "all"}>
            전체
            <span className="rounded-md bg-white/80 px-1.5 text-[10px]">
              {totalCount}
            </span>
          </CategoryChip>
          {DIARY_CATEGORY_OPTIONS.map((opt) => (
            <CategoryChip
              key={opt.id}
              href={`/?cat=${opt.id}`}
              active={activeCategoryKey === opt.id}
            >
              #{opt.label}
              <span className="rounded-md bg-white/80 px-1.5 text-[10px]">
                {categoryCounts[opt.id]}
              </span>
            </CategoryChip>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs shadow-sm ${
        active
          ? "bg-violet-600 font-medium text-white"
          : "bg-white text-violet-800"
      }`}
    >
      {children}
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}
