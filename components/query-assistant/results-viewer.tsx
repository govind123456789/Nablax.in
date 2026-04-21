"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ResultsViewerProps {
  rows: any[]
  insights?: string
  suggestedChartType?: string
  executionTimeMs?: number
  rowCount?: number
}

const COLORS = ["#d4af37", "#8b7355", "#556b2f", "#5f9ea0", "#daa520"]

export function ResultsViewer({ rows, insights, suggestedChartType, executionTimeMs, rowCount }: ResultsViewerProps) {
  const { chartData, chartKeys } = useMemo(() => {
    if (!rows || rows.length === 0) return { chartData: [], chartKeys: [] }

    const keys = Object.keys(rows[0])
    const numericKeys = keys.filter((k) => typeof rows[0][k] === "number")

    return {
      chartData: rows,
      chartKeys: numericKeys.length > 0 ? numericKeys : [],
    }
  }, [rows])

  const renderChart = () => {
    if (!chartKeys || chartKeys.length === 0 || rows.length === 0) {
      return null
    }

    const chartType = suggestedChartType || "bar"

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={Object.keys(rows[0])[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartKeys.map((key, idx) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[idx % COLORS.length]} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={chartKeys[0]}
                nameKey={Object.keys(rows[0])[0]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      default: // bar
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={Object.keys(rows[0])[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartKeys.map((key, idx) => (
                <Bar key={key} dataKey={key} fill={COLORS[idx % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="space-y-4">
      {suggestedChartType && rows.length > 0 && (
        <Card className="border-gold/20 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30">
          <CardHeader>
            <CardTitle className="text-gold">Visualization</CardTitle>
          </CardHeader>
          <CardContent>{renderChart()}</CardContent>
        </Card>
      )}

      {insights && (
        <Card className="border-gold/20 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30">
          <CardHeader>
            <CardTitle className="text-gold">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{insights}</p>
          </CardContent>
        </Card>
      )}

      <Card className="border-gold/20 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30">
        <CardHeader>
          <CardTitle className="text-gold">Results</CardTitle>
          <CardDescription className="text-gray-400">
            {rowCount} rows returned in {executionTimeMs}ms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/20">
                  {Object.keys(rows[0] || {}).map((key) => (
                    <th key={key} className="px-4 py-2 text-left text-gold font-semibold">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-zinc-700/50 hover:bg-zinc-800/30">
                    {Object.values(row).map((value, valueIdx) => (
                      <td key={valueIdx} className="px-4 py-2 text-gray-300">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
