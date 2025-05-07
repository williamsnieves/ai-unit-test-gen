import { HfInference } from "@huggingface/inference";
import { AI_CONFIG } from "@/config/ai";
import { AIGenerateTestParams, AIService } from "@/types/ai";

interface PromptStructure {
  task: string;
  format: string;
  warnings: string;
  context: string;
}

export class HuggingFaceService implements AIService {
  private hf: HfInference;

  constructor() {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error("HUGGINGFACE_API_KEY is not defined");
    }
    this.hf = new HfInference(apiKey);
  }

  private structurePrompt(params: {
    code: string;
    testFramework: string;
    structure: PromptStructure;
  }): string {
    const { code, testFramework, structure } = params;
    return `
GOAL:
${structure.task}

RESPONSE FORMAT:
${structure.format}

WARNINGS:
${structure.warnings}

ADDITIONAL CONTEXT:
${structure.context}

CODE TO TEST:
\`\`\`
${code}
\`\`\`

Please generate a comprehensive unit test using ${testFramework} following the structure above.
`;
  }

  async generateTest(params: AIGenerateTestParams): Promise<string> {
    const { code, testFramework, model } = params;
    const modelConfig =
      AI_CONFIG.models[model as keyof typeof AI_CONFIG.models];

    if (modelConfig.provider !== "huggingface") {
      throw new Error(`Invalid model provider for ${model}`);
    }

    const promptStructure: PromptStructure = {
      task: "Generate a comprehensive unit test that covers core functionality, edge cases, and error scenarios.",
      format: `
1. Test Suite Structure:
   - Use describe blocks for grouping related tests
   - Use clear, descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)

2. Test Cases:
   - Include happy path scenarios
   - Include edge cases
   - Include error scenarios
   - Use appropriate assertions

3. Code Style:
   - Use proper indentation
   - Add comments for complex logic if it is strictly necessary (code should speak clearly)
   - Follow clean code rules
   - Follow best practices for ${testFramework}`,
      warnings: `
- Ensure all test cases are meaningful and test actual functionality
- Avoid testing implementation details
- Make sure mocks and stubs are properly set up
- Verify all assertions are valid and necessary
- Keep code self-documenting and minimize comments
- Follow SOLID principles and clean code practices`,
      context: `
- The test should be production-ready
- Consider performance implications
- Follow the project's testing conventions
- Ensure good test coverage
- Write tests that are easy to understand and maintain
- Focus on readability and maintainability`,
    };

    try {
      const response = await this.hf.chatCompletion({
        provider: modelConfig.inferenceProvider,
        model: modelConfig.modelId,
        messages: [
          {
            role: "system",
            content:
              "You are an expert at writing unit tests. Follow the provided prompt structure exactly. Write clean, maintainable, and self-documenting code.",
          },
          {
            role: "user",
            content: this.structurePrompt({
              code,
              testFramework,
              structure: promptStructure,
            }),
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
