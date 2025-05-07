import { useState } from "react";

export type CodeSelection = {
  code: string;
  isValid: boolean;
  error?: string;
};

export const useCodeSelection = () => {
  const [codeSelection, setCodeSelection] = useState<CodeSelection>({
    code: "",
    isValid: false,
  });

  const validateCode = (code: string): boolean => {
    if (!code.trim()) {
      setCodeSelection({
        code,
        isValid: false,
        error: "Code cannot be empty",
      });
      return false;
    }

    setCodeSelection({
      code,
      isValid: true,
    });
    return true;
  };

  const updateCode = (code: string) => {
    validateCode(code);
  };

  return {
    codeSelection,
    updateCode,
    validateCode,
  };
};
