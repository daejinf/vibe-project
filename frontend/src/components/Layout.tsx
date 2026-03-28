import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

/**
 * 대시보드 프레임: 좌측 사이드바 + 우측 메인 영역.
 * 홈에서는 메인 안에서 목록/상세 2단을 또 나눈다.
 */
export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-50 md:flex-row">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

/** 사이드바 옆 콘텐츠 패딩·스크롤 */
export function DashboardMain({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
      {children}
    </div>
  );
}
