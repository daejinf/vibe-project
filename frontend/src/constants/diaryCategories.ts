export const DIARY_CATEGORY_IDS = ["personal", "work", "reading"] as const;

export type DiaryCategoryId = (typeof DIARY_CATEGORY_IDS)[number];

export const DIARY_CATEGORY_OPTIONS: { id: DiaryCategoryId; label: string }[] = [
  { id: "personal", label: "개인" },
  { id: "work", label: "업무" },
  { id: "reading", label: "독서" },
];

export function getCategoryLabel(id: string | null | undefined): string {
  const found = DIARY_CATEGORY_OPTIONS.find((o) => o.id === id);
  return found?.label ?? "개인";
}

export function normalizeCategory(raw: string | null | undefined): DiaryCategoryId {
  if (raw && DIARY_CATEGORY_IDS.includes(raw as DiaryCategoryId)) {
    return raw as DiaryCategoryId;
  }
  return "personal";
}
