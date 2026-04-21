"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Database } from "lucide-react"

export interface ConnectionConfig {
  name: string
  type: "postgresql" | "snowflake" | "bigquery" | "redshift" | "csv" | "supabase"
  host: string
  port: string
  database: string
  username: string
  password: string
  csvData?: string
}

interface ConnectionWizardProps {
  onConnect: (connection: ConnectionConfig) => void
  onSkipDemo: () => void
}

export function ConnectionWizard({ onConnect, onSkipDemo }: ConnectionWizardProps) {
  const [step, setStep] = useState<"choice" | "form" | "csv">("choice")
  const [dbType, setDbType] = useState<"postgresql" | "snowflake" | "bigquery" | "redshift" | "csv" | "supabase">(
    "postgresql",
  )
  const [csvData, setCsvData] = useState<string>("")
  const [csvError, setCsvError] = useState<string>("")
  const [formData, setFormData] = useState<ConnectionConfig>({
    name: "",
    type: "postgresql",
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)

  const handleInputChange = (field: keyof ConnectionConfig, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Connection name is required"
    if (!formData.host.trim()) newErrors.host = "Host is required"
    if (!formData.port.trim()) newErrors.port = "Port is required"
    if (!formData.database.trim()) newErrors.database = "Database name is required"
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.password.trim()) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConnect = async () => {
    if (!validateForm()) return

    setIsValidating(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsValidating(false)

    onConnect(formData)
  }

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvError("")

    // Check file size (limit to ~1MB for 1000 rows)
    const maxSizeMB = 1
    if (file.size > maxSizeMB * 1024 * 1024) {
      setCsvError("File size exceeds 1MB limit (approximately 1000 rows)")
      return
    }

    // Check file type
    if (!file.name.endsWith(".csv")) {
      setCsvError("Please upload a CSV file")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string
        const lines = csv.split("\n").slice(0, 1001) // Limit to 1000 rows + header
        const csvContent = lines.join("\n")
        setCsvData(csvContent)

        onConnect({
          name: file.name.replace(".csv", ""),
          type: "csv",
          host: "",
          port: "",
          database: "",
          username: "",
          password: "",
          csvData: csvContent,
        })
      } catch (err) {
        setCsvError("Failed to read CSV file")
      }
    }
    reader.readAsText(file)
  }

  const defaultPorts = {
    postgresql: "5432",
    snowflake: "443",
    bigquery: "443",
    redshift: "5439",
    csv: "",
    supabase: "5432",
  }

  if (step === "choice") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md border-[#3b82f6]/30 bg-[#0f1622] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#3b82f6] text-2xl">Connect Database</CardTitle>
            <CardDescription className="text-[#b8b8b8]">
              Connect your database to start querying with QueryMind
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <button
                onClick={() => {
                  setDbType("postgresql")
                  setFormData((prev) => ({ ...prev, type: "postgresql", port: "5432" }))
                  setStep("form")
                }}
                className="w-full p-4 border-2 border-[#3b82f6]/30 hover:border-[#3b82f6] rounded-lg bg-[#0f1622]/50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#3b82f6]" />
                  <div>
                    <p className="font-semibold text-[#e8e8e8]">PostgreSQL</p>
                    <p className="text-xs text-[#b8b8b8]">Open-source relational database</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setDbType("snowflake")
                  setFormData((prev) => ({ ...prev, type: "snowflake", port: "443" }))
                  setStep("form")
                }}
                className="w-full p-4 border-2 border-[#3b82f6]/30 hover:border-[#3b82f6] rounded-lg bg-[#0f1622]/50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#3b82f6]" />
                  <div>
                    <p className="font-semibold text-[#e8e8e8]">Snowflake</p>
                    <p className="text-xs text-[#b8b8b8]">Cloud data warehouse</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setDbType("bigquery")
                  setFormData((prev) => ({ ...prev, type: "bigquery", port: "443" }))
                  setStep("form")
                }}
                className="w-full p-4 border-2 border-[#3b82f6]/30 hover:border-[#3b82f6] rounded-lg bg-[#0f1622]/50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#3b82f6]" />
                  <div>
                    <p className="font-semibold text-[#e8e8e8]">BigQuery</p>
                    <p className="text-xs text-[#b8b8b8]">Google Cloud data warehouse</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setDbType("redshift")
                  setFormData((prev) => ({ ...prev, type: "redshift", port: "5439" }))
                  setStep("form")
                }}
                className="w-full p-4 border-2 border-[#3b82f6]/30 hover:border-[#3b82f6] rounded-lg bg-[#0f1622]/50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#3b82f6]" />
                  <div>
                    <p className="font-semibold text-[#e8e8e8]">Amazon Redshift</p>
                    <p className="text-xs text-[#b8b8b8]">AWS data warehouse</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setDbType("supabase")
                  setFormData((prev) => ({ ...prev, type: "supabase", port: "5432" }))
                  setStep("form")
                }}
                className="w-full p-4 border-2 border-[#3b82f6]/30 hover:border-[#3b82f6] rounded-lg bg-[#0f1622]/50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#3b82f6]" />
                  <div>
                    <p className="font-semibold text-[#e8e8e8]">Supabase</p>
                    <p className="text-xs text-[#b8b8b8]">PostgreSQL-based backend-as-a-service</p>
                  </div>
                </div>
              </button>

              <label className="w-full p-4 border-2 border-dashed border-[#3b82f6]/30 hover:border-[#3b82f6] rounded-lg bg-[#0f1622]/50 text-left transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#3b82f6]" />
                  <div>
                    <p className="font-semibold text-[#e8e8e8]">Upload CSV File</p>
                    <p className="text-xs text-[#b8b8b8]">Up to 1000 rows (1MB)</p>
                  </div>
                </div>
                <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
              </label>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3b82f6]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0f1622] text-[#b8b8b8]">or</span>
              </div>
            </div>

            <Button
              onClick={onSkipDemo}
              variant="outline"
              className="w-full border-[#3b82f6]/30 text-[#3b82f6] hover:bg-[#3b82f6]/10 bg-transparent"
            >
              Try Demo Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "csv") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md border-[#3b82f6]/30 bg-[#0f1622] backdrop-blur-sm">
          <CardHeader>
            <Button
              variant="ghost"
              className="w-fit p-0 text-[#b8b8b8] hover:text-[#3b82f6] mb-4"
              onClick={() => setStep("choice")}
            >
              ← Back
            </Button>
            <CardTitle className="text-[#3b82f6] text-2xl">CSV Data Loaded</CardTitle>
            <CardDescription className="text-[#b8b8b8]">Ready to query your CSV data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {csvError && <p className="text-red-400 text-sm">{csvError}</p>}
            {csvData && <p className="text-green-400 text-sm">CSV loaded successfully!</p>}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-[#3b82f6]/30 bg-[#0f1622] backdrop-blur-sm">
        <CardHeader>
          <Button
            variant="ghost"
            className="w-fit p-0 text-[#b8b8b8] hover:text-[#3b82f6] mb-4"
            onClick={() => setStep("choice")}
          >
            ← Back
          </Button>
          <CardTitle className="text-[#3b82f6] text-2xl">
            {formData.type === "postgresql" && "PostgreSQL"}
            {formData.type === "snowflake" && "Snowflake"}
            {formData.type === "bigquery" && "BigQuery"}
            {formData.type === "redshift" && "Amazon Redshift"}
            {formData.type === "supabase" && "Supabase"}
            Connection
          </CardTitle>
          <CardDescription className="text-[#b8b8b8]">Enter your database connection details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Name */}
          <div>
            <label className="block text-sm font-medium text-[#e8e8e8] mb-2">Connection Name</label>
            <input
              type="text"
              placeholder="My Database"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 bg-[#1a2234] border rounded-lg text-[#e8e8e8] placeholder-[#6b7280] focus:outline-none transition-colors ${
                errors.name ? "border-red-500" : "border-[#3b82f6]/20 focus:border-[#3b82f6]"
              }`}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Host */}
          <div>
            <label className="block text-sm font-medium text-[#e8e8e8] mb-2">Host</label>
            <input
              type="text"
              placeholder="localhost"
              value={formData.host}
              onChange={(e) => handleInputChange("host", e.target.value)}
              className={`w-full px-3 py-2 bg-[#1a2234] border rounded-lg text-[#e8e8e8] placeholder-[#6b7280] focus:outline-none transition-colors ${
                errors.host ? "border-red-500" : "border-[#3b82f6]/20 focus:border-[#3b82f6]"
              }`}
            />
            {errors.host && <p className="text-red-400 text-xs mt-1">{errors.host}</p>}
          </div>

          {/* Port */}
          <div>
            <label className="block text-sm font-medium text-[#e8e8e8] mb-2">Port</label>
            <input
              type="text"
              placeholder={defaultPorts[formData.type]}
              value={formData.port}
              onChange={(e) => handleInputChange("port", e.target.value)}
              className={`w-full px-3 py-2 bg-[#1a2234] border rounded-lg text-[#e8e8e8] placeholder-[#6b7280] focus:outline-none transition-colors ${
                errors.port ? "border-red-500" : "border-[#3b82f6]/20 focus:border-[#3b82f6]"
              }`}
            />
            {errors.port && <p className="text-red-400 text-xs mt-1">{errors.port}</p>}
          </div>

          {/* Database */}
          <div>
            <label className="block text-sm font-medium text-[#e8e8e8] mb-2">Database</label>
            <input
              type="text"
              placeholder="mydb"
              value={formData.database}
              onChange={(e) => handleInputChange("database", e.target.value)}
              className={`w-full px-3 py-2 bg-[#1a2234] border rounded-lg text-[#e8e8e8] placeholder-[#6b7280] focus:outline-none transition-colors ${
                errors.database ? "border-red-500" : "border-[#3b82f6]/20 focus:border-[#3b82f6]"
              }`}
            />
            {errors.database && <p className="text-red-400 text-xs mt-1">{errors.database}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[#e8e8e8] mb-2">Username</label>
            <input
              type="text"
              placeholder="postgres"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={`w-full px-3 py-2 bg-[#1a2234] border rounded-lg text-[#e8e8e8] placeholder-[#6b7280] focus:outline-none transition-colors ${
                errors.username ? "border-red-500" : "border-[#3b82f6]/20 focus:border-[#3b82f6]"
              }`}
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#e8e8e8] mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full px-3 py-2 bg-[#1a2234] border rounded-lg text-[#e8e8e8] placeholder-[#6b7280] focus:outline-none transition-colors ${
                errors.password ? "border-red-500" : "border-[#3b82f6]/20 focus:border-[#3b82f6]"
              }`}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <Button
            onClick={handleConnect}
            disabled={isValidating}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-2"
          >
            {isValidating ? "Testing Connection..." : "Connect Database"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
