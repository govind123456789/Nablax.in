"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import type { LLMConfig } from "@/lib/config/llm-providers"
import { LLMProviderSelector } from "./llm-provider-selector"
import { MetadataSelector } from "./metadata-selector"
import { PresetTemplateSelector } from "./preset-template-selector"

interface AdvancedQueryBuilderProps {
  tables: Record<string, any>
  tier: "demo" | "starter" | "professional" | "enterprise"
  onQueryGenerate: (request: {
    question: string
    selectedTables: string[]
    llmConfig: LLMConfig & { templateId?: string }
    metadata: { key: string; value: string }[]
    dataDictionary?: string
  }) => Promise<void>
  isLoading?: boolean
}

export function AdvancedQueryBuilder({ tables, tier, onQueryGenerate, isLoading }: AdvancedQueryBuilderProps) {
  const [question, setQuestion] = useState("")
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [llmConfig, setLLMConfig] = useState<LLMConfig & { templateId?: string }>({
    provider: tier === "demo" ? "preset-template" : "vercel-ai-gateway",
    apiKey: "",
    model: "gpt-4o",
    templateId: undefined,
  })
  const [metadata, setMetadata] = useState<{ key: string; value: string }[]>([])
  const [dataDictionary, setDataDictionary] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  const maxTables = tier === "demo" ? 2 : tier === "starter" ? 3 : tier === "professional" ? 10 : 999
  const hasOrdersTable = selectedTables.includes("orders")

  const handleTableToggle = (tableName: string) => {
    setSelectedTables((prev) => {
      if (prev.includes(tableName)) {
        return prev.filter((t) => t !== tableName)
      } else if (prev.length < maxTables) {
        return [...prev, tableName]
      }
      return prev
    })
    setLLMConfig((prev) => ({ ...prev, templateId: undefined }))
  }

  const handleGenerate = async () => {
    if (!question.trim()) {
      alert("Please ask a question about your data")
      return
    }
    if (selectedTables.length === 0) {
      alert("Please select at least one table")
      return
    }
    if (tier === "demo" && !llmConfig.templateId) {
      alert("Please select a preset template from Advanced Options")
      return
    }

    await onQueryGenerate({
      question,
      selectedTables,
      llmConfig,
      metadata,
      dataDictionary,
    })
  }

  const handleTemplateSelect = (templateId: string) => {
    setLLMConfig((prev) => ({
      ...prev,
      templateId,
    }))
  }

  return (
    <div className="space-y-4">
      {/* Main Query Card */}
      <Card className="border border-blue-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-lg">
        <div className="space-y-5">
          {/* Question Input */}
          <div>
            <label className="block text-sm font-semibold text-blue-400 mb-2">What would you like to know?</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="E.g., What are the top customers by revenue? Show me monthly sales trends..."
              className="w-full px-4 py-3 bg-slate-800 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 resize-none h-20"
            />
          </div>

          {/* Table Selection */}
          <div>
            <label className="block text-sm font-semibold text-blue-400 mb-3">
              Select Tables to Analyze ({selectedTables.length}/{maxTables})
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(tables).map(([tableName, tableData]) => {
                const isSelected = selectedTables.includes(tableName)
                const canSelect = isSelected || selectedTables.length < maxTables

                return (
                  <div
                    key={tableName}
                    onClick={() => canSelect && handleTableToggle(tableName)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-400 bg-blue-900/20 shadow-md"
                        : canSelect
                          ? "border-blue-500/20 bg-slate-800/50 hover:border-blue-500/40 hover:bg-slate-800"
                          : "border-red-500/20 bg-slate-800 opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleTableToggle(tableName)}
                        disabled={!canSelect}
                      />
                      <div>
                        <div className="font-medium text-white capitalize">{tableName}</div>
                        <div className="text-xs text-gray-400">{tableData.rowCount} rows</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {selectedTables.length >= maxTables && tier === "demo" && (
              <p className="text-xs text-amber-400 mt-2 ml-1">Max tables reached. Upgrade for more.</p>
            )}
          </div>

          {/* Advanced Options Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </button>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !question.trim() || selectedTables.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? "Generating SQL..." : "Generate SQL with AI"}
          </Button>
        </div>
      </Card>

      {/* Advanced Options Section */}
      {showAdvanced && (
        <div className="space-y-4">
          {tier === "demo" && (
            <Card className="border border-blue-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-6">
              <h3 className="text-sm font-semibold text-blue-400 mb-4">Preset Templates</h3>
              {hasOrdersTable ? (
                <PresetTemplateSelector
                  onTemplateSelect={handleTemplateSelect}
                  availableTables={selectedTables}
                  disabled={selectedTables.length === 0}
                />
              ) : (
                <div className="p-4 border border-amber-500/30 bg-amber-900/20 rounded-lg">
                  <p className="text-sm text-amber-300">
                    Select the <span className="font-semibold">Orders</span> table to view available templates.
                  </p>
                </div>
              )}
            </Card>
          )}

          {tier !== "demo" && (
            <LLMProviderSelector config={llmConfig} onConfigChange={setLLMConfig} disabled={false} isDemoMode={false} />
          )}

          <MetadataSelector
            metadata={metadata}
            onMetadataChange={setMetadata}
            dataDictionary={dataDictionary}
            onDictionaryChange={setDataDictionary}
          />

          {tier === "demo" && llmConfig.templateId && (
            <Card className="border border-green-500/30 bg-green-900/20 p-4">
              <p className="text-sm text-green-300 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                Preset template selected. Ready to generate SQL.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
