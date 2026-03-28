"use client";

const PALETTE = [
  "bg-rose-100 text-rose-800 ring-rose-200/60",
  "bg-amber-100 text-amber-900 ring-amber-200/60",
  "bg-emerald-100 text-emerald-800 ring-emerald-200/60",
  "bg-sky-100 text-sky-900 ring-sky-200/60",
  "bg-violet-100 text-violet-800 ring-violet-200/60",
  "bg-orange-100 text-orange-900 ring-orange-200/60",
  "bg-teal-100 text-teal-900 ring-teal-200/60",
  "bg-fuchsia-100 text-fuchsia-900 ring-fuchsia-200/60",
];

function hashTag(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function TagBadge({
  tag,
  onClick,
  active,
}: {
  tag: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const palette = PALETTE[hashTag(tag) % PALETTE.length];
  const base =
    "inline-flex max-w-full cursor-pointer truncate rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 transition hover:opacity-90";
  const activeRing = active ? "ring-2 ring-blue-500 ring-offset-1" : "";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`${base} ${palette} ${activeRing}`}
      >
        {tag.startsWith("#") ? tag : `#${tag}`}
      </button>
    );
  }

  return (
    <span className={`${base} cursor-default ${palette} ${activeRing}`}>
      {tag.startsWith("#") ? tag : `#${tag}`}
    </span>
  );
}
