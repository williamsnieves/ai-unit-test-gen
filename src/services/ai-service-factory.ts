import { AIModel, AIService } from "@/types/ai";
import { OpenAIService } from "./openai-service";
import { AnthropicService } from "./anthropic-service";
import { AI_CONFIG } from "@/config/ai";

export class AIServiceFactory {
  private static services: Map<AIModel, AIService> = new Map();

  static getService(model: AIModel): AIService {
    if (!this.services.has(model)) {
      switch (model) {
        case AI_CONFIG.models["gpt-4"].id:
          this.services.set(model, new OpenAIService());
          break;
        case AI_CONFIG.models["claude-3-5-sonnet-latest"].id:
          this.services.set(model, new AnthropicService());
          break;
        default:
          throw new Error(`Unsupported AI model: ${model}`);
      }
    }

    return this.services.get(model)!;
  }
}
