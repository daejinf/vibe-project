"use client";

const EMOTIONS: { emoji: string; label: string }[] = [
  { emoji: "😊", label: "편안" },
  { emoji: "🌙", label: "차분" },
  { emoji: "💪", label: "뿌듯" },
  { emoji: "🌧️", label: "무거움" },
  { emoji: "✨", label: "설렘" },
  { emoji: "🌿", label: "상쾌" },
  { emoji: "💬", label: "연결" },
  { emoji: "📚", label: "몰입" },
  { emoji: "❄️", label: "고요" },
];

export function EmotionSelector({
  value,
  onChange,
  disabled,
  readOnly,
}: {
  value: string;
  onChange?: (emoji: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  if (readOnly) {
    return (
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-rose-100 text-2xl shadow-inner"
        title="오늘의 감정"
      >
        {value || "·"}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {EMOTIONS.map(({ emoji, label }) => {
        const selected = value === emoji;
        return (
          <button
            key={emoji}
            type="button"
            disabled={disabled}
            title={label}
            onClick={() => onChange?.(emoji)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition ${
              selected
                ? "scale-110 bg-white shadow-md ring-2 ring-violet-400"
                : "bg-white/60 hover:scale-105 hover:bg-white hover:shadow"
            } disabled:opacity-40`}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
}
