"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Sparkles, Database, Cpu, Shield, CheckCircle2, Zap } from "lucide-react"

export default function QueryMindArchitectureStateful() {
  const [activeLayer, setActiveLayer] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLayer((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const trackArchitectureView = () => {
    if (typeof window !== "undefined" && (window as any).analytics) {
      ;(window as any).analytics.track("Architecture Diagram Viewed", {
        product: "QueryMind",
        section: "Technical Architecture",
      })
    }
  }

  useEffect(() => {
    trackArchitectureView()
  }, [])

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden bg-gradient-to-br from-[#020617] via-[#0c1629] to-[#020617]">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                           linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 60px 60px, 60px 60px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-xs sm:text-sm text-[#3b82f6] font-medium">Enterprise-Grade Intelligence</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6">
            Technical{" "}
            <span className="bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#3b82f6] bg-clip-text text-transparent font-medium">
              Architecture
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Multi-layer AI system combining natural language understanding, semantic reasoning, and secure execution for
            enterprise analytics
          </p>
        </div>

        <div className="max-w-7xl mx-auto mb-12 sm:mb-20">
          <div className="relative bg-gradient-to-br from-[#0a1628]/90 via-[#0f1f3a]/90 to-[#0a1628]/90 border border-[#3b82f6]/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 backdrop-blur-xl shadow-2xl">
            {/* Ambient glow effects */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3b82f6]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#60a5fa]/20 rounded-full blur-3xl" />

            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Layer 1: Input Intelligence */}
              <ArchitectureLayer
                icon={Sparkles}
                title="Input Layer"
                subtitle="Natural Language"
                active={activeLayer === 0}
                details={["NLU Engine", "Context Parser", "Intent Recognition", "Query Decomposition"]}
                color="from-[#1e3a8a] to-[#1e40af]"
                glowColor="rgba(59, 130, 246, 0.3)"
                delay={0}
              />

              {/* Layer 2: Semantic Core */}
              <ArchitectureLayer
                icon={Cpu}
                title="Semantic Core"
                subtitle="Meaning Construction"
                active={activeLayer === 1}
                details={["Schema Intelligence", "Entity Resolution", "Relationship Mapping", "Logic Validation"]}
                color="from-[#1e40af] to-[#2563eb]"
                glowColor="rgba(96, 165, 250, 0.3)"
                delay={0.1}
              />

              {/* Layer 3: Execution Engine */}
              <ArchitectureLayer
                icon={Database}
                title="Execution Layer"
                subtitle="Query Generation"
                active={activeLayer === 2}
                details={["SQL Synthesis", "Query Optimization", "Cost Estimation", "Sandboxed Execution"]}
                color="from-[#2563eb] to-[#3b82f6]"
                glowColor="rgba(59, 130, 246, 0.3)"
                delay={0.2}
              />

              {/* Layer 4: Trust & Security */}
              <ArchitectureLayer
                icon={Shield}
                title="Trust Layer"
                subtitle="Security & Compliance"
                active={activeLayer === 3}
                details={["Permission Check", "Data Masking", "Audit Trail", "Result Verification"]}
                color="from-[#059669] to-[#10b981]"
                glowColor="rgba(16, 185, 129, 0.3)"
                delay={0.3}
              />
            </div>

            <div className="mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-white/10">
              <div className="hidden lg:flex items-center justify-between gap-4">
                <DataFlowNode icon={Sparkles} label="User Query" active={activeLayer === 0} />
                <FlowArrow active={activeLayer === 0} />
                <DataFlowNode icon={Cpu} label="Semantic Parse" active={activeLayer === 1} />
                <FlowArrow active={activeLayer === 1} />
                <DataFlowNode icon={Database} label="SQL Gen" active={activeLayer === 2} />
                <FlowArrow active={activeLayer === 2} />
                <DataFlowNode icon={Shield} label="Secure Exec" active={activeLayer === 3} />
                <FlowArrow active={activeLayer === 3} />
                <DataFlowNode icon={CheckCircle2} label="Results" active={activeLayer === 3} isEnd />
              </div>
              {/* Simplified mobile flow */}
              <div className="lg:hidden grid grid-cols-3 gap-3">
                <DataFlowNode icon={Sparkles} label="Input" active={activeLayer === 0} />
                <DataFlowNode icon={Cpu} label="Process" active={activeLayer === 1 || activeLayer === 2} />
                <DataFlowNode icon={CheckCircle2} label="Output" active={activeLayer === 3} isEnd />
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          <TechFeatureCard
            icon={Zap}
            title="Sub-Second Response"
            description="Optimized query generation and execution with intelligent caching and parallel processing"
            accentColor="text-[#3b82f6]"
            bgColor="bg-[#3b82f6]/5"
            borderColor="border-[#3b82f6]/20"
          />
          <TechFeatureCard
            icon={Shield}
            title="Enterprise Security"
            description="Row-level security, data masking, and comprehensive audit trails for compliance"
            accentColor="text-emerald-400"
            bgColor="bg-emerald-500/5"
            borderColor="border-emerald-500/20"
          />
          <TechFeatureCard
            icon={Cpu}
            title="Multi-Model Intelligence"
            description="Ensemble of specialized LLMs optimized for SQL generation, validation, and explanation"
            accentColor="text-[#60a5fa]"
            bgColor="bg-[#60a5fa]/5"
            borderColor="border-[#60a5fa]/20"
          />
        </div>
      </div>
    </section>
  )
}

function ArchitectureLayer({
  icon: Icon,
  title,
  subtitle,
  active,
  details,
  color,
  glowColor,
  delay,
}: {
  icon: any
  title: string
  subtitle: string
  active: boolean
  details: string[]
  color: string
  glowColor: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: active ? 1 : 0.6,
        y: 0,
        scale: active ? 1.05 : 1,
      }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      {active && (
        <motion.div
          className="absolute inset-0 rounded-2xl blur-2xl opacity-50"
          style={{ background: glowColor }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      <div
        className={`relative bg-gradient-to-br ${color} rounded-2xl p-6 border ${active ? "border-white/30" : "border-white/10"} transition-all duration-500 h-full`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
          {active && (
            <motion.div
              className="w-2 h-2 rounded-full bg-white"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
          )}
        </div>

        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-white/60 mb-4">{subtitle}</p>

        <ul className="space-y-2">
          {details.map((detail, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: active ? 1 : 0.7, x: 0 }}
              transition={{ delay: delay + i * 0.1 }}
              className="text-xs text-white/80 flex items-start gap-2"
            >
              <span className="text-white mt-0.5">•</span>
              <span>{detail}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function DataFlowNode({
  icon: Icon,
  label,
  active,
  isEnd = false,
}: { icon: any; label: string; active: boolean; isEnd?: boolean }) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.1 : 1,
        opacity: active ? 1 : 0.5,
      }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col items-center gap-2 ${active ? "z-10" : "z-0"}`}
    >
      <div
        className={`p-4 rounded-xl ${isEnd ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30" : "bg-[#1e40af]/20 border border-[#3b82f6]/30"} backdrop-blur-sm transition-all duration-300`}
      >
        <Icon className={`w-6 h-6 ${isEnd ? "text-emerald-400" : "text-[#60a5fa]"}`} />
      </div>
      <span className="text-xs text-gray-400 font-medium text-center">{label}</span>
    </motion.div>
  )
}

function FlowArrow({ active }: { active: boolean }) {
  return (
    <div className="flex items-center">
      <motion.div
        className="flex items-center gap-1"
        animate={{
          x: active ? [0, 5, 0] : 0,
          opacity: active ? [0.5, 1, 0.5] : 0.3,
        }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="w-8 h-0.5 bg-gradient-to-r from-[#3b82f6] to-transparent" />
        <div className="text-[#3b82f6]">→</div>
      </motion.div>
    </div>
  )
}

function TechFeatureCard({
  icon: Icon,
  title,
  description,
  accentColor,
  bgColor,
  borderColor,
}: {
  icon: any
  title: string
  description: string
  accentColor: string
  bgColor: string
  borderColor: string
}) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`${bgColor} ${borderColor} border rounded-2xl p-6 backdrop-blur-sm group cursor-pointer`}
    >
      <div className={`p-3 rounded-xl ${bgColor} w-fit mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${accentColor}`} />
      </div>
      <h4 className={`text-lg font-medium ${accentColor} mb-2`}>{title}</h4>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}
