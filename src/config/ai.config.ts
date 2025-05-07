import { AIModelEnum } from "@/types/ai";

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

type ModelsConfig = {
  [K in AIModelEnum]: ModelInfo;
};

export const AI_CONFIG = {
  defaultModel: AIModelEnum.GPT4,
  defaultTestFramework: "jest" as const,
  models: {
    [AIModelEnum.GPT4]: {
      name: "GPT-4",
      provider: "openai",
      maxTokens: 4000,
      description: "OpenAI's most advanced model",
      supportsStreaming: true,
    },
    [AIModelEnum.CLAUDE]: {
      name: "Claude 3.5 Sonnet",
      provider: "anthropic",
      maxTokens: 4000,
      description: "Anthropic's latest Claude 3.5 Sonnet model",
      supportsStreaming: true,
    },
    [AIModelEnum.QWEN_32B]: {
      name: "Qwen 2.5 Coder 32B",
      provider: "huggingface",
      maxTokens: 4000,
      description: "Alibaba's advanced coding model",
      supportsStreaming: false,
    },
    [AIModelEnum.CODEQWEN_7B]: {
      name: "CodeQwen 1.5 7B",
      provider: "huggingface",
      maxTokens: 4000,
      description: "Alibaba's efficient coding model",
      supportsStreaming: false,
    },
    [AIModelEnum.CODELLAMA_70B]: {
      name: "CodeLlama 70B",
      provider: "huggingface",
      maxTokens: 4000,
      description: "Meta's largest coding model",
      supportsStreaming: false,
    },
    [AIModelEnum.DEEPSEEK_33B]: {
      name: "DeepSeek Coder 33B",
      provider: "huggingface",
      maxTokens: 4000,
      description: "DeepSeek's advanced coding model",
      supportsStreaming: false,
    },
  } satisfies ModelsConfig,
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
