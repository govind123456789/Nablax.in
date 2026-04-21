export type LLMProvider = "openai" | "claude" | "mistral" | "gemini" | "vercel-ai-gateway" | "preset-template"

export interface LLMConfig {
  provider: LLMProvider
  apiKey: string
  model: string
  presetTemplate?: string
}

export interface LLMModels {
  [key: string]: {
    provider: LLMProvider
    models: string[]
    description: string
  }
}

export const AVAILABLE_MODELS: LLMModels = {
  openai: {
    provider: "openai",
    models: ["gpt-4o", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
    description: "OpenAI GPT Models",
  },
  claude: {
    provider: "claude",
    models: ["claude-3-5-sonnet", "claude-3-opus", "claude-3-sonnet"],
    description: "Anthropic Claude Models",
  },
  mistral: {
    provider: "mistral",
    models: ["mistral-large", "mistral-medium", "mistral-small"],
    description: "Mistral AI Models",
  },
  gemini: {
    provider: "gemini",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    description: "Google Gemini Models",
  },
  vercelAI: {
    provider: "vercel-ai-gateway",
    models: ["gpt-4o", "claude-3-5-sonnet", "mistral-large"],
    description: "Vercel AI Gateway (No API Key Required)",
  },
  presetTemplate: {
    provider: "preset-template",
    models: ["top-customers", "monthly-sales-trend", "product-performance", "customer-retention"],
    description: "Preset SQL Templates (No API Required)",
  },
}

export const DEFAULT_LLM_CONFIG: LLMConfig = {
  provider: "vercel-ai-gateway",
  apiKey: "",
  model: "gpt-4o",
}
