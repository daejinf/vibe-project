import type { JournalEntry } from "@/types/journal";
import { MOCK_USER_ID } from "@/data/mockData";

/** 감성 일기 홈(캘린더·목업) 전용 데이터 — API 미사용 */
export const mockJournalEntries: JournalEntry[] = [
  {
    id: "j01",
    user_id: MOCK_USER_ID,
    title: "오늘은 조용히 쉬고 싶었어요",
    content:
      "창밖 빗소리가 좋았다. 아무것도 하지 않는 하루도 가끔은 필요하다고 느꼈다.",
    date: new Date().toISOString().slice(0, 10),
    category: "personal",
    emotion: "🌙",
    weather: "rain",
    satisfaction: 4,
    tags: ["#휴식", "#감정"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "j02",
    user_id: MOCK_USER_ID,
    title: "회의가 생각보다 잘 풀렸다",
    content: "긴장했는데 팀이 다 받아줘서 고마웠다. 내일은 문서 정리부터.",
    date: new Date().toISOString().slice(0, 10),
    category: "work",
    emotion: "💪",
    weather: "cloudy",
    satisfaction: 5,
    tags: ["#업무", "#성장"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "j03",
    user_id: MOCK_USER_ID,
    title: "어제 산책",
    content: "해 질 녘 공기가 차가웠지만 맑아서 마음이 편했다.",
    date: offsetDate(-1),
    category: "personal",
    emotion: "🌿",
    weather: "sunny",
    satisfaction: 4,
    tags: ["#일상", "#산책"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "j04",
    user_id: MOCK_USER_ID,
    title: "책 한 장",
    content: "클린 코드 읽다가 졸았다. 그래도 한 페이지는 남겼다.",
    date: offsetDate(-2),
    category: "reading",
    emotion: "📚",
    weather: "cloudy",
    satisfaction: 3,
    tags: ["#공부", "#독서"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "j05",
    user_id: MOCK_USER_ID,
    title: "친구랑 통화",
    content: "오랜만에 웃음이 끊기지 않았다. 다음엔 만나서 밥 먹기로.",
    date: offsetDate(-3),
    category: "personal",
    emotion: "💬",
    weather: "wind",
    satisfaction: 5,
    tags: ["#일상", "#사람"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "j06",
    user_id: MOCK_USER_ID,
    title: "조금 우울한 날",
    content: "이유는 잘 모르겠는데 마음이 무거웠다. 그래도 일기는 써본다.",
    date: offsetDate(-5),
    category: "personal",
    emotion: "🌧️",
    weather: "rain",
    satisfaction: 2,
    tags: ["#감정"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "j07",
    user_id: MOCK_USER_ID,
    title: "눈 온다는 예보",
    content: "아침에 눈이 올 줄 알았는데 비만 왔다. 그래도 분위기는 겨울.",
    date: offsetDate(-9),
    category: "personal",
    emotion: "❄️",
    weather: "snow",
    satisfaction: 3,
    tags: ["#일상", "#날씨"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function datesWithJournalEntries(entries: JournalEntry[]): Set<string> {
  return new Set(entries.map((e) => e.date));
}

export function fmtLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 오늘 기준 연속 기록일(오늘 없으면 어제부터), 최장 연속 */
export function computeStreaks(
  entries: JournalEntry[],
  today = new Date(),
): { current: number; best: number } {
  const set = datesWithJournalEntries(entries);
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let d = new Date(t);
  if (!set.has(fmtLocalDate(d))) {
    d.setDate(d.getDate() - 1);
  }
  let current = 0;
  while (set.has(fmtLocalDate(d))) {
    current++;
    d.setDate(d.getDate() - 1);
  }

  const sorted = [...set].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const s of sorted) {
    const x = new Date(s + "T12:00:00");
    if (!prev) {
      run = 1;
    } else {
      const diff = Math.round((x.getTime() - prev.getTime()) / 86400000);
      run = diff === 1 ? run + 1 : 1;
    }
    best = Math.max(best, run);
    prev = x;
  }

  return { current, best };
}

export type TimeGroup = { label: string; items: JournalEntry[] };

export function groupEntriesByTime(
  entries: JournalEntry[],
  now = new Date(),
): TimeGroup[] {
  const todayStr = fmtLocalDate(now);
  const yest = new Date(now);
  yest.setDate(yest.getDate() - 1);
  const yesterdayStr = fmtLocalDate(yest);

  const startMonday = new Date(now);
  const dow = startMonday.getDay();
  const toMon = dow === 0 ? -6 : 1 - dow;
  startMonday.setDate(startMonday.getDate() + toMon);
  const weekStartStr = fmtLocalDate(startMonday);

  const today = entries.filter((e) => e.date === todayStr);
  const yesterday = entries.filter((e) => e.date === yesterdayStr);
  const thisWeek = entries.filter(
    (e) =>
      e.date >= weekStartStr &&
      e.date !== todayStr &&
      e.date !== yesterdayStr,
  );
  const older = entries.filter((e) => e.date < weekStartStr);

  const groups: TimeGroup[] = [];
  if (today.length) groups.push({ label: "오늘", items: today });
  if (yesterday.length) groups.push({ label: "어제", items: yesterday });
  if (thisWeek.length) groups.push({ label: "이번 주", items: thisWeek });
  if (older.length) groups.push({ label: "이전", items: older });
  return groups;
}
