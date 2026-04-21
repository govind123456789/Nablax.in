"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PRESET_TEMPLATES, TEMPLATE_CATEGORIES, type TemplateCategory } from "@/lib/config/preset-templates"
import { ChevronRight } from "lucide-react"

interface PresetTemplateSelectorProps {
  onTemplateSelect: (templateId: string, sql: string) => void
  availableTables: string[]
  disabled?: boolean
}

export function PresetTemplateSelector({ onTemplateSelect, availableTables, disabled }: PresetTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("customer")

  const filteredTemplates = PRESET_TEMPLATES.filter((template) => {
    const hasRequiredTables = template.requiredTables.every((table) => availableTables.includes(table))
    return template.category === selectedCategory && hasRequiredTables
  })

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-blue-400 mb-3">Template Category</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(TEMPLATE_CATEGORIES) as [TemplateCategory, string][]).map(([category, label]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              disabled={disabled}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              } disabled:opacity-50`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-blue-400">Available Templates</label>
        {filteredTemplates.length === 0 ? (
          <Card className="border border-amber-500/30 bg-amber-900/20 p-4">
            <p className="text-sm text-amber-300">
              No templates available for the selected tables. Try selecting different tables or categories.
            </p>
          </Card>
        ) : (
          filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="border border-blue-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-4 hover:border-blue-400/50 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {template.requiredTables.map((table) => (
                      <span
                        key={table}
                        className="text-xs bg-blue-900/30 border border-blue-500/30 px-2 py-1 rounded text-blue-300"
                      >
                        {table}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => onTemplateSelect(template.id, template.sql)}
                  disabled={disabled}
                  className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap flex items-center gap-2"
                >
                  Use Template
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
