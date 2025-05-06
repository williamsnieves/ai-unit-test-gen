import OpenAI from "openai";
import { AIGenerateTestParams, AIService } from "@/types/ai";

export class OpenAIService implements AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateTest(params: AIGenerateTestParams): Promise<string> {
    const { code, testFramework, model } = params;

    const response = await this.openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are an expert at writing unit tests. Generate a comprehensive unit test for the provided code using ${testFramework}. Include test cases for edge cases and error scenarios.`,
        },
        {
          role: "user",
          content: code,
        },
      ],
      temperature: 0.2,
    });

    return response.choices[0].message.content || "";
  }
}
