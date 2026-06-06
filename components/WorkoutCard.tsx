import type { WorkoutLog } from "@/types/workout";

interface WorkoutCardProps {
  workout: WorkoutLog;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const exercises = [
    workout.running_distance && `🏃 달리기 ${workout.running_distance}km`,
    workout.cycling_distance && `🚴 자전거 ${workout.cycling_distance}km`,
    workout.swimming_distance && `🏊 수영 ${workout.swimming_distance}m`,
  ].filter(Boolean);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-blue-600 p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-500">
            {formatDate(workout.workout_date)}
          </p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {exercises.length > 0 ? exercises.join(" + ") : "기록 없음"}
          </p>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(workout.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="border-t pt-3">
        {workout.ai_comment ? (
          <p className="text-base text-blue-700 font-medium italic">
            💬 "{workout.ai_comment}"
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">⏳ AI 평가 생성 중...</p>
        )}
      </div>
    </div>
  );
}
