"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { AIModel } from "@/types/ai";
import { AI_CONFIG } from "@/config/ai";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto p-4 max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-gradient">
              AI Unit Test Generator
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate comprehensive unit tests using advanced AI models
            </p>
          </div>
          <ThemeToggle />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-lg space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select AI Model:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(AI_CONFIG.models).map(
                      ([modelId, modelInfo]) => (
                        <Button
                          key={modelId}
                          variant={model === modelId ? "default" : "outline"}
                          onClick={() => setModel(modelId as AIModel)}
                          className={`w-full justify-start gap-2 transition-all duration-200 ${
                            model === modelId
                              ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none shadow-lg"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              model === modelId ? "bg-white" : "bg-primary"
                            }`}
                          ></span>
                          {modelInfo.name}
                        </Button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Test Framework:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(AI_CONFIG.testFrameworks).map(
                      ([frameworkId, frameworkInfo]) => (
                        <Button
                          key={frameworkId}
                          variant="outline"
                          onClick={() =>
                            setTestFramework(
                              frameworkId as typeof AI_CONFIG.defaultTestFramework
                            )
                          }
                          className={`w-full justify-start gap-2 transition-all duration-200 ${
                            testFramework === frameworkId
                              ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none shadow-lg"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              testFramework === frameworkId
                                ? "bg-white"
                                : "bg-primary"
                            }`}
                          ></span>
                          {frameworkInfo.name}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Enter your code:</label>
                <div className="gradient-border">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your code here..."
                    className="min-h-[300px] font-mono bg-background/50"
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerateTest}
                disabled={!code || isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? "Generating..." : "Generate Test"}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {generatedTest ? (
              <div className="glass-card p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Generated Test:</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(generatedTest)}
                    className="text-xs cursor-pointer"
                  >
                    Copy to Clipboard
                  </Button>
                </div>
                <div className="gradient-border">
                  <pre className="p-4 bg-background/50 rounded-lg overflow-auto max-h-[600px] font-mono text-sm">
                    <code>{generatedTest}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 rounded-lg space-y-4 h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8 text-white"
                  >
                    <path d="M16 18 22 12 16 6" />
                    <path d="M8 6 2 12 8 18" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Ready to Generate Tests
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Enter your code and select your preferred AI model and test
                  framework to generate comprehensive unit tests.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
