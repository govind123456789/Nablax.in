"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { MessageSquare, Brain, Video } from "lucide-react"

export default function EduVerseHowItWorks() {
  return (
    <section className="py-20 container mx-auto px-6">
      <h2 className="text-4xl font-light mb-6 text-center tracking-tight text-[#a855f7]">How EduVerse Works</h2>
      <p className="text-center text-[#b8b8b8] mb-16 max-w-2xl mx-auto">
        AI-powered video generation that adapts to every learner's needs
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        <Card className="bg-[#1a0f22]/50 border-[#a855f7]/30 p-6">
          <div className="w-12 h-12 rounded-xl bg-[#a855f7]/20 flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-[#a855f7]" />
          </div>
          <h3 className="text-xl font-light mb-3 text-[#a855f7]">1. Topic Input</h3>
          <p className="text-[#b8b8b8] text-sm leading-relaxed">
            Enter any topic with learner context: age, skill level, learning style preferences, and desired video
            length.
          </p>
        </Card>

        <Card className="bg-[#1a0f22]/50 border-[#a855f7]/30 p-6">
          <div className="w-12 h-12 rounded-xl bg-[#a855f7]/20 flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-[#a855f7]" />
          </div>
          <h3 className="text-xl font-light mb-3 text-[#a855f7]">2. Content Adaptation</h3>
          <p className="text-[#b8b8b8] text-sm leading-relaxed">
            AI analyzes topic complexity, generates age-appropriate script, creates interactive checkpoints, and
            optimizes pacing.
          </p>
        </Card>

        <Card className="bg-[#1a0f22]/50 border-[#a855f7]/30 p-6">
          <div className="w-12 h-12 rounded-xl bg-[#a855f7]/20 flex items-center justify-center mb-4">
            <Video className="w-6 h-6 text-[#a855f7]" />
          </div>
          <h3 className="text-xl font-light mb-3 text-[#a855f7]">3. Video Generation</h3>
          <p className="text-[#b8b8b8] text-sm leading-relaxed">
            Produces complete educational video with voiceover, animations, quizzes, and supplementary materials.
          </p>
        </Card>
      </div>

      <div className="bg-[#1a0f22]/80 border border-[#a855f7]/30 rounded-2xl p-8 max-w-5xl mx-auto backdrop-blur-sm">
        <h3 className="text-2xl font-light text-[#a855f7] mb-8 text-center">Video Generation Pipeline</h3>
        <motion.svg
          width="100%"
          height="220"
          viewBox="0 0 800 220"
          className="max-w-full"
          initial="hidden"
          animate="visible"
        >
          {/* User Input */}
          <motion.rect
            x="20"
            y="80"
            width="130"
            height="60"
            rx="8"
            fill="#0f0a17"
            stroke="#a855f7"
            strokeWidth="2"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          />
          <motion.text x="42" y="115" fill="#a855f7" fontSize="12">
            User Input
          </motion.text>

          {/* Content Engine */}
          <motion.rect
            x="210"
            y="50"
            width="180"
            height="120"
            rx="12"
            fill="#0a0814"
            stroke="#a855f7"
            strokeWidth="2.5"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.2 }}
          />
          <motion.text x="235" y="85" fill="#a855f7" fontSize="14" fontWeight="600">
            Content Engine
          </motion.text>
          <motion.text x="235" y="105" fill="#c084fc" fontSize="10">
            Script Generator
          </motion.text>
          <motion.text x="235" y="122" fill="#c084fc" fontSize="10">
            Adaptation Layer
          </motion.text>
          <motion.text x="235" y="139" fill="#c084fc" fontSize="10">
            Quiz Builder
          </motion.text>
          <motion.text x="235" y="156" fill="#c084fc" fontSize="10">
            Pacing Optimizer
          </motion.text>

          {/* Video Renderer */}
          <motion.rect
            x="450"
            y="60"
            width="150"
            height="100"
            rx="8"
            fill="#0f0a17"
            stroke="#a855f7"
            strokeWidth="2"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.4 }}
          />
          <motion.text x="475" y="95" fill="#a855f7" fontSize="12" fontWeight="600">
            Video Renderer
          </motion.text>
          <motion.text x="475" y="115" fill="#c084fc" fontSize="9">
            Animation
          </motion.text>
          <motion.text x="475" y="130" fill="#c084fc" fontSize="9">
            Voiceover
          </motion.text>
          <motion.text x="475" y="145" fill="#c084fc" fontSize="9">
            Subtitles
          </motion.text>

          {/* Final Output */}
          <motion.rect
            x="660"
            y="80"
            width="130"
            height="60"
            rx="8"
            fill="#0f0a17"
            stroke="#22c55e"
            strokeWidth="2"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.6 }}
          />
          <motion.text x="680" y="115" fill="#22c55e" fontSize="12">
            Final Video
          </motion.text>

          {/* Flow arrows */}
          <motion.path
            d="M150 110 L210 110"
            stroke="#a855f7"
            strokeWidth="3"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.path
            d="M390 110 L450 110"
            stroke="#a855f7"
            strokeWidth="3"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.path
            d="M600 110 L660 110"
            stroke="#22c55e"
            strokeWidth="3"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 0.8, delay: 0.65 }}
          />

          {/* Pulse */}
          <motion.circle
            cx="300"
            cy="110"
            r="8"
            fill="#a855f7"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          />
        </motion.svg>
      </div>
    </section>
  )
}
