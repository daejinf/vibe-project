"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Diary } from "@/types/diary";
import { DashboardLayout, DashboardMain } from "@/components/Layout";
import { getCategoryLabel, normalizeCategory } from "@/constants/diaryCategories";

export default function DiaryDetailPage() {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
        setDiary({
          ...row,
          category: normalizeCategory(row.category),
        });
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

  const handleDelete = async () => {
    if (isDeleting) return;
    const confirmed = window.confirm("정말 이 일기를 삭제하시겠습니까?");
    if (!confirmed) return;

    setDeleteError(null);
    setIsDeleting(true);

    const { error } = await supabase.from("diaries").delete().eq("id", diary.id);

    setIsDeleting(false);

    if (error) {
      setDeleteError(error.message);
      return;
    }

    router.push("/");
  };

  return (
    <DashboardLayout>
      <DashboardMain>
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          ← 목록으로
        </Link>

        {deleteError && (
          <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            삭제하지 못했습니다: {deleteError}
          </p>
        )}

        <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md md:p-8">
          <header className="mb-6 border-b border-slate-100 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {getCategoryLabel(diary.category)}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              {diary.title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {new Date(diary.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </header>

          <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
            {diary.content}
          </div>

          <footer className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
            <Link
              href={`/diary/${diary.id}/edit`}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              수정
            </Link>
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={isDeleting}
              className="rounded-xl border border-red-100 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              {isDeleting ? "삭제 중…" : "삭제"}
            </button>
          </footer>
        </article>
      </DashboardMain>
    </DashboardLayout>
  );
}
