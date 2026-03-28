import type { DiaryCategoryId } from "@/constants/diaryCategories";

export interface Diary {
  id: string;
  user_id: string;
  title: string;
  content: string;
  date: string;
  /** DB 값: personal | work | reading */
  category: DiaryCategoryId;
  created_at: string;
  updated_at: string;
}
