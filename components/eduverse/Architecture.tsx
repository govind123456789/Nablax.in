"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Video, Mic, Palette, Sparkles, Globe, GraduationCap } from "lucide-react"

function PipelineLayer({
  title,
  subtitle,
  components,
  active,
  color,
}: {
  title: string
  subtitle: string
  components: string[]
  active: boolean
  color: "purple"
}) {
  return (
    <motion.div
      animate={{
        opacity: active ? 1 : 0.5,
        scale: active ? 1 : 0.98,
      }}
      className={`bg-gradient-to-br from-purple-950/30 to-fuchsia-950/30 rounded-2xl p-6 border ${active ? "border-purple-500/40" : "border-white/10"} transition-all duration-500`}
    >
      <h4 className="text-lg font-medium text-white mb-1">{title}</h4>
      <p className="text-sm text-purple-400/70 mb-4">{subtitle}</p>

      <ul className="space-y-2">
        {components.map((comp, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: active ? 1 : 0.7, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-sm text-white/80 flex items-start gap-2"
          >
            <span className="text-purple-400 mt-1">•</span>
            <span>{comp}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-purple-400 mb-1">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

function AdvancedFeature({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-6 backdrop-blur-sm cursor-pointer"
    >
      <h4 className="text-lg font-medium text-purple-400 mb-3">{title}</h4>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}

export default function EduVerseArchitecture() {
  const [pipeline, setPipeline] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPipeline((prev) => (prev + 1) % 5)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[#0a0414] via-[#130a1f] to-[#0a0414]">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                           linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 80px 80px, 80px 80px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
          >
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Multi-Modal Learning AI</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
            Technical{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 bg-clip-text text-transparent font-medium">
              Architecture
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            AI video generation pipeline combining NLP, computer vision, and neural voice synthesis
          </p>
        </div>

        <div className="max-w-7xl mx-auto mb-20">
          <div className="relative bg-gradient-to-br from-[#0f0a17]/90 via-[#1a0f2a]/90 to-[#0f0a17]/90 border border-purple-500/20 rounded-3xl p-12 backdrop-blur-xl shadow-2xl">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl" />

            <div className="relative">
              {/* Pipeline stages */}
              <div className="flex items-center justify-between mb-12">
                {[
                  { icon: Sparkles, label: "Input" },
                  { icon: Palette, label: "Visuals" },
                  { icon: Mic, label: "Audio" },
                  { icon: Video, label: "Render" },
                  { icon: Globe, label: "Deliver" },
                ].map((stage, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <motion.div
                      animate={{
                        scale: pipeline === i ? 1.2 : 1,
                        opacity: pipeline === i ? 1 : 0.4,
                      }}
                      className={`p-4 rounded-2xl ${pipeline === i ? "bg-purple-500/20 border-2 border-purple-500/50" : "bg-white/5 border border-white/10"} transition-all`}
                    >
                      <stage.icon className={`w-6 h-6 ${pipeline === i ? "text-purple-400" : "text-gray-500"}`} />
                    </motion.div>
                    <span className={`text-xs font-medium ${pipeline === i ? "text-purple-400" : "text-gray-500"}`}>
                      {stage.label}
                    </span>
                    {i < 4 && (
                      <motion.div
                        className="absolute"
                        style={{ left: `${(i + 0.5) * 20}%`, top: "32px" }}
                        animate={{ opacity: pipeline > i ? 1 : 0.2 }}
                      >
                        <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-transparent" />
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Technical layers */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <PipelineLayer
                  title="Content Engine"
                  subtitle="Script & Pedagogy"
                  components={["GPT-4 Script Generation", "Learning Path Optimizer", "Difficulty Adaptation"]}
                  active={pipeline === 0 || pipeline === 1}
                  color="purple"
                />
                <PipelineLayer
                  title="Visual Generation"
                  subtitle="Animation & Graphics"
                  components={["Stable Diffusion Assets", "Motion Graphics Engine", "3D Scene Compositor"]}
                  active={pipeline === 1 || pipeline === 2}
                  color="purple"
                />
                <PipelineLayer
                  title="Audio Synthesis"
                  subtitle="Voice & Music"
                  components={["Neural TTS (40+ voices)", "Prosody Control", "Background Scoring"]}
                  active={pipeline === 2 || pipeline === 3}
                  color="purple"
                />
              </div>

              {/* Performance metrics */}
              <div className="grid grid-cols-4 gap-4 bg-black/20 rounded-2xl p-6 border border-white/10">
                <StatCard label="Generation Time" value="<5 min" />
                <StatCard label="Languages" value="40+" />
                <StatCard label="Video Quality" value="4K HDR" />
                <StatCard label="Personalization" value="∞ variants" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <AdvancedFeature
            title="Adaptive Learning"
            description="Real-time adjustment of pacing, complexity, and examples based on learner interaction"
          />
          <AdvancedFeature
            title="Accessibility Built-In"
            description="Auto-generated captions, audio descriptions, sign language, and dyslexia-friendly fonts"
          />
          <AdvancedFeature
            title="Enterprise Scale"
            description="Distributed rendering across GPU clusters for thousands of concurrent video generations"
          />
        </div>
      </div>
    </section>
  )
}
