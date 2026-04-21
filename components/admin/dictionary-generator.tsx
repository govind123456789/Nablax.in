"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Play, AlertCircle, CheckCircle2, Clock, BarChart3, SettingsIcon, Loader } from "lucide-react"

interface GenerationJob {
  id: string
  envId: string
  status: "idle" | "running" | "completed" | "failed"
  progress: number
  tablesDiscovered: number
  tablesCompleted: number
  startedAt?: string
  completedAt?: string
  errors?: string[]
}

export function DictionaryGenerator({ selectedEnv }: { selectedEnv: string | null }) {
  const [jobs, setJobs] = useState<GenerationJob[]>([
    {
      id: "job-1",
      envId: "prod-pg",
      status: "completed",
      progress: 100,
      tablesDiscovered: 24,
      tablesCompleted: 24,
      completedAt: "2 hours ago",
    },
    {
      id: "job-2",
      envId: "staging-mysql",
      status: "running",
      progress: 65,
      tablesDiscovered: 18,
      tablesCompleted: 12,
      startedAt: "15 minutes ago",
    },
  ])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [options, setOptions] = useState({
    includeMetadata: true,
    includeStats: true,
    sampleSize: 1000,
    detectPii: true,
    enableLlmEnrichment: true,
  })

  const handleStartGeneration = () => {
    if (!selectedEnv) return
    const newJob: GenerationJob = {
      id: `job-${Date.now()}`,
      envId: selectedEnv,
      status: "running",
      progress: 0,
      tablesDiscovered: 0,
      tablesCompleted: 0,
      startedAt: "Just now",
    }
    setJobs([newJob, ...jobs])
  }

  return (
    <div className="space-y-6">
      {/* Generation Control */}
      <Card className="bg-[#1a1a1a]/50 border-[#d4af37]/30 p-8 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-light mb-2">Generate Dictionary</h2>
            <p className="text-[#b8b8b8]">
              {selectedEnv
                ? "Start the automatic dictionary generation process"
                : "Select an environment first to begin generation"}
            </p>
          </div>
          <Zap className="w-6 h-6 text-[#d4af37]" />
        </div>

        {selectedEnv ? (
          <div className="space-y-6">
            {/* Options */}
            <div className="border-t border-[#d4af37]/20 pt-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-[#d4af37] hover:text-[#f4cf47] transition-colors mb-4"
              >
                <SettingsIcon className="w-4 h-4" />
                {showAdvanced ? "Hide" : "Show"} Advanced Options
              </button>

              {showAdvanced && (
                <div className="space-y-4 pl-6 border-l border-[#d4af37]/20">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeMetadata}
                      onChange={(e) => setOptions({ ...options, includeMetadata: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-[#b8b8b8]">Include table & column metadata</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeStats}
                      onChange={(e) => setOptions({ ...options, includeStats: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-[#b8b8b8]">Include data statistics (null %, distinct count)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.detectPii}
                      onChange={(e) => setOptions({ ...options, detectPii: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-[#b8b8b8]">Detect and mask PII fields</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.enableLlmEnrichment}
                      onChange={(e) => setOptions({ ...options, enableLlmEnrichment: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-[#b8b8b8]">Enable LLM-powered semantic enrichment</span>
                  </label>
                </div>
              )}
            </div>

            <Button
              onClick={handleStartGeneration}
              className="w-full bg-[#d4af37] text-[#0a0a0a] hover:bg-[#c4a037] py-6 flex items-center justify-center gap-2 text-base font-medium"
            >
              <Play className="w-5 h-5" />
              Start Generation
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-[#f97316]/10 border border-[#f97316]/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-[#f97316]" />
            <p className="text-sm text-[#f97316]">Please select an environment in the Environments tab</p>
          </div>
        )}
      </Card>

      {/* Jobs List */}
      {jobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-light">Generation Jobs</h3>
          {jobs.map((job) => (
            <Card key={job.id} className="bg-[#1a1a1a]/50 border-[#d4af37]/30 p-6 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {job.status === "running" ? (
                    <Loader className="w-5 h-5 text-[#d4af37] animate-spin" />
                  ) : job.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[#f97316]" />
                  )}
                  <div>
                    <p className="text-sm text-[#b8b8b8]">Job {job.id.slice(-4)}</p>
                    <p className="text-xs text-[#8a8a8a]">
                      {job.status === "running" ? `Started ${job.startedAt}` : `Completed ${job.completedAt}`}
                    </p>
                  </div>
                </div>
                <Badge
                  className={
                    job.status === "completed"
                      ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
                      : job.status === "running"
                        ? "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30"
                        : "bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/30"
                  }
                >
                  {job.status}
                </Badge>
              </div>

              <div className="space-y-3">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-[#b8b8b8]">Progress</span>
                    <span className="text-xs text-[#d4af37] font-medium">{job.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#0a0a0a]/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#d4af37] transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-[#b8b8b8]">
                      {job.tablesCompleted}/{job.tablesDiscovered} tables
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-[#b8b8b8]">~{Math.ceil((100 - job.progress) / 10)}m remaining</span>
                  </div>
                </div>

                {job.errors && job.errors.length > 0 && (
                  <div className="mt-3 p-3 bg-[#f97316]/10 border border-[#f97316]/20 rounded">
                    <p className="text-xs text-[#f97316]">Errors encountered:</p>
                    {job.errors.map((err, i) => (
                      <p key={i} className="text-xs text-[#f97316] opacity-80">
                        • {err}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
