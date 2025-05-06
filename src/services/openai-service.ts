import OpenAI from "openai";
import { AIGenerateTestParams, AIService } from "@/types/ai";

export class OpenAIService implements AIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateTest({
    code,
    testFramework,
  }: AIGenerateTestParams): Promise<string> {
    const prompt = `Generate a unit test for the following code using ${testFramework}. The test should be comprehensive and follow best practices. Include comments explaining the test cases.

Code:
${code}

Generate the test code:`;

    const completion = await this.client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates unit tests. You should provide complete, working test code that follows best practices.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const generatedTest = completion.choices[0]?.message?.content;

    if (!generatedTest) {
      throw new Error("No test generated");
    }

    return generatedTest;
  }
}
