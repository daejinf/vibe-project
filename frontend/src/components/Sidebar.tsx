"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useDiaryFilterStats } from "./DiaryFilterContext";
import {
  DIARY_CATEGORY_OPTIONS,
  type DiaryCategoryId,
} from "@/constants/diaryCategories";

function NavIcon({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      title={label}
      className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
        active
          ? "bg-blue-50 text-blue-600 shadow-sm"
          : "text-slate-500 hover:bg-white hover:text-slate-800"
      }`}
    >
      {children}
    </Link>
  );
}

function categoryRowClass(active: boolean) {
  return `flex w-full cursor-pointer flex-col items-center gap-0.5 rounded-lg py-1.5 text-center text-[11px] transition-colors ${
    active
      ? "bg-blue-50 font-medium text-blue-700"
      : "text-slate-600 hover:bg-slate-50"
  }`;
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, isReady, logout } = useAuth();
  const stats = useDiaryFilterStats();

  const initial = user?.email?.charAt(0).toUpperCase() ?? "?";
  const activeKey = stats?.activeCategoryKey ?? "all";

  return (
    <aside className="flex w-full shrink-0 flex-row flex-wrap items-center gap-3 border-b border-slate-200/80 bg-white px-3 py-3 shadow-sm md:h-screen md:w-[5.75rem] md:flex-col md:flex-nowrap md:items-center md:justify-start md:gap-0 md:overflow-y-auto md:border-b-0 md:border-r md:px-2 md:py-6">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-md md:mb-6"
        title={user?.email ?? "프로필"}
      >
        {isReady ? initial : "…"}
      </div>

      <nav className="flex flex-1 flex-row items-center justify-center gap-1 md:mb-6 md:flex-none md:flex-col md:gap-2">
        <NavIcon
          href="/"
          label="홈"
          active={pathname === "/" || pathname.startsWith("/diary")}
        >
          <HomeIcon />
        </NavIcon>
        <NavIcon href="/write" label="글쓰기" active={pathname === "/write"}>
          <PenIcon />
        </NavIcon>
      </nav>

      <div className="hidden w-full flex-1 md:block">
        <p className="mb-2 px-1 text-center text-[9px] font-semibold uppercase tracking-wider text-slate-400">
          카테고리
        </p>
        <ul className="flex flex-col gap-1">
          <li>
            <Link href="/" className={categoryRowClass(activeKey === "all")}>
              <span className="max-w-full truncate px-0.5">전체</span>
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                {stats?.total ?? "–"}
              </span>
            </Link>
          </li>
          {DIARY_CATEGORY_OPTIONS.map((opt) => (
            <li key={opt.id}>
              <Link
                href={`/?cat=${opt.id}`}
                className={categoryRowClass(activeKey === opt.id)}
              >
                <span className="max-w-full truncate px-0.5">
                  #{opt.label}
                </span>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                  {stats?.byCategory?.[opt.id as DiaryCategoryId] ?? "–"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="ml-auto flex flex-row items-center gap-2 md:mt-auto md:ml-0 md:w-full md:flex-col md:gap-2 md:pt-4">
        <button
          type="button"
          title="설정"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 md:mx-auto"
          disabled
        >
          <GearIcon />
        </button>
        {user ? (
          <button
            type="button"
            title="로그아웃"
            onClick={() => void logout()}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 md:mx-auto md:w-full md:flex-col md:gap-1 md:px-2 md:py-2.5 md:text-xs"
          >
            <LogoutIcon />
            <span>로그아웃</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100 hover:bg-blue-100 md:mx-auto md:w-full md:flex-col md:gap-1 md:px-2 md:py-2.5 md:text-xs"
          >
            <LoginIcon />
            <span>로그인</span>
          </Link>
        )}
      </div>
    </aside>
  );
}

function HomeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
  );
}
