import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateWorkoutComment(
  workoutSummary: string
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `다음은 오늘의 운동 기록입니다:\n${workoutSummary}\n\n한 줄 평을 지어주세요. (긍정적이고 간단하게, 한국어, 최대 50자)`,
        },
      ],
    });

    if (message.content[0].type === "text") {
      return message.content[0].text;
    }
    return "운동 기록이 저장되었습니다!";
  } catch (error) {
    console.error("Claude API 에러:", error);
    throw error;
  }
}
