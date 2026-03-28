import type { JournalEntry } from "@/types/journal";
import { TagBadge } from "./TagBadge";

export function DiaryCard({
  entry,
  selected,
  onSelect,
  activeTag,
  onTagClick,
}: {
  entry: JournalEntry;
  selected: boolean;
  onSelect: (id: string) => void;
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}) {
  const preview =
    entry.content.split(/\n/).find((l) => l.trim().length > 0) ??
    entry.content;
  const short =
    preview.length > 64 ? `${preview.slice(0, 64).trim()}…` : preview;

  return (
    <button
      type="button"
      onClick={() => onSelect(entry.id)}
      className={`w-full rounded-2xl border bg-white p-4 text-left shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-[1.02] ${
        selected
          ? "border-violet-400 ring-2 ring-violet-300/60"
          : "border-violet-100/80 hover:border-violet-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 flex-1 font-semibold leading-snug text-violet-950">
          {entry.title}
        </p>
        <span
          className="shrink-0 text-2xl leading-none"
          aria-hidden
        >
          {entry.emotion}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {short}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {entry.tags.map((t) => (
          <TagBadge
            key={t}
            tag={t}
            active={activeTag === t}
            onClick={() => onTagClick(t)}
          />
        ))}
      </div>
      <p className="mt-3 text-xs font-medium text-violet-400">
        {new Date(entry.date).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </button>
  );
}
