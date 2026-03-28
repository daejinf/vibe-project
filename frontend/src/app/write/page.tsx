"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { DashboardLayout, DashboardMain } from "@/components/Layout";
import { CategorySelect } from "@/components/CategorySelect";
import type { DiaryCategoryId } from "@/constants/diaryCategories";

export default function WritePage() {
  const { user, isReady } = useAuth();
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState<DiaryCategoryId>("personal");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return (
      <DashboardLayout>
        <DashboardMain>
          <p className="text-sm text-slate-500">불러오는 중…</p>
        </DashboardMain>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: insertError } = await supabase.from("diaries").insert({
      user_id: user.id,
      title,
      content,
      date,
      category,
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/");
  };

  return (
    <DashboardLayout>
      <DashboardMain>
        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 shadow-md md:p-8">
          <h1 className="mb-6 text-xl font-bold text-slate-900">새 일기 쓰기</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
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
                onClick={() => router.push("/")}
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
