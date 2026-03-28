"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "@/types/user";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  isReady: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signup: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSessionUser(sessionUser: {
  id: string;
  email?: string | null;
} | null): User | null {
  if (!sessionUser?.id) return null;
  return { id: sessionUser.id, email: sessionUser.email ?? "" };
}

function formatAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (
    lower.includes("user already registered") ||
    lower.includes("already been registered") ||
    lower.includes("already registered")
  ) {
    return "이미 가입된 이메일입니다.";
  }
  if (lower.includes("email rate limit") || lower.includes("rate limit")) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  }
  if (
    lower.includes("email not confirmed") ||
    lower.includes("not confirmed")
  ) {
    return "이메일 인증을 완료한 뒤 다시 로그인해주세요.";
  }
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setUser(mapSessionUser(session?.user ?? null));
      setIsReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSessionUser(session?.user ?? null));
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: formatAuthError(error.message) };
    }
    // 홈 등에서 !user 시 /login 으로 보내는 효과와 레이스를 막기 위해,
    // onAuthStateChange 보다 먼저 컨텍스트에 반영한다.
    const sessionUser = data.session?.user ?? null;
    if (sessionUser) {
      setUser(mapSessionUser(sessionUser));
    }
    return { error: null };
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { error: formatAuthError(error.message) };
    }
    const sessionUser = data.session?.user ?? null;
    if (sessionUser) {
      setUser(mapSessionUser(sessionUser));
    }
    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isReady, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
