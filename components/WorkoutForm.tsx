"use client";

import { useState } from "react";

interface WorkoutFormProps {
  onSubmit: (data: {
    workout_date: string;
    running_distance: number | null;
    cycling_distance: number | null;
    swimming_distance: number | null;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function WorkoutForm({ onSubmit, isLoading }: WorkoutFormProps) {
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
      running_distance: formData.running_distance
        ? parseFloat(formData.running_distance)
        : null,
      cycling_distance: formData.cycling_distance
        ? parseFloat(formData.cycling_distance)
        : null,
      swimming_distance: formData.swimming_distance
        ? parseFloat(formData.swimming_distance)
        : null,
    };

    await onSubmit(payload);

    setFormData({
      workout_date: new Date().toISOString().split("T")[0],
      running_distance: "",
      cycling_distance: "",
      swimming_distance: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-6 sticky top-4"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900">오늘의 운동 기록</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📅 운동 날짜
          </label>
          <input
            type="date"
            value={formData.workout_date}
            onChange={(e) =>
              setFormData({ ...formData, workout_date: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏃 달리기 (km)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={formData.running_distance}
            onChange={(e) =>
              setFormData({ ...formData, running_distance: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="예: 5.0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🚴 자전거 (km)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={formData.cycling_distance}
            onChange={(e) =>
              setFormData({ ...formData, cycling_distance: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="예: 10.0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏊 수영 (m)
          </label>
          <input
            type="number"
            step="50"
            min="0"
            value={formData.swimming_distance}
            onChange={(e) =>
              setFormData({ ...formData, swimming_distance: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="예: 200"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 transition"
        >
          {isLoading ? "저장 중..." : "💾 저장"}
        </button>
      </div>
    </form>
  );
}
