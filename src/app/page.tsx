"use client";

import { useModelSelection } from "@/hooks/useModelSelection";
import { useFrameworkSelection } from "@/hooks/useFrameworkSelection";
import { useCodeSelection } from "@/hooks/useCodeSelection";
import { useTestGeneration } from "@/hooks/useTestGeneration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { AIModelEnum, TestFramework } from "@/types/ai";

export default function Home() {
  const { selectedModel, setSelectedModel, availableModels } =
    useModelSelection();

  const { selectedFramework, setSelectedFramework, availableFrameworks } =
    useFrameworkSelection();

  const { codeSelection, updateCode, validateCode } = useCodeSelection();

  const { isLoading, error, generatedTest, generateTest } = useTestGeneration();

  const handleGenerate = async () => {
    if (!validateCode(codeSelection.code)) return;
    await generateTest(codeSelection.code, selectedModel, selectedFramework);
  };

  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">AI Unit Test Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select AI Model</Label>
              <RadioGroup
                value={selectedModel}
                onValueChange={(value: AIModelEnum) => setSelectedModel(value)}
                className="grid grid-cols-1 gap-2"
              >
                {availableModels.map((model) => (
                  <div key={model.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={model.id} id={model.id} />
                    <Label htmlFor={model.id} className="flex flex-col">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {model.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Select Test Framework</Label>
              <RadioGroup
                value={selectedFramework}
                onValueChange={(value: TestFramework) =>
                  setSelectedFramework(value)
                }
                className="grid grid-cols-1 gap-2"
              >
                {availableFrameworks.map((framework) => (
                  <div
                    key={framework.id}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={framework.id} id={framework.id} />
                    <Label htmlFor={framework.id} className="flex flex-col">
                      <span className="font-medium">{framework.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {framework.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Paste your code here</Label>
              <Textarea
                placeholder="Enter your code..."
                value={codeSelection.code}
                onChange={(e) => updateCode(e.target.value)}
                className="min-h-[200px] font-mono"
              />
              {codeSelection.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{codeSelection.error}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !codeSelection.isValid}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Test"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Test</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <pre className="p-4 bg-muted rounded-lg overflow-auto max-h-[600px] font-mono text-sm">
                {generatedTest || "Generated test will appear here..."}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
