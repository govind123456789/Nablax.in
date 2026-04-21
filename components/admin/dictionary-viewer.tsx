"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, Filter } from "lucide-react"

interface DictionaryField {
  id: string
  tableName: string
  columnName: string
  dataType: string
  description: string
  classification: "identifier" | "metric" | "dimension" | "time"
  confidence: number
  isPii: boolean
  nullable: boolean
  distinct: number | null
  nullPercent: number | null
}

export function DictionaryViewer({ selectedEnv }: { selectedEnv: string | null }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTable, setFilterTable] = useState("")

  const mockDictionary: DictionaryField[] = [
    {
      id: "1",
      tableName: "users",
      columnName: "user_id",
      dataType: "UUID",
      description: "Unique identifier for user accounts",
      classification: "identifier",
      confidence: 0.98,
      isPii: false,
      nullable: false,
      distinct: 125000,
      nullPercent: 0,
    },
    {
      id: "2",
      tableName: "users",
      columnName: "email",
      dataType: "VARCHAR(255)",
      description: "User email address for authentication",
      classification: "identifier",
      confidence: 0.95,
      isPii: true,
      nullable: false,
      distinct: 125000,
      nullPercent: 0,
    },
    {
      id: "3",
      tableName: "orders",
      columnName: "total_amount",
      dataType: "DECIMAL(10,2)",
      description: "Total order value including taxes",
      classification: "metric",
      confidence: 0.92,
      isPii: false,
      nullable: false,
      distinct: 8543,
      nullPercent: 0.02,
    },
    {
      id: "4",
      tableName: "orders",
      columnName: "created_at",
      dataType: "TIMESTAMP",
      description: "Timestamp when the order was created",
      classification: "time",
      confidence: 0.99,
      isPii: false,
      nullable: false,
      distinct: 125400,
      nullPercent: 0,
    },
  ]

  const filtered = mockDictionary.filter((field) => {
    const matchSearch =
      field.columnName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTable = !filterTable || field.tableName === filterTable
    return matchSearch && matchTable
  })

  const tables = [...new Set(mockDictionary.map((f) => f.tableName))]

  const getClassificationColor = (classification: string) => {
    const colors = {
      identifier: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30",
      metric: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30",
      dimension: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30",
      time: "bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30",
    }
    return colors[classification as keyof typeof colors] || colors.identifier
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-[#10b981]"
    if (confidence >= 0.7) return "text-[#f97316]"
    return "text-[#f87171]"
  }

  return (
    <div className="space-y-6">
      {!selectedEnv ? (
        <Card className="bg-[#f97316]/10 border-[#f97316]/30 p-6 flex items-center gap-3">
          <Filter className="w-5 h-5 text-[#f97316]" />
          <p className="text-sm text-[#f97316]">Select an environment to view its data dictionary</p>
        </Card>
      ) : (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
              <Input
                placeholder="Search columns, descriptions..."
                className="pl-10 bg-[#0a0a0a]/50 border-[#d4af37]/30 text-[#e8e8e8]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="bg-[#0a0a0a]/50 border border-[#d4af37]/30 rounded-lg px-4 py-2 text-[#e8e8e8] focus:border-[#d4af37] focus:outline-none"
              value={filterTable}
              onChange={(e) => setFilterTable(e.target.value)}
            >
              <option value="">All Tables</option>
              {tables.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 bg-[#d4af37] text-[#0a0a0a] rounded-lg hover:bg-[#c4a037] transition-colors flex items-center gap-2 font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Dictionary Table */}
          <div className="space-y-3">
            <p className="text-sm text-[#b8b8b8]">
              Showing {filtered.length} of {mockDictionary.length} fields
            </p>
            {filtered.map((field) => (
              <Card key={field.id} className="bg-[#1a1a1a]/50 border-[#d4af37]/30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-[#8a8a8a] bg-[#0a0a0a]/50 px-2 py-1 rounded">
                        {field.tableName}
                      </span>
                      <h3 className="text-lg font-medium text-[#e8e8e8]">{field.columnName}</h3>
                      <Badge className={`${getClassificationColor(field.classification)} border`}>
                        {field.classification}
                      </Badge>
                      {field.isPii && (
                        <Badge className="bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30">PII</Badge>
                      )}
                    </div>
                    <p className="text-[#b8b8b8] mb-3">{field.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-[#8a8a8a]">
                        <span className="text-[#d4af37]">Type:</span> {field.dataType}
                      </span>
                      <span className="text-[#8a8a8a]">
                        <span className="text-[#d4af37]">Nullable:</span> {field.nullable ? "Yes" : "No"}
                      </span>
                      {field.distinct && (
                        <span className="text-[#8a8a8a]">
                          <span className="text-[#d4af37]">Distinct:</span> {field.distinct.toLocaleString()}
                        </span>
                      )}
                      {field.nullPercent !== null && (
                        <span className="text-[#8a8a8a]">
                          <span className="text-[#d4af37]">Null %:</span> {field.nullPercent.toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getConfidenceColor(field.confidence)}`}>
                        {(field.confidence * 100).toFixed(0)}% confidence
                      </p>
                      <p className="text-xs text-[#8a8a8a]">AI-generated</p>
                    </div>
                    <button className="p-2 hover:bg-[#d4af37]/10 rounded transition-colors">
                      <Eye className="w-4 h-4 text-[#d4af37]" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
