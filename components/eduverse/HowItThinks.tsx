"use client"

import { Card } from "@/components/ui/card"
import { Brain, Users, BookOpen, Zap } from "lucide-react"

export default function EduVerseHowItThinks() {
  return (
    <section className="py-20 container mx-auto px-6 bg-gradient-to-b from-transparent to-[#0a0a0f]/50">
      <h2 className="text-4xl font-light mb-6 text-center tracking-tight text-[#a855f7]">How EduVerse Thinks</h2>
      <p className="text-center text-[#b8b8b8] mb-16 max-w-2xl mx-auto">
        Pedagogical intelligence that understands learning science and cognitive development
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="bg-[#1a0f22]/80 border-[#a855f7]/30 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-[#a855f7]" />
            </div>
            <div>
              <h3 className="text-xl text-[#a855f7] mb-2">Cognitive Load Management</h3>
              <p className="text-sm text-[#b8b8b8]">
                Balances information density based on learner age and topic complexity
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[#b8b8b8] ml-16">
            <li className="flex items-start gap-2">
              <span className="text-[#a855f7]">•</span>
              <span>Chunking strategy for memory retention</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#a855f7]">•</span>
              <span>Progressive complexity building</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#a855f7]">•</span>
              <span>Concept scaffolding and prerequisites</span>
            </li>
          </ul>
        </Card>

        <Card className="bg-[#1a0f22]/80 border-[#a855f7]/30 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-[#a855f7]" />
            </div>
            <div>
              <h3 className="text-xl text-[#a855f7] mb-2">Personalization Engine</h3>
              <p className="text-sm text-[#b8b8b8]">Adapts content to individual learning styles and preferences</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[#b8b8b8] ml-16">
            <li className="flex items-start gap-2">
              <span className="text-[#a855f7]">•</span>
              <span>Visual, auditory, kinesthetic adaptation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#a855f7]">•</span>
              <span>Cultural context awareness</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#a855f7]">•</span>
              <span>Interest-based examples and analogies</span>
            </li>
          </ul>
        </Card>

        <Card className="bg-[#1a0f22]/80 border-[#a855f7]/30 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-[#a855f7]" />
            </div>
            <div>
              <h3 className="text-xl text-[#a855f7] mb-2">Pedagogical Strategy</h3>
              <p className="text-sm text-[#b8b8b8]">Applies evidence-based teaching methods and learning theory</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[#b8b8b8] ml-16">
            <li className="flex items-start gap-2">
              <span className="text-[#a855f7]">•</span>
              <span>Bloom's taxonomy alignment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#a855f7]">•</span>
              <span>Spaced repetition scheduling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#a855f7]">•</span>
              <span>Metacognitive prompts</span>
            </li>
          </ul>
        </Card>

        <Card className="bg-[#1a0f22]/80 border-[#a855f7]/30 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-[#a855f7]" />
            </div>
            <div>
              <h3 className="text-xl text-[#a855f7] mb-2">Engagement Optimization</h3>
              <p className="text-sm text-[#b8b8b8]">
                Maintains attention through dynamic pacing and interactive elements
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[#b8b8b8] ml-16">
            <li className="flex items-start gap-2">
              <span className="text-[#a855f7]">•</span>
              <span>Attention span modeling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#a855f7]">•</span>
              <span>Interactive checkpoint placement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#a855f7]">•</span>
              <span>Gamification elements</span>
            </li>
          </ul>
        </Card>
      </div>
    </section>
  )
}
