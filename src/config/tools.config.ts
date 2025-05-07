import { ChatCompletionTool } from "openai/resources/chat/completions";
import { Tool } from "@anthropic-ai/sdk/resources/messages";

// Common tool definitions for OpenAI
const testGenerationTools = [
  {
    type: "function",
    function: {
      name: "structurePrompt",
      description:
        "Structure the prompt for test generation with clear goals, format, warnings, and context",
      parameters: {
        type: "object",
        properties: {
          task: {
            type: "string",
            description: "The main goal of the test generation",
          },
          format: {
            type: "string",
            description: "The expected format of the test output",
          },
          warnings: {
            type: "string",
            description: "Important considerations and constraints",
          },
          context: {
            type: "string",
            description: "Additional context for test generation",
          },
        },
        required: ["task"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analyzeCode",
      description:
        "Analyze the code to identify key components that need testing",
      parameters: {
        type: "object",
        properties: {
          code: {
            type: "string",
            description: "The code to analyze",
          },
          testFramework: {
            type: "string",
            description: "The testing framework to use",
          },
        },
        required: ["code", "testFramework"],
      },
    },
  },
] as const;

// Anthropic tool definitions
const anthropicTools = [
  {
    name: "structurePrompt",
    description:
      "Structure the prompt for test generation with clear goals, format, warnings, and context. This tool helps organize the test generation process by defining the task, expected format, important warnings, and additional context.",
    input_schema: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "The main goal of the test generation",
        },
        format: {
          type: "string",
          description: "The expected format of the test output",
        },
        warnings: {
          type: "string",
          description: "Important considerations and constraints",
        },
        context: {
          type: "string",
          description: "Additional context for test generation",
        },
      },
      required: ["task"],
    },
  },
  {
    name: "analyzeCode",
    description:
      "Analyze the code to identify key components that need testing. This tool examines the code structure, identifies functions, classes, and their dependencies to determine what needs to be tested.",
    input_schema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The code to analyze",
        },
        testFramework: {
          type: "string",
          description: "The testing framework to use",
        },
      },
      required: ["code", "testFramework"],
    },
  },
  {
    name: "explainTestGeneration",
    description:
      "Explain the test generation process, including what was tested, why certain test cases were chosen, and any important considerations. This tool provides a summary of the testing approach and rationale.",
    input_schema: {
      type: "object",
      properties: {
        testCode: {
          type: "string",
          description: "The generated test code",
        },
        originalCode: {
          type: "string",
          description: "The original code that was tested",
        },
        testFramework: {
          type: "string",
          description: "The testing framework used",
        },
        explanation: {
          type: "string",
          description:
            "Explanation of the test generation process and rationale",
        },
      },
      required: ["testCode", "originalCode", "testFramework", "explanation"],
    },
  },
] as const;

// Export typed versions for each provider
export const OPENAI_TOOLS: ChatCompletionTool[] =
  testGenerationTools as unknown as ChatCompletionTool[];
export const ANTHROPIC_TOOLS: Tool[] = anthropicTools as unknown as Tool[];
