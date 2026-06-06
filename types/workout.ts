export interface WorkoutLog {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  workout_date: string;
  running_distance: number | null;
  cycling_distance: number | null;
  swimming_distance: number | null;
  ai_comment: string | null;
}
