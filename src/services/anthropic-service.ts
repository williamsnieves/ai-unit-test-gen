import Anthropic from "@anthropic-ai/sdk";
import { AIGenerateTestParams, AIService } from "@/types/ai";
import { ANTHROPIC_TOOLS } from "@/config/tools.config";

export class AnthropicService implements AIService {
  private anthropic: Anthropic;
  public supportsStreaming = true;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "",
    });
  }

  async generateTest(params: AIGenerateTestParams): Promise<string> {
    const { code, testFramework, streaming = false } = params;

    const message = {
      system:
        "[STRICT MODE] NO CONVERSATION. NO ANALYSIS. NO EXPLANATIONS. ONLY GENERATE THE COMPLETE TEST CODE.",
      user: `Generate a complete unit test suite for this code using ${testFramework}:

\`\`\`${params.codeType || "javascript"}
${code}
\`\`\`

Requirements:
- Write clean, maintainable, and self-documenting test code
- Include comprehensive test cases covering edge cases and error conditions
- Follow ${testFramework} best practices and conventions
- Include proper setup and teardown if needed
- Use descriptive test names that explain what is being tested`,
    };

    try {
      if (streaming) {
        const stream = await this.anthropic.messages.create({
          model: "claude-3-5-sonnet-latest",
          max_tokens: 4000,
          temperature: 0.2,
          system: message.system,
          messages: [{ role: "user", content: message.user }],
          tools: ANTHROPIC_TOOLS,
          tool_choice: { type: "auto" },
          stream: true,
        });

        let response = "";
        let toolUse: Anthropic.ToolUseBlock | null = null;

        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && "text" in chunk.delta) {
            response += chunk.delta.text;
          } else if (
            chunk.type === "content_block_start" &&
            chunk.content_block.type === "tool_use"
          ) {
            toolUse = chunk.content_block;
          }
        }

        // If we got a tool response, handle it
        if (toolUse) {
          return await this.handleToolUse(toolUse, code, testFramework);
        }

        return response;
      }

      const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 4000,
        temperature: 0.2,
        system: message.system,
        messages: [{ role: "user", content: message.user }],
        tools: ANTHROPIC_TOOLS,
        tool_choice: { type: "auto" },
      });

      const content = response.content[0];
      if (!content) {
        throw new Error("No content in response from Claude");
      }

      // Handle different response types
      if (content.type === "text") {
        return content.text;
      } else if (content.type === "tool_use") {
        // If it's a tool response, we need to handle it
        return await this.handleToolUse(content, code, testFramework);
      }

      throw new Error(`Unexpected response type from Claude: ${content.type}`);
    } catch (error) {
      console.error("Error generating test with Anthropic:", error);
      throw error;
    }
  }

  private async handleToolUse(
    toolUse: Anthropic.ToolUseBlock,
    code: string,
    testFramework: string
  ): Promise<string> {
    const response = await this.anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `[STRICT MODE]
NO CONVERSATION. NO ANALYSIS. NO EXPLANATIONS.
ONLY GENERATE THE COMPLETE TEST CODE.

Generate a complete unit test suite for this code using ${testFramework}. The test suite must:
- Test all edge cases and error conditions
- Include proper setup and teardown
- Use descriptive test names
- Follow the ${testFramework} best practices

Code to test:
\`\`\`
${code}
\`\`\``,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool_use",
              id: toolUse.id,
              name: toolUse.name,
              input: toolUse.input,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: JSON.stringify({
                task: "Generate a complete unit test suite that covers all functionality",
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
              }),
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (!content || content.type !== "text") {
      throw new Error("Expected text response from Claude");
    }

    return content.text;
  }
}
