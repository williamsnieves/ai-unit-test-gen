import { AIModel, AIService } from "@/types/ai";
import { OpenAIService } from "./openai-service";
import { AnthropicService } from "./anthropic-service";
import { HuggingFaceService } from "./huggingface.service";
import { AI_CONFIG } from "@/config/ai";

export class AIServiceFactory {
  static getService(model: AIModel): AIService {
    const modelConfig = AI_CONFIG.models[model];

    switch (modelConfig.provider) {
      case "openai":
        return new OpenAIService();
      case "anthropic":
        return new AnthropicService();
      case "huggingface":
        return new HuggingFaceService();
      default:
        throw new Error(`Unsupported model provider: ${modelConfig.provider}`);
    }
  }
}
