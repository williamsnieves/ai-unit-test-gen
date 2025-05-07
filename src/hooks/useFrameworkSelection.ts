import { useState } from "react";
import { TestFramework } from "@/types/ai";
import { AI_CONFIG } from "@/config/ai.config";

export type FrameworkOption = {
  id: TestFramework;
  name: string;
  description: string;
};

export const useFrameworkSelection = () => {
  const [selectedFramework, setSelectedFramework] = useState<TestFramework>(
    AI_CONFIG.defaultTestFramework
  );

  const availableFrameworks: FrameworkOption[] = Object.entries(
    AI_CONFIG.testFrameworks
  ).map(([id, framework]) => ({
    id: id as TestFramework,
    ...framework,
  }));

  return {
    selectedFramework,
    setSelectedFramework,
    availableFrameworks,
  };
};
