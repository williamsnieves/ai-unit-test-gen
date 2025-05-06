import { NextResponse } from "next/server";
import { AIServiceFactory } from "@/services/ai-service-factory";
import { AIModel } from "@/types/ai";
import { AI_CONFIG } from "@/config/ai";

export async function POST(request: Request) {
  try {
    const {
      code,
      testFramework,
      model = AI_CONFIG.defaultModel,
    } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const aiService = AIServiceFactory.getService(model as AIModel);
    const generatedTest = await aiService.generateTest({
      code,
      testFramework,
      model: model as AIModel,
    });

    return new NextResponse(generatedTest, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error generating test:", error);
    return NextResponse.json(
      { error: "Failed to generate test" },
      { status: 500 }
    );
  }
}
