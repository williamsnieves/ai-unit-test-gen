import Anthropic from "@anthropic-ai/sdk";
import { AIGenerateTestParams, AIService } from "@/types/ai";
import { ANTHROPIC_TOOLS } from "@/config/tools.config";

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
          content: `[STRICT MODE]
NO CONVERSATION. NO ANALYSIS. NO EXPLANATIONS.
ONLY GENERATE TESTS AND USE TOOL.

\`\`\`
${code}
\`\`\`

${testFramework}`,
        },
      ],
      tools: ANTHROPIC_TOOLS,
      tool_choice: { type: "auto" },
    });

    const content = response.content[0];
    if (content.type !== "text" && content.type !== "tool_use") {
      throw new Error("Expected text or tool_use response from Claude");
    }

    if (content.type === "tool_use") {
      // Handle tool use by making another request with the tool result
      const toolResult = await this.handleToolUse(content, code, testFramework);
      return toolResult;
    }

    return content.text;
  }

  private async handleToolUse(
    toolUse: Anthropic.ToolUseBlock,
    code: string,
    testFramework: string
  ): Promise<string> {
    // Create a new message with the tool result
    const response = await this.anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `You are an expert at writing unit tests. Your task is to:
1. Generate comprehensive unit tests for the provided code
2. Use the explainTestGeneration tool to provide a detailed explanation of your implementation

The explanation should cover:
- Test Coverage: What functionality is being tested and why each test case is important
- Testing Strategy: Your approach to test organization and choice of test cases
- Implementation Details: How the tests are structured and why certain assertions are used
- Best Practices: How the tests follow testing best practices and ensure maintainability

Always use the explainTestGeneration tool to provide your explanation. Do not provide explanations directly in the response.`,
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
    if (content.type !== "text") {
      throw new Error("Expected text response from Claude");
    }

    return content.text;
  }
}
