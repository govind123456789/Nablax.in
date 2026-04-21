// Real LLM-powered SQL Generation

import { Anthropic } from "@anthropic-ai/sdk"
import { OpenAI } from "openai"
import { buildSQLGenerationPrompt } from "./prompt-templates"
import type { LLMConfig } from "@/lib/config/llm-providers"
import { PRESET_TEMPLATES } from "@/lib/config/preset-templates"

export interface SQLGenerationRequest {
  userQuestion: string
  schema: string
  selectedTables: string[]
  dataDictionary?: string
  metadata?: string
  llmConfig: LLMConfig & { templateId?: string }
}

export interface SQLGenerationResponse {
  sql: string
  reasoning: string
  provider: string
  model: string
}

export async function generateSQL(request: SQLGenerationRequest): Promise<SQLGenerationResponse> {
  const prompt = buildSQLGenerationPrompt(
    request.userQuestion,
    request.schema,
    request.selectedTables,
    request.dataDictionary,
    request.metadata,
  )

  let sql: string
  let reasoning: string

  // Route to appropriate provider
  switch (request.llmConfig.provider) {
    case "preset-template":
      ;({ sql, reasoning } = await generateWithPresetTemplate(request.llmConfig))
      break
    case "claude":
      ;({ sql, reasoning } = await generateWithClaude(prompt, request.llmConfig))
      break
    case "openai":
      ;({ sql, reasoning } = await generateWithOpenAI(prompt, request.llmConfig))
      break
    case "mistral":
      ;({ sql, reasoning } = await generateWithMistral(prompt, request.llmConfig))
      break
    case "gemini":
      ;({ sql, reasoning } = await generateWithGemini(prompt, request.llmConfig))
      break
    case "vercel-ai-gateway":
      ;({ sql, reasoning } = await generateWithVercelAI(prompt, request.llmConfig))
      break
    default:
      throw new Error(`Unsupported LLM provider: ${request.llmConfig.provider}`)
  }

  return {
    sql: sql.trim(),
    reasoning,
    provider: request.llmConfig.provider,
    model: request.llmConfig.model,
  }
}

async function generateWithClaude(prompt: string, config: LLMConfig): Promise<{ sql: string; reasoning: string }> {
  const client = new Anthropic({ apiKey: config.apiKey })

  const response = await client.messages.create({
    model: config.model,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude")
  }

  return {
    sql: content.text,
    reasoning: `Generated using ${config.model}`,
  }
}

async function generateWithOpenAI(prompt: string, config: LLMConfig): Promise<{ sql: string; reasoning: string }> {
  const client = new OpenAI({ apiKey: config.apiKey })

  const response = await client.chat.completions.create({
    model: config.model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 1024,
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error("No response from OpenAI")
  }

  return {
    sql: content,
    reasoning: `Generated using ${config.model}`,
  }
}

async function generateWithMistral(prompt: string, config: LLMConfig): Promise<{ sql: string; reasoning: string }> {
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    throw new Error(`Mistral API error: ${response.statusText}`)
  }

  const data = await response.json()
  const sql = data.choices[0]?.message?.content

  if (!sql) {
    throw new Error("No response from Mistral")
  }

  return {
    sql,
    reasoning: `Generated using ${config.model}`,
  }
}

async function generateWithGemini(prompt: string, config: LLMConfig): Promise<{ sql: string; reasoning: string }> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": config.apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`)
  }

  const data = await response.json()
  const sql = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!sql) {
    throw new Error("No response from Gemini")
  }

  return {
    sql,
    reasoning: `Generated using ${config.model}`,
  }
}

async function generateWithVercelAI(prompt: string, config: LLMConfig): Promise<{ sql: string; reasoning: string }> {
  const response = await fetch("/api/query-assistant/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model: config.model }),
  })

  if (!response.ok) {
    throw new Error(`Vercel AI Gateway error: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    sql: data.sql,
    reasoning: data.reasoning,
  }
}

// Function to handle preset template generation
async function generateWithPresetTemplate(
  config: LLMConfig & { templateId?: string },
): Promise<{ sql: string; reasoning: string }> {
  const templateId = (config as any).templateId

  if (!templateId) {
    throw new Error("No preset template selected")
  }

  const template = PRESET_TEMPLATES.find((t) => t.id === templateId)

  if (!template) {
    throw new Error(`Preset template not found: ${templateId}`)
  }

  return {
    sql: template.sql,
    reasoning: `Using preset template: ${template.name}`,
  }
}
