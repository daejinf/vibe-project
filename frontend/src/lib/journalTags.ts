/** 태그 문자열을 `#라벨` 형태로 통일 (앞의 #는 무시하고 한 번만 붙임) */
export function normalizeTag(raw: string): string | null {
  const inner = raw.trim().replace(/^#+/u, "");
  if (!inner) return null;
  return `#${inner}`;
}

/** 입력 한 덩어리에서 여러 태그 분리 (쉼표·공백) */
export function splitTagInput(chunk: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const part of chunk.split(/[,\s]+/u)) {
    const t = normalizeTag(part);
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

export function collectTagSuggestionsFromEntries(
  entries: { tags: string[] }[],
): string[] {
  const set = new Set<string>();
  for (const e of entries) {
    for (const raw of e.tags) {
      const t = normalizeTag(raw);
      if (t) set.add(t);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b, "ko"));
}
