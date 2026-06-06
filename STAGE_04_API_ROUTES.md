# 🔌 STAGE 4: API 라우트 개발

## 목표
POST/GET 운동 기록 API 작성, Claude AI 통합, ai_comment 자동 생성

---

## Task Checklist

- [ ] `app/api/workouts/route.ts` 작성 (GET, POST)
- [ ] Claude API 클라이언트 설정 (`lib/anthropic.ts`)
- [ ] 운동 기록 저장 로직 (POST)
- [ ] Claude로 ai_comment 생성 및 DB 업데이트
- [ ] 운동 기록 조회 로직 (GET, 소유자만)
- [ ] API 테스트 (curl 또는 Postman)

---

## 프롬프트 (AI 에이전트용)

당신의 역할: **백엔드 엔지니어** (API & AI 통합)

### 요청사항:

#### 1. `lib/anthropic.ts` 작성

```typescript
import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateWorkoutComment(workoutSummary: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: `다음은 오늘의 운동 기록입니다:\n${workoutSummary}\n\n한 줄 평을 지어주세요. (긍정적이고 간단하게, 한국어)`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}
```

#### 2. `app/api/workouts/route.ts` 작성

**GET 핸들러** (모든 운동 기록 조회):
```typescript
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("workout_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
```

**POST 핸들러** (새 운동 기록 저장 + AI 생성):
```typescript
import { generateWorkoutComment } from "@/lib/anthropic";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workout_date, running_distance, cycling_distance, swimming_distance } = await req.json();

  // 1. 운동 기록 저장
  const { data: newLog, error: insertError } = await supabase
    .from("workout_logs")
    .insert([{
      user_id: user.id,
      workout_date,
      running_distance,
      cycling_distance,
      swimming_distance,
    }])
    .select()
    .single();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 });

  // 2. Claude로 ai_comment 생성
  const workoutSummary = [
    running_distance && `달리기 ${running_distance}km`,
    cycling_distance && `자전거 ${cycling_distance}km`,
    swimming_distance && `수영 ${swimming_distance}m`,
  ]
    .filter(Boolean)
    .join(", ");

  const aiComment = await generateWorkoutComment(workoutSummary || "기록 없음");

  // 3. ai_comment 업데이트
  const { data: updatedLog, error: updateError } = await supabase
    .from("workout_logs")
    .update({ ai_comment: aiComment })
    .eq("id", newLog.id)
    .select()
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });
  return NextResponse.json(updatedLog, { status: 201 });
}
```

#### 3. 에러 처리 & 타입 정의

```typescript
// 타입 정의 (types/workout.ts)
export interface WorkoutLog {
  id: string;
  user_id: string;
  created_at: string;
  workout_date: string;
  running_distance: number | null;
  cycling_distance: number | null;
  swimming_distance: number | null;
  ai_comment: string | null;
}
```

---

## API 테스트 (curl)

```bash
# 로그인 후 토큰 획득 (생략)

# POST: 새 운동 기록
curl -X POST http://localhost:3000/api/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "workout_date": "2026-06-06",
    "running_distance": 5.0,
    "cycling_distance": null,
    "swimming_distance": 200
  }'

# GET: 모든 운동 기록
curl http://localhost:3000/api/workouts
```

---

## 성공 기준

- ✅ POST `/api/workouts`로 새 기록 저장?
- ✅ Claude API 호출 성공 & ai_comment 생성?
- ✅ GET `/api/workouts`로 모든 기록 조회?
- ✅ Supabase에서 업데이트된 ai_comment 확인?
- ✅ 인증되지 않은 사용자는 401 반환?

---

## 주의사항

- Anthropic API 할당량 확인 (요청 제한)
- ai_comment 생성 실패 시 에러 처리
- 요청 바디 검증 (빈 값, 음수 등)

---

## 다음 단계

→ STAGE 5: 프론트엔드 UI 개발
