import { useState } from "react";
import { AIModelEnum, TestFramework } from "@/types/ai";
import { AI_CONFIG } from "@/config/ai.config";

export type TestGenerationState = {
  isLoading: boolean;
  error: string | null;
  generatedTest: string;
};

export const useTestGeneration = () => {
  const [state, setState] = useState<TestGenerationState>({
    isLoading: false,
    error: null,
    generatedTest: "",
  });

  const generateTest = async (
    code: string,
    model: AIModelEnum,
    framework: TestFramework
  ) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const modelConfig = AI_CONFIG.models[model];
      const response = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          model,
          framework,
          maxTokens: modelConfig.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate test");
      }

      if (!modelConfig.supportsStreaming) {
        const data = await response.json();
        setState({
          isLoading: false,
          error: null,
          generatedTest: data.test,
        });
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let test = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        test += chunk;
        setState((prev) => ({
          ...prev,
          generatedTest: test,
        }));
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      }));
    }
  };

  return {
    ...state,
    generateTest,
  };
};
