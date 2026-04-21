"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Edit2, RotateCcw } from "lucide-react"
import { toast } from "sonner"

interface SQLEditorProps {
  sql: string
  onSQLChange: (sql: string) => void
  onExecute: (sql: string) => Promise<void>
  isLoading?: boolean
  hasError?: boolean
  errorMessage?: string
}

export function SQLEditor({ sql, onSQLChange, onExecute, isLoading, hasError, errorMessage }: SQLEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedSQL, setEditedSQL] = useState(sql)

  const handleSave = () => {
    onSQLChange(editedSQL)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedSQL(sql)
    setIsEditing(false)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(sql)
    toast.success("SQL copied to clipboard")
  }

  const resetToGenerated = () => {
    setEditedSQL(sql)
  }

  return (
    <Card
      className={`border bg-gradient-to-br from-slate-900 to-slate-800 p-4 space-y-3 ${hasError ? "border-red-500/40" : "border-blue-500/20"}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-blue-400">Generated SQL</h3>
          {hasError && <p className="text-xs text-red-400 mt-1">{errorMessage}</p>}
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-blue-900/30 rounded text-blue-400 text-xs flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
              <button
                onClick={() => {
                  setIsEditing(true)
                  setEditedSQL(sql)
                }}
                className="p-2 hover:bg-blue-900/30 rounded text-blue-400 text-xs flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedSQL}
            onChange={(e) => setEditedSQL(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-blue-500/30 rounded font-mono text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 resize-none h-48"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={resetToGenerated}
              variant="outline"
              className="flex-1 flex items-center gap-2 bg-transparent"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 border border-blue-500/20 rounded p-4 font-mono text-sm text-gray-300 overflow-x-auto max-h-64 overflow-y-auto">
          <pre>{sql}</pre>
        </div>
      )}

      <Button
        onClick={() => onExecute(editedSQL || sql)}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
      >
        {isLoading ? "Executing..." : "Execute Query"}
      </Button>
    </Card>
  )
}
