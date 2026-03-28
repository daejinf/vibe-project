"use client";

import type { ReactNode } from "react";
import type { WeatherId } from "@/types/journal";

const WEATHER: { id: WeatherId; label: string; node: ReactNode }[] = [
  {
    id: "sunny",
    label: "맑음",
    node: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.061l1.59 1.591z" />
      </svg>
    ),
  },
  {
    id: "cloudy",
    label: "흐림",
    node: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 9.75a6 6 0 0111.573-2.003 3.75 3.75 0 014.133 4.995A3.752 3.752 0 0118 19.5H6.75a4.5 4.5 0 01-2.23-8.41 5.002 5.002 0 01-.02-1.03z" />
      </svg>
    ),
  },
  {
    id: "rain",
    label: "비",
    node: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 9.75a6 6 0 0111.573-2.003 3.75 3.75 0 014.133 4.995A3.752 3.752 0 0118 19.5h-2.293l-1.5 3h-1.414l1.5-3H6.75a4.5 4.5 0 01-2.23-8.41 5.002 5.002 0 01-.02-1.03zm4.78 9.75l-1.5 3h-1.414l1.5-3h1.414z" />
      </svg>
    ),
  },
  {
    id: "snow",
    label: "눈",
    node: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.25l.922 2.68 2.55-1.47-.47 2.86L18 6l-2.5 1.06.47 2.86-2.55-1.47L12 11.25l-.922-2.68-2.55 1.47.47-2.86L6 6l2.5-1.06-.47-2.86 2.55 1.47L12 2.25zm0 10.5l.922 2.68 2.55-1.47-.47 2.86L18 16.5l-2.5 1.06.47 2.86-2.55-1.47L12 21.75l-.922-2.68-2.55 1.47.47-2.86L6 16.5l2.5-1.06-.47-2.86 2.55 1.47L12 12.75z" />
      </svg>
    ),
  },
  {
    id: "wind",
    label: "바람",
    node: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 8.25a2.25 2.25 0 012.25-2.25h9a2.25 2.25 0 010 4.5H9.75v1.5h6a3 3 0 010 6H9.75a.75.75 0 010-1.5h6a1.5 1.5 0 000-3H6.75a2.25 2.25 0 010-4.5h.75V8.25H6.75a.75.75 0 100 1.5h7.5a.75.75 0 100-1.5H6.75z" />
      </svg>
    ),
  },
  {
    id: "fog",
    label: "안개",
    node: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 15.75a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm4.5 0a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm7.5 0a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zM3 12a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm7.5 0a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6A.75.75 0 0110.5 12zm9 0a.75.75 0 01.75-.75H21a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM4.5 8.25a6 6 0 0111.573-2.003 3.75 3.75 0 014.133 4.995A3.752 3.752 0 0118 14.25H6.75a4.5 4.5 0 01-2.23-8.41 5.002 5.002 0 01-.02-1.03z" />
      </svg>
    ),
  },
  {
    id: "storm",
    label: "폭풍",
    node: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 9.75a6 6 0 0111.573-2.003 3.75 3.75 0 014.133 4.995A3.752 3.752 0 0118 19.5h-2.25l-1.125 2.25h-1.5l1.125-2.25H6.75a4.5 4.5 0 01-2.23-8.41 5.002 5.002 0 01-.02-1.03zm6.75 9.75l-1.125 2.25h-1.5l1.125-2.25h1.5zM11.25 6l-.75 2.25h1.5L12 6h-.75z" />
      </svg>
    ),
  },
];

export function WeatherIcon({ id }: { id: WeatherId }) {
  const w = WEATHER.find((x) => x.id === id);
  return (
    <span className="text-sky-600" title={w?.label}>
      {w?.node}
    </span>
  );
}

export function WeatherSelector({
  value,
  onChange,
  disabled,
  readOnly,
}: {
  value: WeatherId;
  onChange?: (w: WeatherId) => void;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  if (readOnly) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900 ring-1 ring-sky-100">
        <WeatherIcon id={value} />
        {WEATHER.find((w) => w.id === value)?.label}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {WEATHER.map((w) => {
        const selected = value === w.id;
        return (
          <button
            key={w.id}
            type="button"
            disabled={disabled}
            title={w.label}
            onClick={() => onChange?.(w.id)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
              selected
                ? "bg-sky-100 text-sky-800 ring-2 ring-sky-400"
                : "bg-white/70 text-slate-500 hover:bg-white hover:text-sky-700"
            } disabled:opacity-40`}
          >
            {w.node}
          </button>
        );
      })}
    </div>
  );
}
