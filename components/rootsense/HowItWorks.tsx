"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Brain, Search, Lightbulb } from "lucide-react"

export default function RootSenseHowItWorks() {
  return (
    <section className="py-20 container mx-auto px-6">
      <h2 className="text-4xl font-light mb-6 text-center tracking-tight text-[#f97316]">How RootSense Works</h2>
      <p className="text-center text-[#b8b8b8] mb-16 max-w-2xl mx-auto">
        Deep explainability and causal intelligence for AI decisions
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        <Card className="bg-[#221a0f]/50 border-[#f97316]/30 p-6">
          <div className="w-12 h-12 rounded-xl bg-[#f97316]/20 flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-[#f97316]" />
          </div>
          <h3 className="text-xl font-light mb-3 text-[#f97316]">1. Decision Capture</h3>
          <p className="text-[#b8b8b8] text-sm leading-relaxed">
            Intercepts AI model outputs and extracts feature importance, confidence scores, and input context for every
            prediction.
          </p>
        </Card>

        <Card className="bg-[#221a0f]/50 border-[#f97316]/30 p-6">
          <div className="w-12 h-12 rounded-xl bg-[#f97316]/20 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-[#f97316]" />
          </div>
          <h3 className="text-xl font-light mb-3 text-[#f97316]">2. Causal Analysis</h3>
          <p className="text-[#b8b8b8] text-sm leading-relaxed">
            Applies causal reasoning to identify root drivers, performs similarity search against historical cases, and
            constructs explanation narratives.
          </p>
        </Card>

        <Card className="bg-[#221a0f]/50 border-[#f97316]/30 p-6">
          <div className="w-12 h-12 rounded-xl bg-[#f97316]/20 flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-[#f97316]" />
          </div>
          <h3 className="text-xl font-light mb-3 text-[#f97316]">3. Actionable Insights</h3>
          <p className="text-[#b8b8b8] text-sm leading-relaxed">
            Delivers human-readable explanations, recommended actions based on similar past outcomes, and full audit
            trails for compliance.
          </p>
        </Card>
      </div>

      <div className="bg-[#221a0f]/80 border border-[#f97316]/30 rounded-2xl p-8 max-w-5xl mx-auto backdrop-blur-sm">
        <h3 className="text-2xl font-light text-[#f97316] mb-8 text-center">Explainability Pipeline</h3>
        <motion.svg
          width="100%"
          height="220"
          viewBox="0 0 800 220"
          className="max-w-full"
          initial="hidden"
          animate="visible"
        >
          {/* AI Model Output */}
          <motion.rect
            x="20"
            y="80"
            width="140"
            height="60"
            rx="8"
            fill="#1a1410"
            stroke="#f97316"
            strokeWidth="2"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          <motion.text x="45" y="115" fill="#f97316" fontSize="12">
            AI Prediction
          </motion.text>

          {/* RootSense Engine */}
          <motion.rect
            x="230"
            y="50"
            width="200"
            height="120"
            rx="12"
            fill="#0f0a08"
            stroke="#f97316"
            strokeWidth="2.5"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.2 }}
          />
          <motion.text x="260" y="85" fill="#f97316" fontSize="14" fontWeight="600">
            RootSense Engine
          </motion.text>
          <motion.text x="260" y="105" fill="#fb923c" fontSize="10">
            Feature Extraction
          </motion.text>
          <motion.text x="260" y="122" fill="#fb923c" fontSize="10">
            Causal Graph Builder
          </motion.text>
          <motion.text x="260" y="139" fill="#fb923c" fontSize="10">
            Similarity Matcher
          </motion.text>
          <motion.text x="260" y="156" fill="#fb923c" fontSize="10">
            Narrative Generator
          </motion.text>

          {/* Historical DB */}
          <motion.rect
            x="230"
            y="190"
            width="200"
            height="50"
            rx="8"
            fill="#1a1410"
            stroke="#f97316"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.3 }}
          />
          <motion.text x="270" y="220" fill="#fb923c" fontSize="11">
            Historical Case Database
          </motion.text>

          {/* Explanation Output */}
          <motion.rect
            x="500"
            y="80"
            width="140"
            height="60"
            rx="8"
            fill="#1a1410"
            stroke="#22c55e"
            strokeWidth="2"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.5 }}
          />
          <motion.text x="520" y="115" fill="#22c55e" fontSize="12">
            Explanation
          </motion.text>

          {/* Audit Trail */}
          <motion.rect
            x="680"
            y="80"
            width="140"
            height="60"
            rx="8"
            fill="#1a1410"
            stroke="#22c55e"
            strokeWidth="2"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.6 }}
          />
          <motion.text x="710" y="115" fill="#22c55e" fontSize="12">
            Audit Log
          </motion.text>

          {/* Flow arrows */}
          <motion.path
            d="M160 110 L230 110"
            stroke="#f97316"
            strokeWidth="3"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.path
            d="M430 110 L500 110"
            stroke="#f97316"
            strokeWidth="3"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 0.8, delay: 0.55 }}
          />
          <motion.path
            d="M640 110 L680 110"
            stroke="#22c55e"
            strokeWidth="3"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 0.8, delay: 0.65 }}
          />
          <motion.path
            d="M330 170 L330 190"
            stroke="#f97316"
            strokeWidth="2"
            strokeDasharray="4 4"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />

          {/* Pulse */}
          <motion.circle
            cx="330"
            cy="110"
            r="8"
            fill="#f97316"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          />
        </motion.svg>
      </div>
    </section>
  )
}
