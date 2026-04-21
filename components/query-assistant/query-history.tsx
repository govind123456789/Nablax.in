"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface QueryRecord {
  id: string
  question: string
  sql: string
  createdAt: string
  rowCount: number
}

export default function QueryHistory() {
  const [queries, setQueries] = useState<QueryRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const response = await fetch("/api/query-assistant/history")
      const data = await response.json()
      setQueries(data.queries || [])
    } catch (error) {
      console.error("Failed to load history:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading history...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Query History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {queries.slice(0, 9).map((query) => (
          <Card key={query.id} className="bg-gray-900 border-gray-800 p-4">
            <p className="text-white font-medium text-sm line-clamp-2 mb-2">{query.question}</p>
            <p className="text-gray-400 text-xs mb-3">{query.rowCount} rows</p>
            <pre className="bg-black p-2 rounded text-xs text-gray-300 overflow-hidden line-clamp-3">{query.sql}</pre>
            <p className="text-gray-500 text-xs mt-2">{new Date(query.createdAt).toLocaleDateString()}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
