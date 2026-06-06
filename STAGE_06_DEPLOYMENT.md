# 🚀 STAGE 6: 배포 & CI/CD 설정

## 목표
Vercel 배포 설정, 환경 변수 연동, GitHub Actions (선택사항)

---

## Task Checklist

- [ ] Vercel 계정 생성 & GitHub 연동
- [ ] Vercel 프로젝트 생성 (daily-workout-ai)
- [ ] 프로젝트 환경 변수 설정 (4개)
- [ ] 초기 배포 (main 브랜치)
- [ ] 배포 URL 확인 및 기본 테스트
- [ ] (선택) GitHub Actions CI 설정

---

## 프롬프트 (AI 에이전트용)

당신의 역할: **DevOps 엔지니어** (배포 자동화)

### 요청사항:

#### 1. Vercel 연동 (GitHub MCP 사용)

```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. Vercel에 로그인
vercel login

# 3. 프로젝트 초기화
vercel --prod
```

**Vercel 대시보드에서 수동 설정:**
- Project Name: `daily-workout-ai`
- Framework: Next.js
- Root Directory: `.` (프로젝트 루트)

#### 2. 환경 변수 설정 (Vercel 대시보드)

Vercel 프로젝트 → Settings → Environment Variables

```env
# Public (클라이언트 노출 가능)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Secret (서버 전용)
SUPABASE_SERVICE_ROLE_KEY=xxx
ANTHROPIC_API_KEY=xxx
```

**주의:**
- 각 환경변수 옆의 "Show" 체크해야 배포에 포함됨
- 실제 값은 Supabase & Anthropic 대시보드에서 복사

#### 3. 배포 트리거 (GitHub MCP)

```bash
# main 브랜치에 푸시하면 자동으로 Vercel 배포
git push origin main
```

Vercel 대시보드에서 배포 로그 확인

#### 4. (선택) GitHub Actions CI 설정

`.github/workflows/deploy.yml` 생성:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Vercel CLI
        run: npm install -g vercel
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: vercel --prod --token $VERCEL_TOKEN
```

**GitHub Secrets 설정 필요:**
- VERCEL_TOKEN (Vercel Account Settings → Tokens에서 생성)

---

## 배포 후 확인 사항

**Vercel 대시보드:**
- ✅ Deployments 탭에서 최신 배포 상태 확인 (✅ Production)
- ✅ Analytics 탭에서 성능 확인

**배포된 URL:**
```
https://daily-workout-ai.vercel.app (또는 커스텀 도메인)
```

**기본 테스트:**
1. 배포 URL 접속 → 로그인 페이지 표시?
2. 회원가입 후 로그인?
3. 대시보드 접속 → 운동 폼 표시?
4. 운동 기록 저장 → AI 코멘트 생성?

---

## 성공 기준

- ✅ Vercel 배포 URL 생성?
- ✅ 환경 변수 4개 모두 설정?
- ✅ 배포 상태: Production ✅?
- ✅ 배포 URL에서 로그인 가능?
- ✅ 전체 기능 작동?

---

## 주의사항

- 배포 전 `.env.local`의 민감 정보는 `.gitignore`에 포함
- Vercel 빌드 시간 초과 주의 (시간초과 시 메모리 최적화 필요)
- 배포 실패 시 Vercel 대시보드 → Deployments → 로그 확인

---

## 다음 단계

→ STAGE 7: 테스트 & 최적화
