import { AIModel } from "@/types/ai";

export const AI_CONFIG = {
  defaultModel: "gpt-4" as AIModel,
  models: {
    "gpt-4": {
      id: "gpt-4" as const,
      name: "GPT-4",
      description: "OpenAI's most advanced model",
    },
    "claude-3-5-sonnet-latest": {
      id: "claude-3-5-sonnet-latest" as const,
      name: "Claude 3.5 Sonnet",
      description: "Anthropic's latest Claude 3.5 Sonnet model",
    },
  },
  defaultTestFramework: "jest" as const,
  testFrameworks: {
    jest: {
      name: "Jest",
      description: "JavaScript Testing Framework",
    },
    vitest: {
      name: "Vitest",
      description: "Vite-native testing framework",
    },
  },
} as const;
