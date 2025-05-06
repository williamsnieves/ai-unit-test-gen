export type AIModel = "gpt-4" | "claude-3-5-sonnet-latest";

export interface AIGenerateTestParams {
  code: string;
  testFramework: "jest" | "vitest";
  model: AIModel;
}

export interface AIService {
  generateTest(params: AIGenerateTestParams): Promise<string>;
}
