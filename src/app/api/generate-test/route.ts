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
      streaming = false,
      codeType = "javascript",
    } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const aiService = AIServiceFactory.getService(model as AIModel);

    // Only use streaming if both the user enabled it and the model supports it
    const shouldUseStreaming = streaming && aiService.supportsStreaming;

    if (shouldUseStreaming) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Start generating the test
            const generatedTest = await aiService.generateTest({
              code,
              testFramework,
              model: model as AIModel,
              codeType,
            });

            // Split the response into smaller chunks for streaming
            const lines = generatedTest.split("\n");
            for (const line of lines) {
              // Add a small delay between chunks for better streaming effect
              await new Promise((resolve) => setTimeout(resolve, 50));
              controller.enqueue(encoder.encode(line + "\n"));
            }
            controller.close();
          } catch (error) {
            console.error("Streaming error:", error);
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain",
          "Transfer-Encoding": "chunked",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const generatedTest = await aiService.generateTest({
      code,
      testFramework,
      model: model as AIModel,
      codeType,
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
