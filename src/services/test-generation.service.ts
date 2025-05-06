import { OpenAI } from "openai";
import { Anthropic } from "@anthropic-ai/sdk";
import { HuggingFaceService } from "./huggingface.service";
import { AI_CONFIG, AIModel } from "@/config/ai";

export class TestGenerationService {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private huggingface: HuggingFaceService;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.huggingface = new HuggingFaceService();
  }

  async generateTest(
    code: string,
    model: AIModel,
    testFramework: typeof AI_CONFIG.defaultTestFramework
  ): Promise<string> {
    const modelConfig = AI_CONFIG.models[model];

    switch (modelConfig.provider) {
      case "openai":
        return this.generateWithOpenAI(code, model, testFramework);
      case "anthropic":
        return this.generateWithAnthropic(code, testFramework);
      case "huggingface":
        return this.generateWithHuggingFace(code, model, testFramework);
      default:
        throw new Error(`Unsupported model provider: ${modelConfig.provider}`);
    }
  }

  private async generateWithOpenAI(
    code: string,
    model: AIModel,
    testFramework: typeof AI_CONFIG.defaultTestFramework
  ): Promise<string> {
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
      max_tokens: AI_CONFIG.models[model].maxTokens,
    });

    return response.choices[0].message.content || "";
  }

  private async generateWithAnthropic(
    code: string,
    testFramework: typeof AI_CONFIG.defaultTestFramework
  ): Promise<string> {
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

    return response.content[0].text;
  }

  private async generateWithHuggingFace(
    code: string,
    model: AIModel,
    testFramework: typeof AI_CONFIG.defaultTestFramework
  ): Promise<string> {
    return this.huggingface.generateTest(code, testFramework, model);
  }
}
