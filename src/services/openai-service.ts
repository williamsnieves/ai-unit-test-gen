import OpenAI from "openai";
import { AIGenerateTestParams, AIService } from "@/types/ai";
import { OPENAI_TOOLS } from "@/config/tools.config";

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
          content:
            "You are an expert at writing unit tests. Follow the provided prompt structure exactly. Write clean, maintainable, and self-documenting code.",
        },
        {
          role: "user",
          content: `Generate a comprehensive unit test for this code using ${testFramework}:\n\n${code}`,
        },
      ],
      tools: OPENAI_TOOLS,
      tool_choice: "auto",
      temperature: 0.2,
    });

    const message = response.choices[0].message;
    if (!message.content && !message.tool_calls) {
      throw new Error("No response generated from the model");
    }

    // If we get a tool call, make another request to generate the actual test
    if (message.tool_calls) {
      const testResponse = await this.openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert at writing unit tests. Follow the provided prompt structure exactly. Write clean, maintainable, and self-documenting code.",
          },
          {
            role: "user",
            content: `Generate a comprehensive unit test for this code using ${testFramework}. Follow these guidelines:

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
   - Follow best practices for ${testFramework}

4. Important Considerations:
   - Ensure all test cases are meaningful and test actual functionality
   - Avoid testing implementation details
   - Make sure mocks and stubs are properly set up
   - Verify all assertions are valid and necessary
   - Keep code self-documenting and minimize comments
   - Follow SOLID principles and clean code practices

Code to test:
\`\`\`
${code}
\`\`\``,
          },
        ],
        temperature: 0.2,
      });

      return testResponse.choices[0].message.content || "";
    }

    return message.content || "";
  }
}
