"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [code, setCode] = useState("");
  const [testFramework, setTestFramework] = useState<"jest" | "vitest">("jest");

  const {
    data: generatedTest,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["generateTest", code, testFramework],
    queryFn: async () => {
      if (!code) return null;
      const response = await fetch("/api/generate-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, testFramework }),
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
        <div className="flex gap-4">
          <Button
            variant={testFramework === "jest" ? "default" : "outline"}
            onClick={() => setTestFramework("jest")}
          >
            Jest
          </Button>
          <Button
            variant={testFramework === "vitest" ? "default" : "outline"}
            onClick={() => setTestFramework("vitest")}
          >
            Vitest
          </Button>
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
