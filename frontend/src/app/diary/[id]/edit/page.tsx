"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Diary } from "@/types/diary";
import { DashboardLayout, DashboardMain } from "@/components/Layout";
import { CategorySelect } from "@/components/CategorySelect";
import {
  type DiaryCategoryId,
  normalizeCategory,
} from "@/constants/diaryCategories";

export default function DiaryEditPage() {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [diary, setDiary] = useState<Diary | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<DiaryCategoryId>("personal");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  useEffect(() => {
    if (!isReady || !user || !id) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setLoading(true);
      setLoadError(null);
    });

    void (async () => {
      const { data, error } = await supabase
        .from("diaries")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setLoadError(error.message);
        setDiary(null);
      } else if (!data) {
        setDiary(null);
      } else {
        const row = data as Diary;
        setDiary(row);
        setTitle(row.title);
        setContent(row.content);
        setDate(row.date);
        setCategory(normalizeCategory(row.category));
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [isReady, user, id]);

  if (!isReady || !user) {
    return (
      <DashboardLayout>
        <DashboardMain>
          <p className="text-sm text-slate-500">불러오는 중…</p>
        </DashboardMain>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardMain>
          <p className="text-sm text-slate-500">일기를 불러오는 중…</p>
        </DashboardMain>
      </DashboardLayout>
    );
  }

  if (loadError) {
    return (
      <DashboardLayout>
        <DashboardMain>
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
            불러오기 실패: {loadError}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            목록으로 돌아가기
          </Link>
        </DashboardMain>
      </DashboardLayout>
    );
  }

  if (!diary) {
    return (
      <DashboardLayout>
        <DashboardMain>
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-slate-400 shadow-md">
            <p className="mb-4 text-lg">일기를 찾을 수 없습니다</p>
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </DashboardMain>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSubmitting(true);

    const { error } = await supabase
      .from("diaries")
      .update({ title, content, date, category })
      .eq("id", diary.id);

    setSubmitting(false);

    if (error) {
      setSaveError(error.message);
      return;
    }

    router.push(`/diary/${diary.id}`);
  };

  return (
    <DashboardLayout>
      <DashboardMain>
        <h1 className="mb-6 text-xl font-bold text-slate-900">일기 수정</h1>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {saveError && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {saveError}
              </p>
            )}

            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                제목
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="오늘 하루를 한 줄로"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                날짜
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                카테고리
              </label>
              <CategorySelect
                id="category"
                value={category}
                onChange={setCategory}
                disabled={submitting}
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                본문
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                placeholder="오늘 있었던 일을 자유롭게 적어보세요..."
                className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
              >
                {submitting ? "저장 중…" : "저장"}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/diary/${diary.id}`)}
                disabled={submitting}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </DashboardMain>
    </DashboardLayout>
  );
}
