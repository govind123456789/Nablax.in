"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Lightbulb, BarChart3 } from "lucide-react"

export type FeatureLevel = "sql" | "sql-insights" | "sql-insights-graphs"

interface FeatureSelectorProps {
  onSelect: (features: FeatureLevel) => void
  onSkip: () => void
}

export function FeatureSelector({ onSelect, onSkip }: FeatureSelectorProps) {
  const features = [
    {
      id: "sql",
      name: "SQL Generation",
      description: "Ask questions and get SQL queries",
      icon: Code,
      color: "#3b82f6",
    },
    {
      id: "sql-insights",
      name: "SQL + Insights",
      description: "SQL queries with AI-powered analysis",
      icon: Lightbulb,
      color: "#3b82f6",
    },
    {
      id: "sql-insights-graphs",
      name: "SQL + Insights + Graphs",
      description: "Complete analytics with visualizations",
      icon: BarChart3,
      color: "#3b82f6",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl border-[#3b82f6]/30 bg-[#0f1622] backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-[#3b82f6] text-2xl">Choose Your Experience</CardTitle>
          <p className="text-[#b8b8b8] text-sm mt-2">Select what you'd like to do with QueryMind</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <button
                  key={feature.id}
                  onClick={() => onSelect(feature.id as FeatureLevel)}
                  className="p-4 border-2 border-[#3b82f6]/30 hover:border-[#3b82f6] rounded-lg bg-[#0f1622]/50 text-left transition-all hover:bg-[#0f1622]/80"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="w-6 h-6 text-[#3b82f6]" />
                  </div>
                  <p className="font-semibold text-[#e8e8e8] mb-1">{feature.name}</p>
                  <p className="text-xs text-[#b8b8b8]">{feature.description}</p>
                </button>
              )
            })}
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#3b82f6]/20">
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex-1 border-[#3b82f6]/30 text-[#3b82f6] hover:bg-[#3b82f6]/10 bg-transparent"
            >
              Continue with Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
