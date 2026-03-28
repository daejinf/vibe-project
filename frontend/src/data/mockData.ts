import type { Diary } from "@/types/diary";

/** 목업·UI 참고용 (현재 홈 목록은 Supabase 사용) */
export const MOCK_USER_ID = "00000000-0000-4000-8000-000000000001";

export const mockDiaries: Diary[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    user_id: MOCK_USER_ID,
    title: "프로젝트 킥오프 회의",
    content:
      "오늘 팀과 첫 미팅을 했다. 일기장 앱의 방향을 잡았고, 다음 주까지 와이어프레임을 공유하기로 했다.\n\n기분이 설렌다.",
    date: "2026-03-26",
    category: "work",
    created_at: "2026-03-26T09:00:00.000Z",
    updated_at: "2026-03-26T09:00:00.000Z",
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    user_id: MOCK_USER_ID,
    title: "주말 산책",
    content:
      "한강까지 걸어갔다. 바람이 차갑지만 맑아서 마음이 편안해졌다.",
    date: "2026-03-23",
    category: "personal",
    created_at: "2026-03-23T18:30:00.000Z",
    updated_at: "2026-03-23T18:30:00.000Z",
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    user_id: MOCK_USER_ID,
    title: "독서 노트 — 클린 코드",
    content:
      "3장까지 읽었다. 의미 있는 이름 짓기가 생각보다 어렵다는 걸 다시 느꼈다.",
    date: "2026-03-20",
    category: "reading",
    created_at: "2026-03-20T22:00:00.000Z",
    updated_at: "2026-03-20T22:00:00.000Z",
  },
];
