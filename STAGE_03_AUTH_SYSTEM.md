# 🔐 STAGE 3: 인증 시스템 구현

## 목표
Supabase Auth 설정, Next.js 미들웨어 구현, 로그인/로그아웃 페이지 생성

---

## Task Checklist

- [ ] Supabase Auth 설정 (Email provider 활성화)
- [ ] `lib/supabase.ts` 작성 (클라이언트 & 서버 클라이언트)
- [ ] `middleware.ts` 작성 (인증 확인)
- [ ] `app/auth` 폴더 구성 (로그인/회원가입 페이지)
- [ ] 로그인/로그아웃 UI 컴포넌트 생성
- [ ] 로컬 테스트: 회원가입 → 로그인 → 대시보드 리다이렉트

---

## 프롬프트 (AI 에이전트용)

당신의 역할: **백엔드 엔지니어** (인증 로직)

### 요청사항:

#### 1. `lib/supabase.ts` 작성

**클라이언트 사용 (브라우저)**:
```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**서버 사용 (Node.js)**:
```typescript
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

#### 2. `middleware.ts` 작성 (Next.js App Router)

역할:
- 모든 요청을 확인
- `/api/*` 제외 (공개)
- `/auth` 제외 (인증 전)
- 나머지: 인증되지 않으면 `/auth/login`으로 리다이렉트

```typescript
import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("sb-access-token")?.value;

  if (!token && !request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

#### 3. `app/auth/login/page.tsx` 작성

UI:
- Email 입력
- 비밀번호 입력
- "로그인" & "회원가입" 버튼

로직:
```typescript
const handleLogin = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) alert(error.message);
  else router.push("/dashboard");
};
```

#### 4. `app/auth/signup/page.tsx` 작성

유사하지만 `signUp` 사용:
```typescript
const { error } = await supabase.auth.signUp({
  email,
  password,
});
```

#### 5. 로그아웃 컴포넌트 작성

```typescript
const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push("/auth/login");
};
```

---

## 폴더 구조

```
app/
├── auth/
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── layout.tsx (공유 스타일)
├── dashboard/
│   └── page.tsx (인증 필요)
├── middleware.ts
└── page.tsx (홈페이지 또는 리다이렉트)

lib/
├── supabase.ts
```

---

## 성공 기준

- ✅ Supabase Auth 이메일 provider 활성화?
- ✅ `npm run dev` 후 `/auth/login` 접근 가능?
- ✅ 회원가입 가능? (Supabase 콘솔에서 사용자 확인)
- ✅ 로그인 후 대시보드로 리다이렉트?
- ✅ 로그아웃 버튼 작동?

---

## 주의사항

- Supabase JWT Secret은 `.env.local`에 추가 필요 (Supabase 대시보드 → Project Settings → API)
- 쿠키 기반 세션 관리 권장 (클라이언트 라이브러리 자동 처리)

---

## 다음 단계

→ STAGE 4: API 라우트 개발
