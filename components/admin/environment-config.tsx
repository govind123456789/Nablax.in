"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Database, Edit2, Plus, Trash2, TestTube, CheckCircle2 } from "lucide-react"

interface DbEnvironment {
  id: string
  name: string
  type: "postgres" | "mysql" | "snowflake"
  host: string
  port: number
  database: string
  status: "connected" | "disconnected" | "testing"
  lastSync?: string
}

export function EnvironmentConfig({ onSelectEnv }: { onSelectEnv: (envId: string) => void }) {
  const [environments, setEnvironments] = useState<DbEnvironment[]>([
    {
      id: "prod-pg",
      name: "Production Postgres",
      type: "postgres",
      host: "db.prod.internal",
      port: 5432,
      database: "analytics",
      status: "connected",
      lastSync: "2 hours ago",
    },
    {
      id: "staging-mysql",
      name: "Staging MySQL",
      type: "mysql",
      host: "staging-db.internal",
      port: 3306,
      database: "test_db",
      status: "connected",
      lastSync: "45 minutes ago",
    },
  ])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "postgres" as const,
    host: "",
    port: 5432,
    database: "",
  })

  const getTypeColor = (type: string) => {
    const colors = {
      postgres: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30",
      mysql: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30",
      snowflake: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30",
    }
    return colors[type as keyof typeof colors] || colors.postgres
  }

  const handleAddEnv = () => {
    if (formData.name && formData.host && formData.database) {
      const newEnv: DbEnvironment = {
        id: `env-${Date.now()}`,
        ...formData,
        status: "testing",
      }
      setEnvironments([...environments, newEnv])
      setFormData({ name: "", type: "postgres", host: "", port: 5432, database: "" })
      setShowAddForm(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light mb-2">Database Environments</h2>
          <p className="text-[#b8b8b8]">Configure and manage your database connections for dictionary generation</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#d4af37] text-[#0a0a0a] hover:bg-[#c4a037] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Environment
        </Button>
      </div>

      {/* Add Environment Form */}
      {showAddForm && (
        <Card className="bg-[#1a1a1a]/50 border-[#d4af37]/30 p-8 backdrop-blur-sm">
          <h3 className="text-xl font-light mb-6 text-[#d4af37]">New Database Connection</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm mb-2 text-[#b8b8b8]">Environment Name *</label>
              <Input
                placeholder="e.g., Production Postgres"
                className="bg-[#0a0a0a]/50 border-[#d4af37]/30 text-[#e8e8e8]"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#b8b8b8]">Database Type *</label>
              <select
                className="w-full bg-[#0a0a0a]/50 border border-[#d4af37]/30 rounded-lg px-4 py-2 text-[#e8e8e8] focus:border-[#d4af37] focus:outline-none"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="postgres">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="snowflake">Snowflake</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#b8b8b8]">Host/Server *</label>
              <Input
                placeholder="db.example.com"
                className="bg-[#0a0a0a]/50 border-[#d4af37]/30 text-[#e8e8e8]"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#b8b8b8]">Port</label>
              <Input
                type="number"
                placeholder="5432"
                className="bg-[#0a0a0a]/50 border-[#d4af37]/30 text-[#e8e8e8]"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: Number.parseInt(e.target.value) })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-[#b8b8b8]">Database Name *</label>
              <Input
                placeholder="analytics"
                className="bg-[#0a0a0a]/50 border-[#d4af37]/30 text-[#e8e8e8]"
                value={formData.database}
                onChange={(e) => setFormData({ ...formData, database: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleAddEnv} className="bg-[#d4af37] text-[#0a0a0a] hover:bg-[#c4a037]">
              Add Connection
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddForm(false)}
              className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Environments List */}
      <div className="grid gap-4">
        {environments.map((env) => (
          <Card
            key={env.id}
            className="bg-[#1a1a1a]/50 border-[#d4af37]/30 p-6 cursor-pointer hover:border-[#d4af37] transition-all"
            onClick={() => onSelectEnv(env.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="text-xl font-light text-[#e8e8e8]">{env.name}</h3>
                  <Badge className={`${getTypeColor(env.type)} border`}>{env.type.toUpperCase()}</Badge>
                  <Badge
                    className={
                      env.status === "connected"
                        ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
                        : "bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/30"
                    }
                  >
                    {env.status === "connected" ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Connected
                      </div>
                    ) : (
                      "Disconnected"
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-[#8a8a8a] mb-2">
                  {env.host}:{env.port} / {env.database}
                </p>
                {env.lastSync && <p className="text-xs text-[#8a8a8a]">Last sync: {env.lastSync}</p>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="hover:bg-[#d4af37]/10 hover:text-[#d4af37]">
                  <TestTube className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="hover:bg-[#d4af37]/10 hover:text-[#d4af37]">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover:bg-red-500/10 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEnvironments(environments.filter((e) => e.id !== env.id))
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
