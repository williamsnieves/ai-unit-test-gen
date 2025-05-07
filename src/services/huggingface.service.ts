import { HfInference } from "@huggingface/inference";
import { AI_CONFIG } from "@/config/ai";
import { AIGenerateTestParams, AIService } from "@/types/ai";

export class HuggingFaceService implements AIService {
  private hf: HfInference;

  constructor() {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error("HUGGINGFACE_API_KEY is not defined");
    }
    this.hf = new HfInference(apiKey);
  }

  async generateTest(params: AIGenerateTestParams): Promise<string> {
    const { code, testFramework, model } = params;
    const modelConfig =
      AI_CONFIG.models[model as keyof typeof AI_CONFIG.models];

    if (modelConfig.provider !== "huggingface") {
      throw new Error(`Invalid model provider for ${model}`);
    }

    try {
      const response = await this.hf.chatCompletion({
        provider: modelConfig.inferenceProvider,
        model: modelConfig.modelId,
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
        parameters: {
          max_tokens: 1000,
          temperature: 0.2,
          top_p: 0.95,
          repetition_penalty: 1.1,
        },
      });

      if (!response.choices?.[0]?.message?.content) {
        throw new Error("No response generated from the model");
      }

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error generating test with Hugging Face:", error);
      if (error instanceof Error) {
        if (error.message.includes("No Inference Provider available")) {
          throw new Error(
            `Model ${modelConfig.modelId} is not available. Please check if you have access to this model or try a different one.`
          );
        }
        if (error.message.includes("401")) {
          throw new Error(
            "Invalid Hugging Face API key. Please check your API key configuration."
          );
        }
        if (error.message.includes("429")) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
      }
      throw new Error(
        `Failed to generate test with Hugging Face model: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
