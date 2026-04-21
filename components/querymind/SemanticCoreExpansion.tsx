"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Database, ShieldCheck, Clock, GitBranch, Layers } from "lucide-react";

const SERVICES = [
  {
    id: "metrics",
    name: "Metric Registry",
    desc: "Canonical business metrics",
    icon: Layers
  },
  {
    id: "entities",
    name: "Entity Resolver",
    desc: "Customers, products, regions",
    icon: Database
  },
  {
    id: "logic",
    name: "Business Logic Engine",
    desc: "Transformations & rules",
    icon: GitBranch
  },
  {
    id: "time",
    name: "Time & Grain Resolver",
    desc: "Aggregation & temporal logic",
    icon: Clock
  },
  {
    id: "policy",
    name: "Policy Evaluator",
    desc: "RBAC & data access",
    icon: ShieldCheck
  }
];

export default function SemanticCoreDiagram() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative mt-8 p-6 rounded-xl bg-[#05080f] border border-white/10 overflow-hidden">

      {/* LEFT: INPUT */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-blue-300">
        Natural Language Intent
      </div>

      {/* RIGHT: OUTPUT */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-emerald-300">
        Governed Meaning
      </div>

      {/* FLOW GRID */}
      <div className="grid grid-cols-5 gap-6 items-center">
        {SERVICES.map((svc, i) => {
          const Icon = svc.icon;
          const isActive = active === svc.id;

          return (
            <div key={svc.id} className="relative flex flex-col items-center">

              {/* FLOW LINE */}
              {i < SERVICES.length - 1 && (
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0.3 }}
                  className="absolute top-1/2 left-full w-6 h-[2px] bg-blue-500"
                />
              )}

              {/* SERVICE NODE */}
              <motion.div
                onMouseEnter={() => setActive(svc.id)}
                onMouseLeave={() => setActive(null)}
                whileHover={{ scale: 1.06 }}
                className={`
                  cursor-pointer w-40 p-4 rounded-lg text-center
                  border backdrop-blur-xl
                  ${
                    isActive
                      ? "bg-blue-500/20 border-blue-500/60"
                      : "bg-white/5 border-white/10"
                  }
                `}
              >
                <div className="mx-auto mb-2 w-10 h-10 flex items-center justify-center rounded-md bg-blue-500/20 text-blue-400">
                  <Icon size={20} />
                </div>

                <div className="text-sm text-white font-medium">
                  {svc.name}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  {svc.desc}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
