import Anthropic from "@anthropic-ai/sdk";
import { AIGenerateTestParams, AIService } from "@/types/ai";

export class AnthropicService implements AIService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
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

    const message = await this.client.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    // The first content block should be text
    const contentBlock = message.content[0];
    if (!contentBlock || contentBlock.type !== "text") {
      throw new Error("No text content generated");
    }

    return contentBlock.text;
  }
}
