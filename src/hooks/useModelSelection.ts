import { useState } from "react";
import { AIModelEnum } from "@/types/ai";
import { AI_CONFIG } from "@/config/ai.config";

export type ModelOption = {
  id: AIModelEnum;
  name: string;
  provider: string;
  maxTokens: number;
  description: string;
  supportsStreaming: boolean;
};

export const useModelSelection = () => {
  const [selectedModel, setSelectedModel] = useState<AIModelEnum>(
    AI_CONFIG.defaultModel
  );

  const availableModels: ModelOption[] = Object.entries(AI_CONFIG.models).map(
    ([id, model]) => ({
      id: id as AIModelEnum,
      ...model,
    })
  );

  return {
    selectedModel,
    setSelectedModel,
    availableModels,
  };
};
