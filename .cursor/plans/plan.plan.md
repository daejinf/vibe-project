---
name: diary-app-dev-plan
overview: spec.md와 api-spec.md 기반으로 나만의 일기장 앱을 0단계(초기 셋업) -> 1단계(목업) -> 2단계(실제 구현) 3단계로 나누어 개발하는 실행 계획
todos:
  - id: phase-0
    content: "0단계: Next.js 프로젝트 생성, 폴더 구조, 타입 정의, mockData 준비"
    status: completed
  - id: phase-1a
    content: "1단계 섹션A: 공용 레이아웃 및 헤더 컴포넌트"
    status: completed
  - id: phase-1b
    content: "1단계 섹션B: 로그인/회원가입 화면 (mock 인증)"
    status: completed
  - id: phase-1c
    content: "1단계 섹션C: 일기 목록 메인 페이지 (mock 데이터)"
    status: completed
  - id: phase-1d
    content: "1단계 섹션D: 일기 작성 페이지 (mock 저장)"
    status: completed
  - id: phase-1e
    content: "1단계 섹션E: 일기 상세 보기 페이지 (mock)"
    status: completed
  - id: phase-1f
    content: "1단계 섹션F: 일기 수정 페이지 (mock)"
    status: completed
  - id: phase-1g
    content: "1단계 섹션G: 전체 플로우 점검"
    status: completed
  - id: phase-2a
    content: "2단계 섹션A: Supabase 프로젝트 연결 및 클라이언트 설정"
    status: completed
  - id: phase-2b
    content: "2단계 섹션B: diaries 테이블 생성 및 RLS 정책 설정"
    status: completed
  - id: phase-2c
    content: "2단계 섹션C: 인증 mock -> Supabase Auth 교체"
    status: completed
  - id: phase-2d
    content: "2단계 섹션D: 일기 CRUD mock -> Supabase API 교체"
    status: completed
  - id: phase-2e
    content: "2단계 섹션E: mockData 제거 및 최종 정리"
    status: completed
isProject: true
---

# 나만의 일기장 — 개발 실행 계획

> **중요 규칙**
>
> - 1단계(목업)가 완전히 완료되고 플로우 검증이 끝나기 전까지 **절대 2단계로 넘어가지 않는다.**
> - 각 섹션 완료 후 **반드시 멈추고** 사용자에게 다음 진행 여부를 확인한다.

---

## 0단계 — 프로젝트 초기 셋업

### 0-1. Next.js 프로젝트 생성

- `frontend/` 폴더에 Next.js App Router 프로젝트 생성 (`npx create-next-app@latest frontend --typescript --tailwind --app --eslint`)
- 불필요한 보일러플레이트 정리 (기본 페이지 내용 제거)

### 0-2. 폴더 구조 세팅

- `frontend/src/app/` 하위 라우트 폴더 생성
  - `login/page.tsx`
  - `signup/page.tsx`
  - `write/page.tsx`
  - `diary/[id]/page.tsx`
  - `diary/[id]/edit/page.tsx`
  - `page.tsx` (메인 — 일기 목록)
  - `layout.tsx` (루트 레이아웃)
- `frontend/src/lib/` 폴더 생성 (유틸리티, Supabase 클라이언트 등)
- `frontend/src/components/` 폴더 생성 (공용 컴포넌트)
- `frontend/src/types/` 폴더 생성 (타입 정의)

### 0-3. 타입 정의

- `frontend/src/types/diary.ts` — `Diary` 타입 정의 (id, user_id, title, content, date, created_at, updated_at)
- `frontend/src/types/user.ts` — `User` 타입 정의 (id, email)

### 0-4. Mock 데이터 준비

- `frontend/src/lib/mockData.ts` — 하드코딩 일기 배열 (3~5개), 하드코딩 유저 정보

### 0-5. 정상 구동 확인

- `npm run dev`로 로컬 서버 실행 확인
- **멈춤 — 사용자에게 0단계 완료 확인**

---

## 1단계 — 목업 (Mock 데이터 기반 UI)

> Supabase 연동 없이 `mockData.ts`의 하드코딩 데이터만 사용한다.
> 모든 화면을 클릭해서 전체 플로우를 확인할 수 있는 수준으로 구현한다.

### 섹션 1-A. 공용 레이아웃 및 네비게이션

- 루트 레이아웃(`layout.tsx`) — 공통 헤더 포함
- 헤더 컴포넌트(`components/Header.tsx`) — 앱 제목, 로그아웃 버튼, 글쓰기 버튼
- 로그인/비로그인 상태에 따른 헤더 분기 (mock 상태값 사용)
- **멈춤 — 사용자에게 섹션 1-A 완료 확인**

### 섹션 1-B. 인증 화면 (로그인 / 회원가입)

- `/login/page.tsx` — 이메일, 비밀번호 입력 폼 + 로그인 버튼
- `/signup/page.tsx` — 이메일, 비밀번호 입력 폼 + 가입 버튼
- 로그인 폼 제출 시 mock 로그인 처리 후 `/`로 이동
- 회원가입 폼 제출 시 mock 처리 후 `/login`으로 이동
- 로그인 ↔ 회원가입 페이지 간 링크 연결
- 비인증 상태에서 메인 접근 시 `/login`으로 리다이렉트 (mock 기반)
- **멈춤 — 사용자에게 섹션 1-B 완료 확인**

### 섹션 1-C. 일기 목록 (메인 페이지)

