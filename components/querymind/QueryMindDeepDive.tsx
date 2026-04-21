"use client"

import { motion } from "framer-motion"
import { FC } from "react"

const HowQueryMindWorks: FC = () => {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-6">

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold text-white mb-6"
        >
          How QueryMind Works
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-lg text-gray-400 leading-relaxed mb-10"
        >
          QueryMind is a governed intelligence layer that converts natural language
          questions into decision-grade analytics — without compromising safety,
          correctness, or trust.
        </motion.p>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            Queries are first interpreted for intent and analytical meaning.
            Intent is grounded against enterprise schemas, business definitions,
            and lineage before any execution is planned.
          </p>

          <p>
            All queries are planned, validated, and risk-scored prior to execution.
            Execution is strictly controlled with read-only access, limits,
            timeouts, and full observability.
          </p>

          <p>
            Results are returned with explainable context — including assumptions
            and exclusions — and learning occurs only through approved feedback.
          </p>
        </div>

      </div>
    </section>
  )
}

export default HowQueryMindWorks
