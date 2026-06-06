"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import WorkoutForm from "@/components/WorkoutForm";
import WorkoutList from "@/components/WorkoutList";
import type { WorkoutLog } from "@/types/workout";

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await fetch("/api/workouts");
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data);
      }
    } catch (error) {
      console.error("Failed to fetch workouts:", error);
    }
  };

  const handleSubmit = async (data: {
    workout_date: string;
    running_distance: number | null;
    cycling_distance: number | null;
    swimming_distance: number | null;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchWorkouts();
        alert("운동 기록이 저장되었습니다!");
      } else {
        alert("저장 실패");
      }
    } catch (error) {
      console.error("Failed to save workout:", error);
      alert("저장 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">🏋️ 데일리 오운완 AI</h1>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WorkoutForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            <WorkoutList workouts={workouts} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}
