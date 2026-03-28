# 나만의 일기장 — API 스펙

이 문서는 프론트엔드(Next.js)와 백엔드(Supabase) 사이에 주고받는 데이터를 정리한 문서입니다.
Supabase Client SDK를 통해 직접 DB와 Auth를 호출하는 구조이므로, REST endpoint 대신 **Supabase 함수 호출** 기준으로 작성합니다.

---

## 1. 인증 (Supabase Auth)

### 1-1. 회원가입

- **함수**: `supabase.auth.signUp()`
- **요청 데이터**:

```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

- **응답 데이터** (성공):

```json
{
  "user": {
    "id": "a1b2c3d4-...",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOi...",
    "refresh_token": "v1.xxx..."
  }
}
```

- **에러 예시**: `{ "message": "User already registered" }`

---

### 1-2. 로그인

- **함수**: `supabase.auth.signInWithPassword()`
- **요청 데이터**:

```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

- **응답 데이터** (성공):

```json
{
  "user": {
    "id": "a1b2c3d4-...",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOi...",
    "refresh_token": "v1.xxx..."
  }
}
```

- **에러 예시**: `{ "message": "Invalid login credentials" }`

---

### 1-3. 로그아웃

- **함수**: `supabase.auth.signOut()`
- **요청 데이터**: 없음
- **응답 데이터**: `{ "error": null }` (성공 시)

---

### 1-4. 현재 사용자 조회

- **함수**: `supabase.auth.getUser()`
- **요청 데이터**: 없음 (세션 토큰 자동 사용)
- **응답 데이터**:

```json
{
  "user": {
    "id": "a1b2c3d4-...",
    "email": "user@example.com"
  }
}
```

- 비인증 상태이면 `user`가 `null` → 로그인 페이지로 리다이렉트

---

## 2. 일기 CRUD (diaries 테이블)

### 2-1. 일기 작성

- **함수**: `supabase.from("diaries").insert()`
- **요청 데이터**:

```json
{
  "title": "봄 나들이",
  "content": "오늘 날씨가 너무 좋아서 공원에 다녀왔다.",
  "date": "2026-03-27",
  "user_id": "a1b2c3d4-..."
}
```

- **응답 데이터** (성공):

```json
{
  "id": "f5e6d7c8-...",
  "user_id": "a1b2c3d4-...",
  "title": "봄 나들이",
  "content": "오늘 날씨가 너무 좋아서 공원에 다녀왔다.",
  "date": "2026-03-27",
  "created_at": "2026-03-27T12:00:00Z",
  "updated_at": "2026-03-27T12:00:00Z"
}
```

---

### 2-2. 일기 목록 조회

- **함수**: `supabase.from("diaries").select().order("date", { ascending: false })`
- **요청 데이터**: 없음 (로그인한 사용자의 일기만 조회)
- **응답 데이터** (성공):

```json
[
  {
    "id": "f5e6d7c8-...",
    "title": "봄 나들이",
    "date": "2026-03-27",
    "created_at": "2026-03-27T12:00:00Z"
  },
  {
    "id": "a9b8c7d6-...",
    "title": "비 오는 날",
    "date": "2026-03-25",
    "created_at": "2026-03-25T09:30:00Z"
  }
]
```

> 목록에서는 `content`를 빼고 `id`, `title`, `date`, `created_at`만 가져오면 충분합니다.

---

### 2-3. 일기 상세 보기

- **함수**: `supabase.from("diaries").select().eq("id", diaryId).single()`
- **요청 데이터**: URL 파라미터로 `id` 전달 (예: `/diary/f5e6d7c8-...`)
- **응답 데이터** (성공):

```json
{
  "id": "f5e6d7c8-...",
  "user_id": "a1b2c3d4-...",
  "title": "봄 나들이",
  "content": "오늘 날씨가 너무 좋아서 공원에 다녀왔다.",
  "date": "2026-03-27",
  "created_at": "2026-03-27T12:00:00Z",
  "updated_at": "2026-03-27T12:00:00Z"
}
```

---

### 2-4. 일기 수정

- **함수**: `supabase.from("diaries").update().eq("id", diaryId)`
- **요청 데이터** (변경할 필드만):

```json
{
  "title": "봄 나들이 (수정)",
  "content": "오늘 날씨가 너무 좋아서 공원에 다녀왔다. 벚꽃도 봤다!",
  "date": "2026-03-27"
}
```

- **응답 데이터** (성공):

```json
{
  "id": "f5e6d7c8-...",
  "user_id": "a1b2c3d4-...",
  "title": "봄 나들이 (수정)",
  "content": "오늘 날씨가 너무 좋아서 공원에 다녀왔다. 벚꽃도 봤다!",
  "date": "2026-03-27",
  "created_at": "2026-03-27T12:00:00Z",
  "updated_at": "2026-03-27T14:20:00Z"
}
```

---

### 2-5. 일기 삭제

- **함수**: `supabase.from("diaries").delete().eq("id", diaryId)`
- **요청 데이터**: URL 파라미터로 `id` 전달
- **응답 데이터** (성공): `{ "error": null }`

---

## 3. 페이지별 데이터 흐름 요약

| 페이지 | 호출하는 API | 주고받는 핵심 데이터 |
|--------|-------------|---------------------|
| `/signup` | `auth.signUp()` | email, password → user, session |
| `/login` | `auth.signInWithPassword()` | email, password → user, session |
| `/` (목록) | `from("diaries").select().order()` | → id, title, date 배열 |
| `/write` | `from("diaries").insert()` | title, content, date → 생성된 일기 |
| `/diary/[id]` | `from("diaries").select().eq().single()` | → id, title, content, date, created_at |
| `/diary/[id]/edit` | `from("diaries").update().eq()` | title, content, date → 수정된 일기 |
| `/diary/[id]` (삭제) | `from("diaries").delete().eq()` | id → 삭제 확인 |
