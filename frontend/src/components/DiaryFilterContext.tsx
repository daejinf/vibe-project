"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { DiaryCategoryId } from "@/constants/diaryCategories";

export type DiaryFilterStats = {
  total: number;
  byCategory: Record<DiaryCategoryId, number>;
  /** 홈 목록에서만 설정. 사이드바 활성 표시용 */
  activeCategoryKey: "all" | DiaryCategoryId;
};

const DiaryFilterStatsContext = createContext<DiaryFilterStats | null>(null);

export function DiaryFilterStatsProvider({
  children,
  value,
}: {
  value: DiaryFilterStats;
  children: ReactNode;
}) {
  return (
    <DiaryFilterStatsContext.Provider value={value}>
      {children}
    </DiaryFilterStatsContext.Provider>
  );
}

export function useDiaryFilterStats(): DiaryFilterStats | null {
  return useContext(DiaryFilterStatsContext);
}
