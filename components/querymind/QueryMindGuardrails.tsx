"use client"

import { motion } from "framer-motion"
import { FC } from "react"

const Box = ({
  x, y, w, h, title, subtitle, stroke
}: {
  x: number; y: number; w: number; h: number
  title: string; subtitle: string; stroke: string
}) => (
  <>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={12}
      fill="rgba(255,255,255,0.04)"
      stroke={stroke}
      strokeWidth={1.4}
    />
    <text x={x + w / 2} y={y + 30} textAnchor="middle"
      fill="#e5e7eb" fontSize={14} fontWeight={600}>
      {title}
    </text>
    <text x={x + w / 2} y={y + 50} textAnchor="middle"
      fill="#9ca3af" fontSize={12}>
      {subtitle}
    </text>
  </>
)

const QueryMindDecisionSystem: FC = () => {
  return (
    <section className="flex justify-center py-28">
      <svg width="900" height="820">

        {/* Reasoning Boundary */}
        <rect
          x={220}
          y={40}
          width={360}
          height={520}
          rx={18}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={1.2}
          strokeDasharray="6 8"
        />
        <text x={400} y={30} textAnchor="middle"
          fill="#60a5fa" fontSize={11}>
          REASONING & CONTROL BOUNDARY
        </text>

        {/* Vertical Spine */}
        <line x1={400} y1={80} x2={400} y2={500}
          stroke="#1e40af" strokeDasharray="4 8" />

        {/* Boxes */}
        <Box x={260} y={80} w={280} h={70}
          title="1. Intent Capture"
          subtitle="Reasoning, not text parsing"
          stroke="#3b82f6" />

        <Box x={260} y={170} w={280} h={70}
          title="2. Semantic Grounding"
          subtitle="Schema, lineage, glossary"
          stroke="#3b82f6" />

        <Box x={260} y={260} w={280} h={70}
          title="3. Query Planning"
          subtitle="Safe before smart"
          stroke="#3b82f6" />

        {/* Execution */}
        <Box x={260} y={350} w={280} h={70}
          title="4. Controlled Execution"
          subtitle="Limits, timeouts, observability"
          stroke="#3b82f6" />

        {/* Horizontal Data Flow */}
        <motion.path
          d="M540 385 H820"
          stroke="#60a5fa"
          strokeWidth={1.6}
          fill="none"
          strokeDasharray="2 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2 }}
        />

        <text x={760} y={365} fill="#9ca3af" fontSize={11}>
          DATA SYSTEMS
        </text>

        {/* Explanation touches boundary */}
        <Box x={260} y={470} w={280} h={70}
          title="5. Explanation Layer"
          subtitle="Meaning, assumptions, exclusions"
          stroke="#22c55e" />

        {/* Learning Vault */}
        <Box x={300} y={620} w={200} h={65}
          title="6. Learning Vault"
          subtitle="Only approved corrections"
          stroke="#f59e0b" />

        {/* Controlled learning path */}
        <motion.path
          d="M400 540 C480 580 480 620 400 620"
          stroke="#f59e0b"
          strokeWidth={1.4}
          fill="none"
          strokeDasharray="3 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.5 }}
        />

      </svg>
    </section>
  )
}

export default QueryMindDecisionSystem
