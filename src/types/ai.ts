export type AIModel =
  | "gpt-4"
  | "claude-3-5-sonnet-latest"
  | "qwen2.5-coder-32b"
  | "codeqwen1.5-7b"
  | "codellama-70b"
  | "deepseek-coder-33b";

export type TestFramework = "jest" | "vitest" | "mocha";

export interface AIGenerateTestParams {
  code: string;
  testFramework: TestFramework;
  model: AIModel;
  codeType?: "javascript" | "typescript";
  streaming?: boolean;
}

export interface AIService {
  generateTest(params: AIGenerateTestParams): Promise<string>;
  supportsStreaming?: boolean;
}
