import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateWorkoutComment } from "@/lib/anthropic";
import type { WorkoutLog } from "@/types/workout";

export async function GET(req: Request) {
  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("workout_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("workout_date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/workouts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      workout_date,
      running_distance,
      cycling_distance,
      swimming_distance,
    } = body;

    if (!workout_date) {
      return NextResponse.json(
        { error: "workout_date is required" },
        { status: 400 }
      );
    }

    // 1. 운동 기록 저장
    const { data: newLog, error: insertError } = await supabaseAdmin
      .from("workout_logs")
      .insert([
        {
          user_id: user.id,
          workout_date,
          running_distance: running_distance || null,
          cycling_distance: cycling_distance || null,
          swimming_distance: swimming_distance || null,
        },
      ])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    // 2. Claude로 ai_comment 생성
    const workoutItems = [
      running_distance && `달리기 ${running_distance}km`,
      cycling_distance && `자전거 ${cycling_distance}km`,
      swimming_distance && `수영 ${swimming_distance}m`,
    ]
      .filter(Boolean)
      .join(", ");

    const workoutSummary = workoutItems || "기록 없음";

    let aiComment = "운동 기록이 저장되었습니다!";
    try {
      aiComment = await generateWorkoutComment(workoutSummary);
    } catch (error) {
      console.error("Failed to generate AI comment:", error);
      // ai_comment 생성 실패해도 기록은 저장됨
    }

    // 3. ai_comment 업데이트
    const { data: updatedLog, error: updateError } = await supabaseAdmin
      .from("workout_logs")
      .update({ ai_comment: aiComment })
      .eq("id", newLog.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json(updatedLog, { status: 201 });
  } catch (error) {
    console.error("POST /api/workouts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
