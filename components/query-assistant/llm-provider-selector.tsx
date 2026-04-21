"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { PresetTemplateSelector } from "./preset-template-selector"
import type { LLMProvider, LLMConfig } from "@/lib/config/llm-providers"
import { AVAILABLE_MODELS } from "@/lib/config/llm-providers"

interface LLMProviderSelectorProps {
  config: LLMConfig
  onConfigChange: (config: LLMConfig) => void
  disabled?: boolean
  availableTables?: string[]
  onTemplateSelect?: (templateId: string, sql: string) => void
  isDemoMode?: boolean
}

export function LLMProviderSelector({
  config,
  onConfigChange,
  disabled,
  availableTables = [],
  onTemplateSelect,
  isDemoMode = false,
}: LLMProviderSelectorProps) {
  const [showProvider, setShowProvider] = useState(false)
  const [showModel, setShowModel] = useState(false)

  const effectiveProvider = isDemoMode ? "preset-template" : config.provider
  const effectiveConfig = { ...config, provider: effectiveProvider }

  const handleProviderChange = (provider: LLMProvider) => {
    const models =
      AVAILABLE_MODELS[
        Object.keys(AVAILABLE_MODELS).find((key) => AVAILABLE_MODELS[key].provider === provider) || "vercelAI"
      ]
    setShowProvider(false)
    onConfigChange({
      ...config,
      provider,
      model: models.models[0],
    })
  }

  const handleModelChange = (model: string) => {
    setShowModel(false)
    onConfigChange({ ...config, model })
  }

  const currentProviderModels =
    AVAILABLE_MODELS[
      Object.keys(AVAILABLE_MODELS).find((key) => AVAILABLE_MODELS[key].provider === effectiveProvider) || "vercelAI"
    ]

  return (
    <Card className="border border-blue-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-400 mb-2">LLM Provider</label>
          {isDemoMode ? (
            <div className="w-full px-4 py-2 bg-slate-800 border border-blue-500/30 rounded-lg text-white flex justify-between items-center">
              <span className="capitalize">Preset Templates</span>
              <span className="text-xs text-gray-400">(Demo Mode Only)</span>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProvider(!showProvider)}
                disabled={disabled}
                className="w-full px-4 py-2 bg-slate-800 border border-blue-500/30 rounded-lg text-white text-left flex justify-between items-center hover:border-blue-400/50 disabled:opacity-50"
              >
                <span className="capitalize">{effectiveProvider.replace("-", " ")}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showProvider ? "rotate-180" : ""}`} />
              </button>

              {showProvider && (
                <div className="absolute top-full mt-1 w-full bg-slate-800 border border-blue-500/30 rounded-lg shadow-lg z-50">
                  {Object.entries(AVAILABLE_MODELS).map(([key, model]) => (
                    <button
                      key={key}
                      onClick={() => handleProviderChange(model.provider)}
                      className="w-full px-4 py-2 text-left hover:bg-blue-600/20 text-white border-b border-blue-500/10 last:border-0"
                    >
                      <div className="font-medium">{model.description}</div>
                      <div className="text-xs text-gray-400">{model.models.slice(0, 2).join(", ")}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {effectiveProvider === "preset-template" ? (
          <PresetTemplateSelector
            availableTables={availableTables}
            onTemplateSelect={(templateId, sql) => {
              onConfigChange({ ...config, provider: "preset-template", presetTemplate: templateId })
              onTemplateSelect?.(templateId, sql)
            }}
            disabled={disabled}
          />
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-blue-400 mb-2">Model</label>
              <div className="relative">
                <button
                  onClick={() => setShowModel(!showModel)}
                  disabled={disabled}
                  className="w-full px-4 py-2 bg-slate-800 border border-blue-500/30 rounded-lg text-white text-left flex justify-between items-center hover:border-blue-400/50 disabled:opacity-50"
                >
                  <span>{config.model}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showModel ? "rotate-180" : ""}`} />
                </button>

                {showModel && (
                  <div className="absolute top-full mt-1 w-full bg-slate-800 border border-blue-500/30 rounded-lg shadow-lg z-50">
                    {currentProviderModels.models.map((model) => (
                      <button
                        key={model}
                        onClick={() => handleModelChange(model)}
                        className="w-full px-4 py-2 text-left hover:bg-blue-600/20 text-white border-b border-blue-500/10 last:border-0"
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {effectiveProvider !== "vercel-ai-gateway" && (
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-2">API Key</label>
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => onConfigChange({ ...config, apiKey: e.target.value })}
                  placeholder="Paste your API key here"
                  className="w-full px-4 py-2 bg-slate-800 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                />
              </div>
            )}

            {effectiveProvider === "vercel-ai-gateway" && (
              <div className="px-3 py-2 bg-blue-900/20 border border-blue-500/30 rounded-lg text-sm text-blue-300">
                Using Vercel AI Gateway (No API key required)
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
