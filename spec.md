# 나만의 일기장 — 프로젝트 스펙

## 프로젝트 개요

- **프로젝트명**: 나만의 일기장
- **목적**: 개인 일기를 작성·관리할 수 있는 웹 애플리케이션
- **Phase**: Phase 1

---

## 기술 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js — App Router (`app/` 디렉터리) |
| 언어 | TypeScript (`.ts`, `.tsx`) |
| 스타일 | Tailwind CSS |
| DB · 인증 · 백엔드 | Supabase |

---

## Phase 1 기능 목록

### 1. 인증

- 이메일 + 비밀번호 회원가입 (Supabase Auth)
- 로그인 / 로그아웃
- 비인증 사용자는 로그인 페이지로 리다이렉트

### 2. 일기 CRUD

- **작성**: 제목, 본문, 날짜 입력
- **목록 조회**: 최신순 정렬, 제목·날짜 표시
- **상세 보기**: 제목, 본문, 작성일 표시
- **수정**: 제목, 본문, 날짜 수정 가능
- **삭제**: 확인 후 삭제

---

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/login` | 로그인 페이지 |
| `/signup` | 회원가입 페이지 |
| `/` | 일기 목록 (메인) |
| `/write` | 일기 작성 |
| `/diary/[id]` | 일기 상세 |
| `/diary/[id]/edit` | 일기 수정 |

---

## DB 스키마 (Supabase)

### `diaries` 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | `uuid` (PK, default `gen_random_uuid()`) | 일기 고유 ID |
| `user_id` | `uuid` (FK → `auth.users.id`) | 작성자 ID |
| `title` | `text` | 제목 |
| `content` | `text` | 본문 |
| `date` | `date` | 일기 날짜 |
| `created_at` | `timestamptz` (default `now()`) | 생성 시각 |
| `updated_at` | `timestamptz` (default `now()`) | 수정 시각 |