- `/page.tsx` — mockData에서 일기 배열을 가져와 목록 렌더링
- 각 항목: 제목, 날짜 표시
- 최신순 정렬
- 항목 클릭 시 `/diary/[id]` 상세 페이지로 이동
- 일기가 없을 때 빈 상태 UI ("아직 일기가 없습니다")
- **멈춤 — 사용자에게 섹션 1-C 완료 확인**

### 섹션 1-D. 일기 작성

- `/write/page.tsx` — 제목, 본문(textarea), 날짜 입력 폼
- 날짜 기본값: 오늘 날짜
- 저장 버튼 클릭 시 mock 처리 후 `/`로 이동
- 취소 버튼 클릭 시 `/`로 이동
- **멈춤 — 사용자에게 섹션 1-D 완료 확인**

### 섹션 1-E. 일기 상세 보기

- `/diary/[id]/page.tsx` — mockData에서 해당 id의 일기를 찾아 표시
- 제목, 본문, 작성일 표시
- 수정 버튼 → `/diary/[id]/edit`로 이동
- 삭제 버튼 → 확인 다이얼로그 후 mock 삭제 처리, `/`로 이동
- 목록으로 돌아가기 링크
- **멈춤 — 사용자에게 섹션 1-E 완료 확인**

### 섹션 1-F. 일기 수정

- `/diary/[id]/edit/page.tsx` — 기존 일기 데이터를 폼에 채워서 표시
- 제목, 본문, 날짜 수정 가능
- 저장 버튼 클릭 시 mock 처리 후 `/diary/[id]`로 이동
- 취소 버튼 클릭 시 `/diary/[id]`로 이동
- **멈춤 — 사용자에게 섹션 1-F 완료 확인**

### 섹션 1-G. 전체 플로우 점검

- 회원가입 → 로그인 → 목록 → 작성 → 상세 → 수정 → 삭제 → 목록 전체 흐름 확인
- 모든 페이지 간 네비게이션이 정상 동작하는지 확인
- **멈춤 — 사용자에게 1단계 전체 완료 확인 (이 확인 후에만 2단계 진행)**

---

## 2단계 — 실제 구현 (Supabase 연동)

> 1단계 플로우 검증이 완료된 후에만 시작한다.
> mockData.ts를 Supabase API 호출로 교체한다.
> Supabase 작업은 Supabase MCP를 사용한다. 프로젝트명: `vibe-tutorial`

### 섹션 2-A. Supabase 프로젝트 연결

- Supabase MCP로 `vibe-tutorial` 프로젝트 확인 및 연결
- `frontend/.env.local` 생성 — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
- `@supabase/supabase-js` 패키지 설치
- `frontend/src/lib/supabase.ts` — Supabase 클라이언트 생성 (브라우저용)
- **멈춤 — 사용자에게 섹션 2-A 완료 확인**

### 섹션 2-B. DB 테이블 및 RLS 설정

- Supabase MCP로 `diaries` 테이블 생성 (id, user_id, title, content, date, created_at, updated_at)
- `user_id`에 `auth.users.id` FK 설정
- RLS 활성화
- SELECT 정책: `auth.uid() = user_id` 인 행만 조회 가능
- INSERT 정책: `auth.uid() = user_id` 인 행만 삽입 가능
- UPDATE 정책: `auth.uid() = user_id` 인 행만 수정 가능
- DELETE 정책: `auth.uid() = user_id` 인 행만 삭제 가능
- `updated_at` 자동 갱신 트리거 설정
- **멈춤 — 사용자에게 섹션 2-B 완료 확인**

### 섹션 2-C. 인증 연동

- `/login/page.tsx` — mock 로그인을 `supabase.auth.signInWithPassword()`로 교체
- `/signup/page.tsx` — mock 가입을 `supabase.auth.signUp()`로 교체
- 로그아웃 — `supabase.auth.signOut()` 연결
- 인증 상태 관리 — `supabase.auth.getUser()` / `onAuthStateChange` 활용
- 비인증 사용자 리다이렉트 로직을 실제 세션 기반으로 교체
- 에러 처리 (이메일 중복, 잘못된 비밀번호 등) UI 표시
- **멈춤 — 사용자에게 섹션 2-C 완료 확인**

### 섹션 2-D. 일기 CRUD 연동

- 일기 작성 — mock을 `supabase.from("diaries").insert()` 로 교체
- 일기 목록 — mock을 `supabase.from("diaries").select("id, title, date, created_at").order("date", { ascending: false })` 로 교체
- 일기 상세 — mock을 `supabase.from("diaries").select().eq("id", id).single()` 로 교체
- 일기 수정 — mock을 `supabase.from("diaries").update().eq("id", id)` 로 교체
- 일기 삭제 — mock을 `supabase.from("diaries").delete().eq("id", id)` 로 교체
- 각 API 호출에 로딩 상태 및 에러 처리 추가
- **멈춤 — 사용자에게 섹션 2-D 완료 확인**

### 섹션 2-E. mockData 제거 및 최종 정리

- `mockData.ts` 파일 삭제
- mock 관련 import 및 참조 코드 제거
- 전체 플로우 재확인: 가입 → 로그인 → 작성 → 목록 → 상세 → 수정 → 삭제 → 로그아웃
- **멈춤 — 사용자에게 2단계 전체 완료 확인**

---

## 참조 문서

- [spec.md](../../spec.md) — 프로젝트 스펙 (기능 목록, 페이지 구성, DB 스키마)
- [api-spec.md](../../api-spec.md) — API 스펙 (Supabase 함수 호출 기준, 요청/응답 데이터)

