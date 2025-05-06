"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { AIModel } from "@/types/ai";
import { AI_CONFIG } from "@/config/ai";

export default function Home() {
  const [code, setCode] = useState("");
  const [testFramework, setTestFramework] = useState(
    AI_CONFIG.defaultTestFramework
  );
  const [model, setModel] = useState<AIModel>(AI_CONFIG.defaultModel);

  const {
    data: generatedTest,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["generateTest", code, testFramework, model],
    queryFn: async () => {
      if (!code) return null;
      const response = await fetch("/api/generate-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, testFramework, model }),
      });
      if (!response.ok) throw new Error("Failed to generate test");
      return response.text();
    },
    enabled: false,
  });

  const handleGenerateTest = () => {
    refetch();
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">AI Unit Test Generator</h1>

      <div className="space-y-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select AI Model:
            </label>
            <div className="flex gap-4">
              {Object.entries(AI_CONFIG.models).map(([modelId, modelInfo]) => (
                <Button
                  key={modelId}
                  variant={model === modelId ? "default" : "outline"}
                  onClick={() => setModel(modelId as AIModel)}
                >
                  {modelInfo.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Test Framework:
            </label>
            <div className="flex gap-4">
              {Object.entries(AI_CONFIG.testFrameworks).map(
                ([frameworkId, frameworkInfo]) => (
                  <Button
                    key={frameworkId}
                    variant={
                      testFramework === frameworkId ? "default" : "outline"
                    }
                    onClick={() =>
                      setTestFramework(
                        frameworkId as typeof AI_CONFIG.defaultTestFramework
                      )
                    }
                  >
                    {frameworkInfo.name}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Enter your code:</label>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="min-h-[200px] font-mono"
          />
        </div>

        <Button
          onClick={handleGenerateTest}
          disabled={!code || isLoading}
          className="w-full"
        >
          {isLoading ? "Generating..." : "Generate Test"}
        </Button>

        {generatedTest && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Generated Test:</label>
            <pre className="p-4 bg-muted rounded-md overflow-auto">
              <code>{generatedTest}</code>
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
