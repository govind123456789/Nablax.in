"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Search, Brain, GitBranch, FileText, Sparkles, Target } from "lucide-react"

function PhaseCard({
  icon: Icon,
  title,
  description,
  active,
  color,
}: {
  icon: any
  title: string
  description: string
  active: boolean
  color: "orange" | "amber"
}) {
  const colors = {
    orange: "border-orange-500/50 bg-orange-500/10",
    amber: "border-amber-500/50 bg-amber-500/10",
  }

  return (
    <motion.div
      animate={{
        scale: active ? 1.05 : 1,
        opacity: active ? 1 : 0.6,
      }}
      className={`relative text-center p-6 rounded-2xl border ${active ? colors[color] : "border-white/10 bg-white/5"} transition-all duration-500`}
    >
      <div className={`inline-flex p-3 rounded-xl ${active ? "bg-white/10" : "bg-white/5"} mb-3`}>
        <Icon className={`w-6 h-6 ${active ? "text-orange-400" : "text-gray-500"}`} />
      </div>
      <div className={`text-sm font-semibold mb-1 ${active ? "text-white" : "text-gray-500"}`}>{title}</div>
      <div className={`text-xs ${active ? "text-orange-400/70" : "text-gray-600"}`}>{description}</div>
    </motion.div>
  )
}

function TechStack({
  title,
  subtitle,
  methods,
  active,
}: {
  title: string
  subtitle: string
  methods: { name: string; confidence: number }[]
  active: boolean
}) {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.6 }}
      className={`bg-gradient-to-br from-orange-950/30 to-amber-950/30 rounded-2xl p-6 border ${active ? "border-orange-500/30" : "border-white/10"} transition-all duration-500`}
    >
      <h4 className="text-lg font-medium text-white mb-1">{title}</h4>
      <p className="text-sm text-orange-400/70 mb-4">{subtitle}</p>

      <div className="space-y-3">
        {methods.map((method, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white">{method.name}</span>
              <span className="text-xs text-orange-400 font-medium">{method.confidence}%</span>
            </div>
            <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: active ? `${method.confidence}%` : "0%" }}
                transition={{ duration: 1, delay: i * 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 hover:border-orange-500/40 rounded-2xl p-6 backdrop-blur-sm cursor-pointer"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h4 className="text-lg font-medium text-orange-400 mb-3">{title}</h4>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}

export default function RootSenseArchitecture() {
  const [activePhase, setActivePhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % 4)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[#0a0604] via-[#1a1008] to-[#0a0604]">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
                           linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 80px 80px, 80px 80px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6"
          >
            <Search className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-400 font-medium">Explainability Intelligence</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
            Technical{" "}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 bg-clip-text text-transparent font-medium">
              Architecture
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Model-agnostic explainability system combining SHAP, LIME, and causal inference for deep insights
          </p>
        </div>

        <div className="max-w-7xl mx-auto mb-20">
          <div className="relative bg-gradient-to-br from-[#1a1410]/90 via-[#221a0f]/90 to-[#1a1410]/90 border border-orange-500/20 rounded-3xl p-12 backdrop-blur-xl shadow-2xl">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />

            <div className="relative">
              {/* Phase flow */}
              <div className="grid grid-cols-4 gap-4 mb-12">
                <PhaseCard
                  icon={Target}
                  title="Capture"
                  description="Hook ML predictions"
                  active={activePhase === 0}
                  color="orange"
                />
                <PhaseCard
                  icon={Brain}
                  title="Analyze"
                  description="Compute explanations"
                  active={activePhase === 1}
                  color="orange"
                />
                <PhaseCard
                  icon={GitBranch}
                  title="Compare"
                  description="Find similar cases"
                  active={activePhase === 2}
                  color="orange"
                />
                <PhaseCard
                  icon={FileText}
                  title="Narrate"
                  description="Generate insights"
                  active={activePhase === 3}
                  color="amber"
                />
              </div>

              {/* Technical components */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <TechStack
                  title="Explanation Engine"
                  subtitle="Multi-method approach"
                  methods={[
                    { name: "SHAP (Shapley Values)", confidence: 95 },
                    { name: "LIME (Local Surrogate)", confidence: 88 },
                    { name: "Causal DAG Analysis", confidence: 92 },
                  ]}
                  active={activePhase === 1}
                />
                <TechStack
                  title="Similarity Search"
                  subtitle="Vector-based retrieval"
                  methods={[
                    { name: "Embedding Generation", confidence: 97 },
                    { name: "Semantic Matching", confidence: 94 },
                    { name: "Contextual Ranking", confidence: 91 },
                  ]}
                  active={activePhase === 2}
                />
              </div>

              {/* Integration layer */}
              <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
                <h4 className="text-sm text-orange-400 font-medium mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Model Integration Layer
                </h4>
                <div className="grid grid-cols-5 gap-3">
                  {["TensorFlow", "PyTorch", "scikit-learn", "XGBoost", "Custom APIs"].map((framework) => (
                    <div
                      key={framework}
                      className="bg-orange-500/10 rounded-lg p-3 text-center border border-orange-500/20"
                    >
                      <div className="text-xs text-white font-medium">{framework}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            title="Real-Time Explanation"
            description="Sub-100ms overhead for production ML systems with parallel processing"
            icon="⚡"
          />
          <FeatureCard
            title="Regulatory Compliance"
            description="GDPR Article 22, FCRA, and industry-specific audit trail generation"
            icon="📋"
          />
          <FeatureCard
            title="Counterfactual Analysis"
            description="What-if scenarios showing how inputs affect predictions with confidence scores"
            icon="🔄"
          />
        </div>
      </div>
    </section>
  )
}
