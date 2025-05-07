import OpenAI from "openai";
import { AIService, AIGenerateTestParams } from "@/types/ai";
import { OPENAI_TOOLS } from "@/config/tools.config";

export class OpenAIService implements AIService {
  private openai: OpenAI;
  public supportsStreaming = true;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateTest({
    code,
    testFramework,
    model,
    codeType = "javascript",
    streaming = false,
  }: AIGenerateTestParams): Promise<string> {
    const messages = [
      {
        role: "system" as const,
        content: `You are an expert at writing clean, maintainable, and self-documenting code. Follow these guidelines strictly:

1. Write code that is easy to read and understand
2. Use meaningful variable and function names
3. Add comments only when necessary to explain complex logic
4. Follow the language's best practices and conventions
5. Keep functions small and focused on a single responsibility
6. Use proper error handling and edge cases
7. Write tests that are clear and well-structured

Generate a complete unit test suite for the provided code using ${testFramework}. The test suite should:
- Test all edge cases and error conditions
- Include proper setup and teardown
- Use descriptive test names
- Follow the ${testFramework} best practices
- Be written in ${codeType}

DO NOT include any explanations or comments in the response. Only provide the complete test code.`,
      },
      {
        role: "user" as const,
        content: `Generate a complete unit test suite for this ${codeType} code using ${testFramework}:\n\n${code}`,
      },
    ];

    try {
      if (streaming) {
        const stream = await this.openai.chat.completions.create({
          model,
          messages,
          tools: OPENAI_TOOLS,
          tool_choice: "auto",
          stream: true,
        });

        let fullResponse = "";
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          fullResponse += content;
        }
        return fullResponse;
      }

      const response = await this.openai.chat.completions.create({
        model,
        messages,
        tools: OPENAI_TOOLS,
        tool_choice: "auto",
        stream: false,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No content in response");
      }

      return content;
    } catch (error) {
      console.error("Error generating test with OpenAI:", error);
      throw error;
    }
  }
}
