# 🚀 STAGE 1: 프로젝트 초기화 & 환경 설정

## 목표
GitHub 저장소, Next.js 프로젝트, Supabase/Anthropic 계정 설정 완료

---

## Task Checklist

- [ ] GitHub에서 `daily-workout-ai` 저장소 생성 (public)
- [ ] 로컬에서 저장소 클론 및 `ViveCoding/Last` 폴더로 이동
- [ ] Next.js 프로젝트 초기화 (TypeScript, Tailwind, App Router)
- [ ] `.gitignore` 설정 (.env.local, node_modules, .next 등)
- [ ] Supabase 프로젝트 생성 및 API URL/KEY 획득
- [ ] Anthropic API KEY 획득
- [ ] `.env.local` 작성 (4개 환경변수)
- [ ] 필수 라이브러리 설치: `supabase-js`, `@anthropic-ai/sdk`
- [ ] GitHub에 초기 커밋 및 푸시

---

## 프롬프트 (AI 에이전트용)

당신의 역할: **테크 리드** (프로젝트 기초 구축)

### 요청사항:
1. **GitHub 저장소 설정** (MCP 사용)
   - 저장소명: `daily-workout-ai`
   - 설명: "Daily workout log with AI-powered comment generation"
   - Public
   - README.md 포함 (간단히)
   
2. **Next.js 프로젝트 초기화**
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app
   ```
   - TypeScript: Yes
   - Tailwind CSS: Yes
   - App Router: Yes
   - ESLint: Yes

3. **환경 변수 설정**
   - `.env.local` 파일 생성 (아래 템플릿 참고)
   - 실제 키는 여전히 수동 입력 필요 (보안)

4. **초기 라이브러리 설치**
   ```
   npm install supabase @anthropic-ai/sdk
   ```

5. **폴더 구조 생성** (선택)
   ```
   app/
   ├── api/
   ├── components/
   ├── lib/
   └── page.tsx
   ```

6. **초기 커밋 & 푸시** (GitHub MCP)
   - 커밋 메시지: "chore: initialize Next.js project with Tailwind and TypeScript"
   - 브랜치: main

---

## 환경 변수 템플릿 (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Anthropic
ANTHROPIC_API_KEY=xxx
```

**주의**: 
- `NEXT_PUBLIC_*`로 시작하는 변수는 클라이언트에서 노출됨 (API KEY는 비공개)
- Supabase ANON_KEY는 공개 가능 (RLS로 보호)
- SERVICE_ROLE_KEY와 ANTHROPIC_API_KEY는 서버 전용 비밀

---

## 성공 기준

- ✅ GitHub에 초기 저장소가 push되었는가?
- ✅ `npm run dev`로 localhost:3000 실행되는가?
- ✅ `.env.local` 파일이 존재하는가?
- ✅ 필수 라이브러리 설치 완료?

---

## 다음 단계

→ STAGE 2: Supabase 데이터베이스 구축
