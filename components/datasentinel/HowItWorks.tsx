"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Database, Brain, Shield } from "lucide-react"

export default function DataSentinelHowItWorks() {
  return (
    <section className="py-20 container mx-auto px-6">
      <h2 className="text-4xl font-light mb-6 text-center tracking-tight text-[#10b981]">How DataSentinel Works</h2>
      <p className="text-center text-[#b8b8b8] mb-16 max-w-2xl mx-auto">
        Continuous monitoring and intelligent anomaly detection across your entire data pipeline
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        <Card className="bg-[#0f1f0f]/50 border-[#10b981]/30 p-6">
          <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center mb-4">
            <Database className="w-6 h-6 text-[#10b981]" />
          </div>
          <h3 className="text-xl font-light mb-3 text-[#10b981]">1. Data Ingestion</h3>
          <p className="text-[#b8b8b8] text-sm leading-relaxed">
            Connects to your data pipelines and establishes baseline patterns for volume, schema, distribution, and
            latency metrics.
          </p>
        </Card>

        <Card className="bg-[#0f1f0f]/50 border-[#10b981]/30 p-6">
          <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-[#10b981]" />
          </div>
          <h3 className="text-xl font-light mb-3 text-[#10b981]">2. Continuous Analysis</h3>
          <p className="text-[#b8b8b8] text-sm leading-relaxed">
            AI models continuously compare incoming data against baselines, detecting statistical anomalies and pattern
            deviations in real-time.
          </p>
        </Card>

        <Card className="bg-[#0f1f0f]/50 border-[#10b981]/30 p-6">
          <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-[#10b981]" />
          </div>
          <h3 className="text-xl font-light mb-3 text-[#10b981]">3. Smart Response</h3>
          <p className="text-[#b8b8b8] text-sm leading-relaxed">
            Automatically gates suspicious data, alerts teams with actionable context, and suggests remediation
            strategies.
          </p>
        </Card>
      </div>

      <div className="bg-[#0f1f0f]/80 border border-[#10b981]/30 rounded-2xl p-8 max-w-5xl mx-auto backdrop-blur-sm">
        <h3 className="text-2xl font-light text-[#10b981] mb-8 text-center">Live Monitoring Pipeline</h3>
        <motion.svg
          width="100%"
          height="200"
          viewBox="0 0 800 200"
          className="max-w-full"
          initial="hidden"
          animate="visible"
        >
          {/* Data Source */}
          <motion.rect
            x="20"
            y="70"
            width="120"
            height="60"
            rx="8"
            fill="#04120d"
            stroke="#10b981"
            strokeWidth="2"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          <motion.text x="45" y="105" fill="#10b981" fontSize="12">
            Data Source
          </motion.text>

          {/* DataSentinel Engine */}
          <motion.rect
            x="220"
            y="50"
            width="180"
            height="100"
            rx="12"
            fill="#051510"
            stroke="#10b981"
            strokeWidth="2.5"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.2 }}
          />
          <motion.text x="245" y="80" fill="#10b981" fontSize="14" fontWeight="600">
            DataSentinel
          </motion.text>
          <motion.text x="245" y="100" fill="#86efac" fontSize="10">
            Schema Validation
          </motion.text>
          <motion.text x="245" y="115" fill="#86efac" fontSize="10">
            Anomaly Detection
          </motion.text>
          <motion.text x="245" y="130" fill="#86efac" fontSize="10">
            Trust Scoring
          </motion.text>

          {/* Trust Gate */}
          <motion.rect
            x="480"
            y="70"
            width="120"
            height="60"
            rx="8"
            fill="#04120d"
            stroke="#10b981"
            strokeWidth="2"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.4 }}
          />
          <motion.text x="510" y="105" fill="#10b981" fontSize="12">
            Trust Gate
          </motion.text>

          {/* Downstream Systems */}
          <motion.rect
            x="660"
            y="70"
            width="120"
            height="60"
            rx="8"
            fill="#04120d"
            stroke="#22c55e"
            strokeWidth="2"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.6 }}
          />
          <motion.text x="675" y="105" fill="#22c55e" fontSize="12">
            Production
          </motion.text>

          {/* Data flow arrows */}
          <motion.path
            d="M140 100 L220 100"
            stroke="#10b981"
            strokeWidth="3"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.path
            d="M400 100 L480 100"
            stroke="#10b981"
            strokeWidth="3"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.path
            d="M600 100 L660 100"
            stroke="#22c55e"
            strokeWidth="3"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 0.8, delay: 0.7 }}
          />

          {/* Alert path */}
          <motion.path
            d="M310 50 L310 20 L540 20 L540 60"
            stroke="#f97316"
            strokeWidth="2"
            strokeDasharray="4 4"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 1, delay: 0.8 }}
          />

          {/* Pulse indicators */}
          <motion.circle
            cx="310"
            cy="100"
            r="8"
            fill="#10b981"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          />
          <motion.circle
            cx="540"
            cy="100"
            r="8"
            fill="#22c55e"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.5 }}
          />
        </motion.svg>
      </div>
    </section>
  )
}
