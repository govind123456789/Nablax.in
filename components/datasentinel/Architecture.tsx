"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Shield, Activity, Bell, Lock, Database, Gauge } from "lucide-react"

export default function DataSentinelArchitecture() {
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[#020b08] via-[#041510] to-[#020b08]">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
                           linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 80px 80px, 80px 80px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Real-Time Data Protection</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
            Technical{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 bg-clip-text text-transparent font-medium">
              Architecture
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Distributed monitoring system with ML-powered anomaly detection and automated quality assurance
          </p>
        </div>

        <div className="max-w-7xl mx-auto mb-20">
          <div className="relative bg-gradient-to-br from-[#04120d]/90 via-[#051510]/90 to-[#04120d]/90 border border-emerald-500/20 rounded-3xl p-12 backdrop-blur-xl shadow-2xl">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />

            <div className="relative">
              {/* Stage indicators */}
              <div className="flex justify-between mb-12">
                {["Ingestion", "Analysis", "Response"].map((stage, i) => (
                  <motion.div
                    key={stage}
                    className="flex-1 text-center"
                    animate={{ opacity: activeStage === i ? 1 : 0.4 }}
                  >
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${activeStage === i ? "bg-emerald-500/20 border-2 border-emerald-500/50" : "bg-white/5 border border-white/10"}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${activeStage === i ? "bg-emerald-400" : "bg-gray-500"}`} />
                      <span
                        className={`text-sm font-medium ${activeStage === i ? "text-emerald-400" : "text-gray-500"}`}
                      >
                        {stage}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Architecture layers */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Ingestion Stage */}
                <SentinelLayer
                  icon={Database}
                  title="Data Ingestion"
                  subtitle="Multi-Source Collection"
                  active={activeStage === 0}
                  components={[
                    { name: "Stream Processor", detail: "Kafka, Kinesis" },
                    { name: "Schema Detector", detail: "Auto-discovery" },
                    { name: "Batch Handler", detail: "S3, GCS" },
                  ]}
                  delay={0}
                />

                {/* Analysis Stage */}
                <SentinelLayer
                  icon={Activity}
                  title="Real-Time Analysis"
                  subtitle="ML-Powered Detection"
                  active={activeStage === 1}
                  components={[
                    { name: "Anomaly Detection", detail: "Isolation Forest" },
                    { name: "Trust Scoring", detail: "Bayesian Models" },
                    { name: "Pattern Learning", detail: "Time-series AI" },
                  ]}
                  delay={0.1}
                />

                {/* Response Stage */}
                <SentinelLayer
                  icon={Bell}
                  title="Intelligent Response"
                  subtitle="Automated Actions"
                  active={activeStage === 2}
                  components={[
                    { name: "Smart Alerts", detail: "Priority routing" },
                    { name: "Auto-Remediation", detail: "Policy-driven" },
                    { name: "Incident Tracking", detail: "Full lineage" },
                  ]}
                  delay={0.2}
                />
              </div>

              {/* Performance metrics */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                <MetricCard icon={Gauge} label="Processing Rate" value="1M+ rows/sec" />
                <MetricCard icon={Lock} label="Detection Latency" value="<50ms" />
                <MetricCard icon={Shield} label="Accuracy" value="99.7%" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <CapabilityCard
            title="Distributed Architecture"
            description="Horizontally scalable with automatic sharding and load balancing across clusters"
            color="emerald"
          />
          <CapabilityCard
            title="ML Model Ensemble"
            description="Multiple specialized models for different anomaly types with continuous learning"
            color="teal"
          />
          <CapabilityCard
            title="Zero-Config Integration"
            description="Auto-discovery of schemas and relationships with intelligent baseline generation"
            color="emerald"
          />
        </div>
      </div>
    </section>
  )
}

function SentinelLayer({
  icon: Icon,
  title,
  subtitle,
  active,
  components,
  delay,
}: {
  icon: any
  title: string
  subtitle: string
  active: boolean
  components: { name: string; detail: string }[]
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: active ? 1 : 0.5,
        scale: active ? 1 : 0.95,
      }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      {active && (
        <motion.div
          className="absolute inset-0 rounded-2xl blur-2xl bg-emerald-500/20"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      <div
        className={`relative bg-gradient-to-br from-emerald-950/50 to-teal-950/50 rounded-2xl p-8 border ${active ? "border-emerald-500/40" : "border-white/10"} transition-all duration-500 h-full`}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="p-4 rounded-xl bg-emerald-500/10 backdrop-blur-sm">
            <Icon className="w-8 h-8 text-emerald-400" />
          </div>
          {active && (
            <motion.div className="flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-4 bg-emerald-400 rounded-full"
                  animate={{ scaleY: [1, 1.5, 1] }}
                  transition={{ duration: 1, delay: i * 0.2, repeat: Number.POSITIVE_INFINITY }}
                />
              ))}
            </motion.div>
          )}
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-emerald-400/70 mb-6">{subtitle}</p>

        <div className="space-y-3">
          {components.map((comp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: active ? 1 : 0.7, x: 0 }}
              transition={{ delay: delay + i * 0.1 }}
              className="bg-black/20 rounded-lg p-3 border border-white/5"
            >
              <div className="text-sm text-white font-medium">{comp.name}</div>
              <div className="text-xs text-gray-500 mt-1">{comp.detail}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function MetricCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
      <Icon className="w-5 h-5 text-emerald-400" />
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-lg font-semibold text-white">{value}</div>
      </div>
    </div>
  )
}

function CapabilityCard({
  title,
  description,
  color,
}: { title: string; description: string; color: "emerald" | "teal" }) {
  const colors = {
    emerald: "from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 hover:border-emerald-500/40",
    teal: "from-teal-500/10 to-teal-600/10 border-teal-500/20 hover:border-teal-500/40",
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-6 backdrop-blur-sm cursor-pointer`}
    >
      <h4 className="text-lg font-medium text-emerald-400 mb-3">{title}</h4>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}
