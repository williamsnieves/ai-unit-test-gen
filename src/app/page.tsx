"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { AIModel } from "@/types/ai";
import { AI_CONFIG } from "@/config/ai";
import { ThemeToggle } from "@/components/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Home() {
  const [code, setCode] = useState("");
  const [testFramework, setTestFramework] = useState(
    AI_CONFIG.defaultTestFramework
  );
  const [model, setModel] = useState<AIModel>(AI_CONFIG.defaultModel);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState("");
  const [codeType, setCodeType] = useState<"javascript" | "typescript">(
    "javascript"
  );

  // Detect code type
  useEffect(() => {
    if (code) {
      const hasTypeAnnotations =
        /:\s*(string|number|boolean|any|void|never|unknown|object|Array|Promise|Function|Date|RegExp|Error|Map|Set|WeakMap|WeakSet|Symbol|BigInt|Uint8Array|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|BigUint64Array|BigInt64Array|DataView|ArrayBuffer|SharedArrayBuffer|ReadonlyArray|ReadonlyMap|ReadonlySet|Readonly<T>|Partial<T>|Required<T>|Pick<T>|Omit<T>|Record<K>|Exclude<T>|Extract<T>|NonNullable<T>|ReturnType<T>|InstanceType<T>|ThisType<T>|Uppercase<T>|Lowercase<T>|Capitalize<T>|Uncapitalize<T>)/.test(
          code
        );
      setCodeType(hasTypeAnnotations ? "typescript" : "javascript");
    }
  }, [code]);

  const {
    data: generatedTest,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["generateTest", code, testFramework, model, isStreaming],
    queryFn: async () => {
      if (!code) return null;

      if (isStreaming) {
        setStreamedResponse("");
        const response = await fetch("/api/generate-test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            testFramework,
            model,
            streaming: true,
            codeType,
          }),
        });

        if (!response.ok) throw new Error("Failed to generate test");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = new TextDecoder().decode(value);
            setStreamedResponse((prev) => prev + text);
          }
        } catch (error) {
          console.error("Error reading stream:", error);
          throw error;
        } finally {
          reader.releaseLock();
        }

        return streamedResponse;
      } else {
        const response = await fetch("/api/generate-test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            testFramework,
            model,
            streaming: false,
            codeType,
          }),
        });

        if (!response.ok) throw new Error("Failed to generate test");
        return response.text();
      }
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
                    {(
                      Object.keys(AI_CONFIG.models) as Array<
                        keyof typeof AI_CONFIG.models
                      >
                    ).map((modelId) => {
                      const modelInfo = AI_CONFIG.models[modelId];
                      return (
                        <Button
                          key={modelId}
                          variant="outline"
                          onClick={() => {
                            setModel(modelId as AIModel);
                            if (
                              modelId !== "gpt-4" &&
                              modelId !== "claude-3-5-sonnet-latest"
                            ) {
                              setIsStreaming(false);
                            }
                          }}
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
                      );
                    })}
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

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                  {(model === "gpt-4" ||
                    model === "claude-3-5-sonnet-latest") && (
                    <>
                      <Switch
                        id="streaming"
                        checked={isStreaming}
                        onCheckedChange={setIsStreaming}
                      />
                      <Label htmlFor="streaming" className="font-medium">
                        Enable Streaming Response
                      </Label>
                    </>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  Detected Code Type:{" "}
                  <span className="font-medium">{codeType}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Enter your code:</label>
                <div className="gradient-border">
                  <div className="relative">
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Paste your code here..."
                      className="min-h-[300px] font-mono bg-transparent relative z-10 text-transparent caret-foreground"
                    />
                    <div className="absolute inset-0 pointer-events-none">
                      <SyntaxHighlighter
                        language={codeType}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          borderRadius: "0.5rem",
                          background: "transparent",
                          height: "100%",
                        }}
                        showLineNumbers
                      >
                        {code || " "}
                      </SyntaxHighlighter>
                    </div>
                  </div>
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
            {generatedTest || streamedResponse ? (
              <div className="glass-card p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Generated Test:</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        (isStreaming ? streamedResponse : generatedTest) || ""
                      )
                    }
                    className="text-xs cursor-pointer"
                  >
                    Copy to Clipboard
                  </Button>
                </div>
                <div className="gradient-border">
                  <SyntaxHighlighter
                    language={codeType}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: "0.5rem",
                      background: "transparent",
                    }}
                    showLineNumbers
                  >
                    {(isStreaming ? streamedResponse : generatedTest) || ""}
                  </SyntaxHighlighter>
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
