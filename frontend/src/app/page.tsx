"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { DashboardLayout } from "@/components/Layout";
import { DiaryList } from "@/components/DiaryList";
import { DiaryDetail } from "@/components/DiaryDetail";
import { DiaryFilterStatsProvider } from "@/components/DiaryFilterContext";
import { CalendarView } from "@/components/CalendarView";
import { StreakCard } from "@/components/StreakCard";
import {
  mockJournalEntries,
  groupEntriesByTime,
  datesWithJournalEntries,
  computeStreaks,
} from "@/data/mockJournal";
import type { JournalEntry } from "@/types/journal";
import {
  DIARY_CATEGORY_IDS,
  type DiaryCategoryId,
  normalizeCategory,
} from "@/constants/diaryCategories";

function HomeContent() {
  const searchParams = useSearchParams();
  const { user, isReady } = useAuth();
  const router = useRouter();

  const [entries, setEntries] = useState<JournalEntry[]>(() => [
    ...mockJournalEntries,
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<
    string | null
  >(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const catParam = searchParams.get("cat");
  const categoryFilter: DiaryCategoryId | null = useMemo(() => {
    if (!catParam || catParam === "all") return null;
    if (DIARY_CATEGORY_IDS.includes(catParam as DiaryCategoryId)) {
      return catParam as DiaryCategoryId;
    }
    return null;
  }, [catParam]);

  const activeCategoryKey: "all" | DiaryCategoryId =
    categoryFilter ?? "all";

  const filteredForCalendar = useMemo(() => {
    let list = entries;
    if (categoryFilter) {
      list = list.filter(
        (e) => normalizeCategory(e.category) === categoryFilter,
      );
    }
    if (activeTag) {
      list = list.filter((e) => e.tags.includes(activeTag));
    }
    return list;
  }, [entries, categoryFilter, activeTag]);

  const baseList = useMemo(() => {
    let list = filteredForCalendar;
    if (selectedCalendarDate) {
      list = list.filter((e) => e.date === selectedCalendarDate);
    }
    return list;
  }, [filteredForCalendar, selectedCalendarDate]);

  const groups = useMemo(
    () => groupEntriesByTime(baseList),
    [baseList],
  );

  const entryDates = useMemo(
    () => datesWithJournalEntries(filteredForCalendar),
    [filteredForCalendar],
  );

  const streaks = useMemo(() => computeStreaks(entries), [entries]);

  const stats = useMemo(() => {
    const byCategory: Record<DiaryCategoryId, number> = {
      personal: 0,
      work: 0,
      reading: 0,
    };
    for (const e of entries) {
      byCategory[normalizeCategory(e.category)]++;
    }
    return {
      total: entries.length,
      byCategory,
      activeCategoryKey,
    };
  }, [entries, activeCategoryKey]);

  const hasStructuralFilter = Boolean(
    categoryFilter || activeTag || selectedCalendarDate,
  );
  const scopeEmpty =
    baseList.length === 0 && entries.length > 0 && hasStructuralFilter;

  useEffect(() => {
    if (!isReady) return;
    if (!user) router.replace("/login");
  }, [isReady, user, router]);

  useEffect(() => {
    if (selectedId && !baseList.some((e) => e.id === selectedId)) {
      setSelectedId(baseList[0]?.id ?? null);
    }
  }, [baseList, selectedId]);

  useEffect(() => {
    if (baseList.length > 0 && selectedId === null) {
      setSelectedId(baseList[0].id);
    }
  }, [baseList, selectedId]);

  const selected = baseList.find((e) => e.id === selectedId) ?? null;

  const handleDelete = useCallback((id: string) => {
    if (!window.confirm("이 기록을 지울까요?")) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setActiveTag((cur) => (cur === tag ? null : tag));
  }, []);

  if (!isReady || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-violet-600/70">불러오는 중…</p>
      </div>
    );
  }

  return (
    <DiaryFilterStatsProvider value={stats}>
      <DashboardLayout>
        <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-br from-violet-50/90 via-rose-50/40 to-amber-50/50 md:overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:flex-row md:gap-5 md:overflow-hidden md:p-6">
            <section className="flex min-h-0 w-full min-w-0 flex-col gap-4 md:max-w-md lg:max-w-lg">
              <StreakCard
                current={streaks.current}
                best={streaks.best}
              />
              <CalendarView
                month={calendarMonth}
                entryDates={entryDates}
                selectedDate={selectedCalendarDate}
                onSelectDate={setSelectedCalendarDate}
                onMonthChange={setCalendarMonth}
              />
              <div className="min-h-0 flex-1 md:min-h-[200px]">
                <DiaryList
                  groups={groups}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  activeCategoryKey={activeCategoryKey}
                  categoryCounts={stats.byCategory}
                  totalCount={stats.total}
                  scopeEmpty={scopeEmpty}
                  activeTag={activeTag}
                  onTagClick={handleTagClick}
                />
              </div>
            </section>
            <section className="flex min-h-[45vh] min-w-0 flex-1 flex-col md:min-h-0 md:overflow-hidden">
              <DiaryDetail
                entry={selected}
                onDelete={handleDelete}
                showEditLink={false}
              />
            </section>
          </div>
        </div>
      </DashboardLayout>
    </DiaryFilterStatsProvider>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-sm text-violet-600/70">불러오는 중…</p>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
