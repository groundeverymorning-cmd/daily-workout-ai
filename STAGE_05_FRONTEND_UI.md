# 🎨 STAGE 5: 프론트엔드 UI 개발

## 목표
운동 입력 폼, 운동 기록 리스트, AI 코멘트 표시 UI 구현

---

## Task Checklist

- [ ] `app/dashboard/page.tsx` 생성 (메인 페이지)
- [ ] `components/WorkoutForm.tsx` 작성 (입력 폼)
- [ ] `components/WorkoutList.tsx` 작성 (기록 리스트)
- [ ] `components/WorkoutCard.tsx` 작성 (개별 카드)
- [ ] `components/Header.tsx` 작성 (네비게이션 + 로그아웃)
- [ ] Tailwind CSS로 스타일링
- [ ] 로딩 상태 & 에러 처리
- [ ] 로컬 테스트: 폼 제출 → 기록 저장 → 리스트 갱신

---

## 프롬프트 (AI 에이전트용)

당신의 역할: **UI/UX 엔지니어** (프론트엔드)

### 요청사항:

#### 1. `components/Header.tsx` 작성

```typescript
"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">데일리 오운완 AI</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
```

#### 2. `components/WorkoutForm.tsx` 작성

```typescript
"use client";

import { useState } from "react";

interface Props {
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function WorkoutForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState({
    workout_date: new Date().toISOString().split("T")[0],
    running_distance: "",
    cycling_distance: "",
    swimming_distance: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      workout_date: formData.workout_date,
      running_distance: formData.running_distance ? parseFloat(formData.running_distance) : null,
      cycling_distance: formData.cycling_distance ? parseFloat(formData.cycling_distance) : null,
      swimming_distance: formData.swimming_distance ? parseFloat(formData.swimming_distance) : null,
    };
    await onSubmit(payload);
    setFormData({ ...formData, running_distance: "", cycling_distance: "", swimming_distance: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 max-w-md">
      <h2 className="text-lg font-bold mb-4">오늘의 운동 기록</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">운동 날짜</label>
        <input
          type="date"
          value={formData.workout_date}
          onChange={(e) => setFormData({ ...formData, workout_date: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">달리기 (km)</label>
        <input
          type="number"
          step="0.1"
          value={formData.running_distance}
          onChange={(e) => setFormData({ ...formData, running_distance: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="예: 5.0"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">자전거 (km)</label>
        <input
          type="number"
          step="0.1"
          value={formData.cycling_distance}
          onChange={(e) => setFormData({ ...formData, cycling_distance: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="예: 10.0"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">수영 (m)</label>
        <input
          type="number"
          step="50"
          value={formData.swimming_distance}
          onChange={(e) => setFormData({ ...formData, swimming_distance: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="예: 200"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded disabled:opacity-50"
      >
        {isLoading ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
```

#### 3. `components/WorkoutCard.tsx` 작성

```typescript
import { WorkoutLog } from "@/types/workout";

interface Props {
  workout: WorkoutLog;
}

export default function WorkoutCard({ workout }: Props) {
  const exercises = [
    workout.running_distance && `🏃 달리기 ${workout.running_distance}km`,
    workout.cycling_distance && `🚴 자전거 ${workout.cycling_distance}km`,
    workout.swimming_distance && `🏊 수영 ${workout.swimming_distance}m`,
  ].filter(Boolean);

  return (
    <div className="bg-white shadow rounded p-4 border-l-4 border-blue-600">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm text-gray-500">{workout.workout_date}</p>
          <p className="text-lg font-semibold">{exercises.join(" + ")}</p>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(workout.created_at).toLocaleDateString()}
        </span>
      </div>

      {workout.ai_comment ? (
        <p className="text-md text-green-700 font-medium italic">💬 {workout.ai_comment}</p>
      ) : (
        <p className="text-sm text-gray-400">AI 평가 생성 중...</p>
      )}
    </div>
  );
}
```

#### 4. `components/WorkoutList.tsx` 작성

```typescript
"use client";

import { WorkoutLog } from "@/types/workout";
import WorkoutCard from "./WorkoutCard";

interface Props {
  workouts: WorkoutLog[];
  isLoading?: boolean;
}

export default function WorkoutList({ workouts, isLoading }: Props) {
  if (isLoading) return <p className="text-center text-gray-500">로딩 중...</p>;
  if (workouts.length === 0) return <p className="text-center text-gray-500">기록이 없습니다.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">운동 기록</h2>
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}
```

#### 5. `app/dashboard/page.tsx` 작성

```typescript
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import WorkoutForm from "@/components/WorkoutForm";
import WorkoutList from "@/components/WorkoutList";
import { WorkoutLog } from "@/types/workout";

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    setIsLoading(true);
    const res = await fetch("/api/workouts");
    if (res.ok) {
      setWorkouts(await res.json());
    }
    setIsLoading(false);
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchWorkouts();
    } else {
      alert("저장 실패");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <WorkoutForm onSubmit={handleSubmit} isLoading={isLoading} />
        <div className="md:col-span-2">
          <WorkoutList workouts={workouts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
```

---

## 폴더 구조

```
app/
├── dashboard/
│   └── page.tsx
components/
├── Header.tsx
├── WorkoutForm.tsx
├── WorkoutList.tsx
├── WorkoutCard.tsx
types/
└── workout.ts
```

---

## 성공 기준

- ✅ 대시보드 페이지 로드 가능?
- ✅ 운동 폼에서 입력 & 저장?
- ✅ 저장 후 기록 리스트에 표시?
- ✅ AI 코멘트가 카드에 표시?
- ✅ 로그아웃 버튼 작동?
- ✅ Tailwind 스타일링 적용?

---

## 다음 단계

→ STAGE 6: 배포 & CI/CD 설정
