import { AIModel } from "@/types/ai";

type ModelInfo = {
  name: string;
  provider: string;
  maxTokens: number;
  description: string;
  supportsStreaming: boolean;
};

type TestFrameworkInfo = {
  name: string;
  description: string;
};

export const AI_CONFIG = {
  defaultModel: "gpt-4" as AIModel,
  defaultTestFramework: "jest" as const,
  models: {
    "gpt-4": {
      name: "GPT-4",
      provider: "openai",
      maxTokens: 4000,
      description: "OpenAI's most advanced model",
      supportsStreaming: true,
    },
    "claude-3-5-sonnet-latest": {
      name: "Claude 3.5 Sonnet",
      provider: "anthropic",
      maxTokens: 4000,
      description: "Anthropic's latest Claude 3.5 Sonnet model",
      supportsStreaming: true,
    },
    "qwen2.5-coder-32b": {
      name: "Qwen 2.5 Coder 32B",
      provider: "huggingface",
      maxTokens: 4000,
      description: "Alibaba's advanced coding model",
      supportsStreaming: false,
    },
    "codeqwen1.5-7b": {
      name: "CodeQwen 1.5 7B",
      provider: "huggingface",
      maxTokens: 4000,
      description: "Alibaba's efficient coding model",
      supportsStreaming: false,
    },
    "codellama-70b": {
      name: "CodeLlama 70B",
      provider: "huggingface",
      maxTokens: 4000,
      description: "Meta's largest coding model",
      supportsStreaming: false,
    },
    "deepseek-coder-33b": {
      name: "DeepSeek Coder 33B",
      provider: "huggingface",
      maxTokens: 4000,
      description: "DeepSeek's advanced coding model",
      supportsStreaming: false,
    },
  } as const,
  testFrameworks: {
    jest: {
      name: "Jest",
      description: "JavaScript testing framework with a focus on simplicity",
    },
    vitest: {
      name: "Vitest",
      description: "Next generation testing framework",
    },
    mocha: {
      name: "Mocha",
      description: "Flexible JavaScript test framework",
    },
  } as { [K in "jest" | "vitest" | "mocha"]: TestFrameworkInfo },
} as const;
