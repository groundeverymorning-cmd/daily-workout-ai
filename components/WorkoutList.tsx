"use client";

import type { WorkoutLog } from "@/types/workout";
import WorkoutCard from "./WorkoutCard";

interface WorkoutListProps {
  workouts: WorkoutLog[];
  isLoading?: boolean;
}

export default function WorkoutList({ workouts, isLoading }: WorkoutListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">
          아직 운동 기록이 없습니다. 첫 기록을 남겨보세요! 💪
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">운동 기록</h2>
      <div className="space-y-4">
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}
