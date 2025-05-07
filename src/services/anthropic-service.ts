import Anthropic from "@anthropic-ai/sdk";
import { AIGenerateTestParams, AIService } from "@/types/ai";

export class AnthropicService implements AIService {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateTest(params: AIGenerateTestParams): Promise<string> {
    const { code, testFramework } = params;

    const response = await this.anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `Generate a comprehensive unit test for the following code using ${testFramework}. Include test cases for edge cases and error scenarios:\n\n${code}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Expected text response from Claude");
    }

    return content.text;
  }
}
