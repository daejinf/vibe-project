# 프로젝트 에이전트 규칙 (AGENTS.md)

이 문서는 AI·자동화 도구가 이 프로젝트에서 코드를 작성·수정할 때 반드시 따를 규칙입니다.  
사용자가 매번 같은 스택·방식을 설명하지 않아도 되도록 기술합니다.

---

## 기술 스택 (고정)

| 영역 | 선택 |
|------|------|
| 프레임워크 | **Next.js** — **App Router** (`app/` 디렉터리)만 사용 |
| 언어 | **TypeScript** (`.ts`, `.tsx`) |
| 스타일 | **Tailwind CSS** |
| 데이터베이스·백엔드 | **Supabase** (클라이언트·서버 연동, RLS 등은 Supabase 관례에 맞게) |

---

## 반드시 지켜야 할 것 (DO)

- **App Router 구조**로 라우팅·레이아웃·로딩·에러 UI를 구성한다. (`pages/` 기반 Pages Router는 사용하지 않는다.)
- 모든 새 컴포넌트·유틸·설정은 **TypeScript**로 작성하고, 타입을 명시적으로 다룬다 (`any` 남용 금지는 아래 DON'T 참고).
- UI 스타일은 **Tailwind 유틸리티 클래스**를 우선 사용한다. 인라인 `style`은 Tailwind로 표현하기 어려운 경우에만 최소한으로 사용한다.
- 데이터 영속·인증·실시간 등은 **Supabase** 클라이언트·서버 API를 사용하고, 환경 변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 등)는 `.env.local` 패턴을 따른다.
- **서버 컴포넌트를 기본**으로 두고, `use client`는 브라우저 API·훅·이벤트 핸들러가 필요한 경계에만 붙인다.
- Next.js **공식 권장 패턴**을 따른다 (예: `metadata`/`generateMetadata`, Server Actions 사용 시 폼·보안 고려).
- 기존 프로젝트 파일의 **네이밍·폴더 구조·import 스타일**이 있으면 그에 맞춘다.

---

## 하면 안 되는 것 (DON'T)

- **Pages Router** (`pages/` 아래 라우트, `getServerSideProps` 등)로 새 기능을 추가하지 않는다.
- **JavaScript만 있는 새 파일** (`.js`/`.jsx`)을 기본으로 추가하지 않는다. TypeScript로 작성한다.
- **CSS Modules·Styled Components 등**으로 스타일을 새로 도입해 스택을 바꾸지 않는다. (이미 있다면 제거 요청이 없는 한 유지만 한다.)
- **Prisma·Firebase·Mongo 직접 연결** 등 이 문서에 없는 DB를 임의로 도입하지 않는다. DB는 Supabase를 사용한다.
- **`any` 남용**, `@ts-ignore` 무분별 사용으로 타입 검사를 무력화하지 않는다.
- **민감한 키**(Service Role Key 등)를 클라이언트 번들·`NEXT_PUBLIC_*`에 노출하지 않는다.
- 사용자가 요청하지 않은 **대규모 리팩터·불필요한 파일 추가·문서 남발**을 하지 않는다. 요청 범위 안에서 최소한으로 수정한다.

---

## 요약

Next.js **App Router** + **TypeScript** + **Tailwind** + **Supabase**만 사용한다.  
페이지 라우터·순수 JS 우선·다른 DB·다른 CSS 스택 도입은 하지 않는다.
