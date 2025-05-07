export enum AIModelEnum {
  GPT4 = "gpt-4",
  CLAUDE = "claude-3-5-sonnet-latest",
  QWEN_32B = "qwen2.5-coder-32b",
  CODEQWEN_7B = "codeqwen1.5-7b",
  CODELLAMA_70B = "codellama-70b",
  DEEPSEEK_33B = "deepseek-coder-33b",
}

export type AIModel = AIModelEnum;

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
