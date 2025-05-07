interface PromptStructure {
  task: string;
  format?: string;
  warnings?: string;
  context?: string;
}

interface TestGenerationPrompt extends PromptStructure {
  code: string;
  testFramework: string;
}

export class PromptEngineeringService {
  private structurePrompt({
    task,
    format = "",
    warnings = "",
    context = "",
  }: PromptStructure): string {
    return `
🎯 Goal:
${task}

📦 Response Format:
${
  format ||
  "Return structured and readable output. Use code blocks where appropriate."
}

⚠️ Warnings:
${warnings || "Ensure accuracy. Avoid assumptions or hallucinations."}

📝 Additional Context:
${context || "No extra context provided."}
`.trim();
  }

  generateTestPrompt({
    code,
    testFramework,
    task,
    format,
    warnings,
    context,
  }: TestGenerationPrompt): string {
    const defaultTask = `Generate a comprehensive unit test for the following code using ${testFramework}.`;
    const defaultFormat = `
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
   - Add comments for complex logic if it is stricted necessary code should speak clear
   - Follow clean code rules
   - Follow best practices for ${testFramework}`;

    const defaultWarnings = `
- Ensure all test cases are meaningful and test actual functionality
- Avoid testing implementation details
- Make sure mocks and stubs are properly set up
- Verify all assertions are valid and necessary`;

    const defaultContext = `
- The test should be production-ready
- Consider performance implications
- Follow the project's testing conventions
- Ensure good test coverage`;

    return (
      this.structurePrompt({
        task: task || defaultTask,
        format: format || defaultFormat,
        warnings: warnings || defaultWarnings,
        context: context || defaultContext,
      }) + `\n\nCode to test:\n\`\`\`\n${code}\n\`\`\``
    );
  }
}
