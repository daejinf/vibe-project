import type { DiaryCategoryId } from "@/constants/diaryCategories";

export type WeatherId = "sunny" | "cloudy" | "rain" | "snow" | "wind";

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  date: string;
  category: DiaryCategoryId;
  emotion: string;
  weather: WeatherId;
  satisfaction: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  created_at: string;
  updated_at: string;
}
