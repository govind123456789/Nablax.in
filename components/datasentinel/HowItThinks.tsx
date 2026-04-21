"use client"

import { Card } from "@/components/ui/card"
import { Brain, TrendingUp, GitBranch, Zap } from "lucide-react"

export default function DataSentinelHowItThinks() {
  return (
    <section className="py-20 container mx-auto px-6 bg-gradient-to-b from-transparent to-[#0a0a0f]/50">
      <h2 className="text-4xl font-light mb-6 text-center tracking-tight text-[#10b981]">How DataSentinel Thinks</h2>
      <p className="text-center text-[#b8b8b8] mb-16 max-w-2xl mx-auto">
        Advanced AI reasoning that understands your data's behavior patterns and context
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="bg-[#0f1f0f]/80 border-[#10b981]/30 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <h3 className="text-xl text-[#10b981] mb-2">Statistical Learning</h3>
              <p className="text-sm text-[#b8b8b8]">
                Builds dynamic baselines that adapt to seasonal patterns, business cycles, and gradual data evolution
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[#b8b8b8] ml-16">
            <li className="flex items-start gap-2">
              <span className="text-[#10b981]">•</span>
              <span>Multi-dimensional distribution analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#10b981]">•</span>
              <span>Time-series pattern recognition</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#10b981]">•</span>
              <span>Correlation detection across data streams</span>
            </li>
          </ul>
        </Card>

        <Card className="bg-[#0f1f0f]/80 border-[#10b981]/30 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <h3 className="text-xl text-[#10b981] mb-2">Anomaly Scoring</h3>
              <p className="text-sm text-[#b8b8b8]">
                Sophisticated scoring that separates true anomalies from expected variance and noise
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[#b8b8b8] ml-16">
            <li className="flex items-start gap-2">
              <span className="text-[#10b981]">•</span>
              <span>Context-aware severity classification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#10b981]">•</span>
              <span>False positive reduction through ensemble methods</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#10b981]">•</span>
              <span>Business impact prediction</span>
            </li>
          </ul>
        </Card>

        <Card className="bg-[#0f1f0f]/80 border-[#10b981]/30 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
              <GitBranch className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <h3 className="text-xl text-[#10b981] mb-2">Causal Reasoning</h3>
              <p className="text-sm text-[#b8b8b8]">
                Traces anomalies back to root causes across complex data lineage and dependencies
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[#b8b8b8] ml-16">
            <li className="flex items-start gap-2">
              <span className="text-[#10b981]">•</span>
              <span>Upstream source identification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#10b981]">•</span>
              <span>Dependency graph traversal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#10b981]">•</span>
              <span>Impact propagation modeling</span>
            </li>
          </ul>
        </Card>

        <Card className="bg-[#0f1f0f]/80 border-[#10b981]/30 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <h3 className="text-xl text-[#10b981] mb-2">Adaptive Response</h3>
              <p className="text-sm text-[#b8b8b8]">
                Learns from human feedback and adjusts sensitivity based on operational outcomes
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[#b8b8b8] ml-16">
            <li className="flex items-start gap-2">
              <span className="text-[#10b981]">•</span>
              <span>Reinforcement from human corrections</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#10b981]">•</span>
              <span>Alert threshold optimization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#10b981]">•</span>
              <span>Pattern library expansion</span>
            </li>
          </ul>
        </Card>
      </div>
    </section>
  )
}
