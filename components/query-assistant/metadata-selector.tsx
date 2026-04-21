"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { X, Plus } from "lucide-react"

interface MetadataItem {
  key: string
  value: string
}

interface MetadataSelectorProps {
  metadata: MetadataItem[]
  onMetadataChange: (metadata: MetadataItem[]) => void
  dataDictionary?: string
  onDictionaryChange?: (dictionary: string) => void
}

export function MetadataSelector({
  metadata,
  onMetadataChange,
  dataDictionary,
  onDictionaryChange,
}: MetadataSelectorProps) {
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  const addMetadata = () => {
    if (newKey.trim() && newValue.trim()) {
      onMetadataChange([...metadata, { key: newKey, value: newValue }])
      setNewKey("")
      setNewValue("")
    }
  }

  const removeMetadata = (index: number) => {
    onMetadataChange(metadata.filter((_, i) => i !== index))
  }

  return (
    <Card className="border border-blue-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-blue-400 mb-3">Context & Metadata</h3>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Data Dictionary (Optional)</label>
            <textarea
              value={dataDictionary || ""}
              onChange={(e) => onDictionaryChange?.(e.target.value)}
              placeholder="Paste your data dictionary here to provide context about your data..."
              className="w-full px-3 py-2 bg-slate-800 border border-blue-500/30 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400 h-20 resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">Custom Metadata</label>
            <div className="space-y-2">
              {metadata.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-slate-700/50 rounded border border-blue-500/20"
                >
                  <span className="text-xs text-blue-300 flex-1">
                    <strong>{item.key}:</strong> {item.value}
                  </span>
                  <button
                    onClick={() => removeMetadata(index)}
                    className="p-1 hover:bg-red-900/30 rounded text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Key (e.g., business_unit)"
                  className="flex-1 px-3 py-1 bg-slate-800 border border-blue-500/30 rounded text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-400"
                />
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-1 bg-slate-800 border border-blue-500/30 rounded text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-400"
                />
                <button
                  onClick={addMetadata}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
