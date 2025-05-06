type BaseModelConfig = {
  name: string;
  maxTokens: number;
  description: string;
};

type OpenAIModelConfig = BaseModelConfig & {
  provider: "openai";
};

type AnthropicModelConfig = BaseModelConfig & {
  provider: "anthropic";
};

type HuggingFaceModelConfig = BaseModelConfig & {
  provider: "huggingface";
  modelId: string;
  inferenceProvider: "hyperbolic";
};

export type ModelConfig =
  | OpenAIModelConfig
  | AnthropicModelConfig
  | HuggingFaceModelConfig;

export type AIModel =
  | "gpt-4"
  | "claude-3-5-sonnet-latest"
  | "qwen2.5-coder-32b"
  | "codellama-70b"
  | "deepseek-coder-33b";

export type ModelProvider = "openai" | "anthropic" | "huggingface";

export const AI_CONFIG = {
  models: {
    "gpt-4": {
      name: "GPT-4",
      provider: "openai" as const,
      maxTokens: 4000,
      description: "OpenAI's most advanced model",
    },
    "claude-3-5-sonnet-latest": {
      name: "Claude 3.5 Sonnet",
      provider: "anthropic" as const,
      maxTokens: 4000,
      description: "Anthropic's latest Claude 3.5 Sonnet model",
    },
    "qwen2.5-coder-32b": {
      name: "Qwen2.5 Coder 32B",
      provider: "huggingface" as const,
      maxTokens: 4000,
      modelId: "Qwen/Qwen2.5-Coder-32B-Instruct",
      inferenceProvider: "hyperbolic",
      description: "Qwen's advanced code generation model",
    },
    "codellama-70b": {
      name: "CodeLlama 70B",
      provider: "huggingface" as const,
      maxTokens: 4000,
      modelId: "meta-llama/Llama-3.3-70B-Instruct",
      inferenceProvider: "hyperbolic",
      description: "Meta's large code generation model",
    },
    "deepseek-coder-33b": {
      name: "DeepSeek Coder 33B",
      provider: "huggingface" as const,
      maxTokens: 4000,
      modelId: "deepseek-ai/DeepSeek-R1",
      inferenceProvider: "hyperbolic",
      description: "DeepSeek's advanced code generation model",
    },
  } as const,
  defaultModel: "gpt-4" as AIModel,
  testFrameworks: {
    jest: {
      name: "Jest",
      description: "JavaScript Testing Framework",
    },
    vitest: {
      name: "Vitest",
      description: "Vite Native Testing Framework",
    },
    mocha: {
      name: "Mocha",
      description: "JavaScript Test Framework",
    },
  },
  defaultTestFramework: "jest",
} as const;
