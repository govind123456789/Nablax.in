"use client"

import { Card } from "@/components/ui/card"
import { Brain, TrendingUp, Network, Target } from "lucide-react"

export default function RootSenseHowItThinks() {
  return (
    <section className="py-20 container mx-auto px-6 bg-gradient-to-b from-transparent to-[#0a0a0f]/50">
      <h2 className="text-4xl font-light mb-6 text-center tracking-tight text-[#f97316]">How RootSense Thinks</h2>
      <p className="text-center text-[#b8b8b8] mb-16 max-w-2xl mx-auto">
        Advanced causal reasoning that transforms black-box predictions into transparent insights
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="bg-[#221a0f]/80 border-[#f97316]/30 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#f97316]/20 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-[#f97316]" />
            </div>
            <div>
              <h3 className="text-xl text-[#f97316] mb-2">Causal Inference</h3>
              <p className="text-sm text-[#b8b8b8]">
                Builds causal graphs to understand the "why" behind predictions, not just correlations
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[#b8b8b8] ml-16">
            <li className="flex items-start gap-2">
              <span className="text-[#f97316]">•</span>
              <span>Feature attribution using SHAP and LIME</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#f97316]">•</span>
              <span>Counterfactual scenario generation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#f97316]">•</span>
              <span>Intervention effect modeling</span>
            </li>
          </ul>
        </Card>

        <Card className="bg-[#221a0f]/80 border-[#f97316]/30 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#f97316]/20 flex items-center justify-center flex-shrink-0">
              <Network className="w-6 h-6 text-[#f97316]" />
            </div>
            <div>
              <h3 className="text-xl text-[#f97316] mb-2">Similarity Intelligence</h3>
              <p className="text-sm text-[#b8b8b8]">
                Finds analogous past cases using semantic embeddings and multi-dimensional similarity
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[#b8b8b8] ml-16">
            <li className="flex items-start gap-2">
              <span className="text-[#f97316]">•</span>
              <span>Vector-based case retrieval</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#f97316]">•</span>
              <span>Contextual feature matching</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#f97316]">•</span>
              <span>Outcome pattern recognition</span>
            </li>
          </ul>
        </Card>

        <Card className="bg-[#221a0f]/80 border-[#f97316]/30 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#f97316]/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-[#f97316]" />
            </div>
            <div>
              <h3 className="text-xl text-[#f97316] mb-2">Confidence Calibration</h3>
              <p className="text-sm text-[#b8b8b8]">
                Assesses the reliability of explanations based on data quality and model uncertainty
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[#b8b8b8] ml-16">
            <li className="flex items-start gap-2">
              <span className="text-[#f97316]">•</span>
              <span>Explanation stability analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#f97316]">•</span>
              <span>Uncertainty quantification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#f97316]">•</span>
              <span>Trust score computation</span>
            </li>
          </ul>
        </Card>

        <Card className="bg-[#221a0f]/80 border-[#f97316]/30 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#f97316]/20 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-[#f97316]" />
            </div>
            <div>
              <h3 className="text-xl text-[#f97316] mb-2">Narrative Construction</h3>
              <p className="text-sm text-[#b8b8b8]">
                Transforms technical insights into clear, actionable narratives for stakeholders
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[#b8b8b8] ml-16">
            <li className="flex items-start gap-2">
              <span className="text-[#f97316]">•</span>
              <span>Natural language generation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#f97316]">•</span>
              <span>Context-aware templating</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#f97316]">•</span>
              <span>Stakeholder-specific formatting</span>
            </li>
          </ul>
        </Card>
      </div>
    </section>
  )
}
