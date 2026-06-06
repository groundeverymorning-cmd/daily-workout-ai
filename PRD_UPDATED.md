# 📄 데일리 오운완 AI (Daily Workout Log with AI) - 수정본

## 1. 프로젝트 개요 (Overview)

**제품명**: 데일리 오운완 AI

**목적**: 매일의 운동 내역을 기록하면, Anthropic Claude API가 자동으로 오늘의 운동 한 줄 평을 남겨주는 초간단 웹 서비스.

**개발 방식**: Claude Code CLI 기반 멀티 에이전트 + GitHub MCP 연동

---

## 2. 핵심 기술 스택 & 구조 (Architecture)

| 레이어 | 기술 |
|--------|------|
| **Frontend** | Next.js 14+ (App Router, Tailwind CSS, TypeScript) |
| **Backend** | Next.js API Routes (`/api/*`) |
| **Database** | Supabase (PostgreSQL) + RLS (Row Level Security) |
| **Authentication** | Supabase Auth (이메일) |
| **AI Feature** | Anthropic Claude API (Messages API) |
| **Deployment** | GitHub (MCP) → Vercel (자동 배포) |
| **Libraries** | `supabase-js`, `@anthropic-ai/sdk`, `next`, `tailwindcss` |

---

## 3. 수정된 데이터베이스 스키마

### `users` 테이블
```sql
id (UUID, PK, auth.users와 매핑)
email (TEXT, UNIQUE)
created_at (TIMESTAMP, DEFAULT NOW())
```

### `workout_logs` 테이블
```sql
id (UUID, PK)
user_id (UUID, FK → users.id)
created_at (TIMESTAMP, DEFAULT NOW())
updated_at (TIMESTAMP, DEFAULT NOW())
workout_date (DATE)
running_distance (NUMERIC, nullable, km 단위)
cycling_distance (NUMERIC, nullable, km 단위)
swimming_distance (NUMERIC, nullable, m 단위)
ai_comment (TEXT, nullable) ← AI가 생성할 때까지 NULL
```

**Row Level Security (RLS)**:
- 모든 사용자는 자신의 workout_logs만 조회/수정 가능

---

## 4. 주요 기능

### 4.1 운동 기록 저장
- 사용자가 운동 내역 입력 (날짜, 거리)
- `POST /api/workouts` → Supabase에 저장
- **AI 생성 타이밍**: 기록 저장 즉시 (백그라운드)

### 4.2 AI 한 줄 평 자동 생성
- Claude API 호출
- Prompt: "오늘 운동 기록: [달리기 5km, 수영 200m] → 한 줄 평 (긍정, 짧음)"
- 생성된 text를 `ai_comment`에 업데이트

### 4.3 운동 기록 조회
- `GET /api/workouts` → 해당 사용자의 모든 기록 조회 (최신순)
- 각 기록마다 AI 평가 함께 표시

---

## 5. API 명세 (간단)

### POST /api/workouts
**요청**:
```json
{
  "workout_date": "2026-06-06",
  "running_distance": 5.0,
  "cycling_distance": null,
  "swimming_distance": 200
}
```

**응답**: `{ id, created_at, ai_comment (초기엔 null) }`

---

### GET /api/workouts
**응답**: `[ { id, workout_date, running_distance, ..., ai_comment }, ... ]`

---

## 6. 환경 변수 (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
ANTHROPIC_API_KEY=xxx
```

---

## 7. 개발 단계

1. **프로젝트 초기화 & 환경 설정**
2. **Supabase 데이터베이스 구축**
3. **인증 시스템 구현**
4. **API 라우트 개발**
5. **프론트엔드 UI 개발**
6. **배포 & CI/CD 설정**
7. **테스트 & 최적화**

---

## 8. 예상 일정

| 단계 | 예상 시간 |
|------|---------|
| 1-3 | 30분 |
| 4 | 45분 |
| 5 | 1시간 |
| 6 | 20분 |
| 7 | 30분 |
| **총계** | **약 3시간** |
