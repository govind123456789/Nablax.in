"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Database } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SchemaInfo } from "@/lib/query-assistant/schema-loader"

interface SchemaBrowserProps {
  schema: SchemaInfo
  onSelectTable?: (tableName: string) => void
  selectedTable?: string
}

export function SchemaBrowser({ schema, onSelectTable, selectedTable }: SchemaBrowserProps) {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set())

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables)
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName)
    } else {
      newExpanded.add(tableName)
    }
    setExpandedTables(newExpanded)
  }

  return (
    <Card className="border-gold/20 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 h-full">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2 text-gold">
          <Database className="w-4 h-4" />
          Schema Browser
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {schema.tables.map((table) => (
            <div key={table.name}>
              <button
                onClick={() => {
                  toggleTable(table.name)
                  onSelectTable?.(table.name)
                }}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-700/30 text-left text-sm transition-colors ${selectedTable === table.name ? "bg-gold/10 text-gold" : "text-gray-300"}`}
              >
                {expandedTables.has(table.name) ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="font-medium">{table.name}</span>
                <span className="text-xs text-gray-500">({table.rowCount || 0} rows)</span>
              </button>

              {expandedTables.has(table.name) && (
                <div className="ml-4 space-y-1 mt-1 border-l border-gold/10 pl-2">
                  {table.columns.map((col) => (
                    <div key={col.name} className="py-1 text-xs">
                      <div className="text-gray-400">{col.name}</div>
                      <div className="text-gray-500">{col.type}</div>
                      {col.isPrimaryKey && <div className="text-gold text-xs">Primary Key</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
