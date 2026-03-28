"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, isReady, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isReady && user) {
      router.replace("/");
    }
  }, [isReady, user, router]);

  if (!isReady) {
    return (
      <main className="flex flex-1 items-center justify-center px-4">
        <p className="text-sm text-slate-500">불러오는 중…</p>
      </main>
    );
  }

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    const { error: authError } = await login(email, password);
    setSubmitting(false);

    if (authError) {
      setError(authError);
      return;
    }
    router.push("/");
  };

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 py-16">
      <Link
        href="/"
        className="absolute left-4 top-4 text-sm font-semibold text-slate-800 hover:text-blue-600"
      >
        ← 나만의 일기장
      </Link>

      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-200/60 md:p-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            로그인
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            이메일과 비밀번호로 들어가요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "로그인 중…" : "로그인하기"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
