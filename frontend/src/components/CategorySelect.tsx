"use client";

import {
  DIARY_CATEGORY_OPTIONS,
  type DiaryCategoryId,
} from "@/constants/diaryCategories";

export function CategorySelect({
  id,
  value,
  onChange,
  disabled,
}: {
  id?: string;
  value: DiaryCategoryId;
  onChange: (v: DiaryCategoryId) => void;
  disabled?: boolean;
}) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as DiaryCategoryId)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
    >
      {DIARY_CATEGORY_OPTIONS.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
