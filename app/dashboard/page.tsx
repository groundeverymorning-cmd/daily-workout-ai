"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import WorkoutForm from "@/components/WorkoutForm";
import WorkoutList from "@/components/WorkoutList";
import type { WorkoutLog } from "@/types/workout";

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/auth/login");
        return;
      }
      fetchWorkouts();
      setPageLoading(false);
    };
    checkAuth();
  }, [router]);

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

  if (pageLoading) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
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
