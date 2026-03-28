"use client";

import { useState } from "react";
import { normalizeTag, splitTagInput } from "@/lib/journalTags";
import { TagBadge } from "./TagBadge";

export function TagInput({
  id,
  value,
  onChange,
  suggestions,
  disabled,
}: {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState("");

  const addFromDraft = () => {
    const next = splitTagInput(draft);
    if (next.length === 0) return;
    const merged: string[] = [...value];
    const seen = new Set(merged);
    for (const t of next) {
      if (!seen.has(t)) {
        seen.add(t);
        merged.push(t);
      }
    }
    onChange(merged);
    setDraft("");
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const suggestionPick =
    suggestions?.filter((s) => !value.includes(s)) ?? [];

  return (
    <div className="space-y-2">
      <div className="flex min-h-[42px] flex-wrap items-center gap-2 rounded-xl border border-violet-100 bg-white px-2 py-2">
        {value.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1"
          >
            <TagBadge tag={tag} />
            <button
              type="button"
              disabled={disabled}
              onClick={() => removeAt(i)}
              className="rounded-md px-1 text-xs text-violet-400 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-40"
              aria-label={`${tag} 제거`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          disabled={disabled}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addFromDraft();
            }
            if (
              e.key === "Backspace" &&
              draft === "" &&
              value.length > 0
            ) {
              removeAt(value.length - 1);
            }
          }}
          onBlur={() => {
            const one = normalizeTag(draft);
            if (one && !value.includes(one)) {
              onChange([...value, one]);
              setDraft("");
            }
          }}
          placeholder={value.length ? "" : "#일상 — 입력 후 Enter"}
          className="min-w-[8rem] flex-1 border-0 bg-transparent px-1 py-1 text-sm text-violet-950 placeholder:text-violet-300 focus:outline-none focus:ring-0 disabled:opacity-50"
        />
      </div>
      {suggestionPick.length > 0 ? (
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-violet-400">
            자주 쓴 태그
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestionPick.slice(0, 12).map((s) => (
              <button
                key={s}
                type="button"
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (!value.includes(s)) onChange([...value, s]);
                }}
                className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-medium text-violet-700 ring-1 ring-violet-100 transition hover:bg-violet-100 disabled:opacity-40"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <p className="text-[11px] text-violet-500/90">
        쉼표·Enter로 여러 개 추가. 상세 화면에서 태그를 누르면 같은 태그 글만
        목록에 모여요.
      </p>
    </div>
  );
}
