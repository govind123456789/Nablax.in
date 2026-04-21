"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Connection {
  id: string
  name: string
  type: "postgresql" | "snowflake"
}

export default function ConnectionSelector({
  selectedConnection,
  onSelect,
}: {
  selectedConnection: string
  onSelect: (id: string) => void
}) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewConnection, setShowNewConnection] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "postgresql" as const,
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
  })

  useEffect(() => {
    loadConnections()
  }, [])

  const loadConnections = async () => {
    try {
      const response = await fetch("/api/connections/list")
      const data = await response.json()
      setConnections(data.connections || [])
    } catch (error) {
      console.error("Failed to load connections:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateConnection = async () => {
    try {
      const response = await fetch("/api/connections/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.id) {
        setConnections([...connections, data])
        setShowNewConnection(false)
        setFormData({
          name: "",
          type: "postgresql",
          host: "",
          port: "",
          database: "",
          username: "",
          password: "",
        })
      }
    } catch (error) {
      console.error("Failed to create connection:", error)
    }
  }

  if (loading) {
    return <div className="text-[#b8b8b8] text-sm">Loading connections...</div>
  }

  return (
    <div className="space-y-3">
      {connections.length === 0 ? (
        <div className="text-[#b8b8b8] text-sm">No connections yet</div>
      ) : (
        <div className="space-y-2">
          {connections.map((conn) => (
            <button
              key={conn.id}
              onClick={() => onSelect(conn.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                selectedConnection === conn.id
                  ? "bg-[#3b82f6]/20 border border-[#3b82f6] text-[#3b82f6]"
                  : "bg-[#1a2234] border border-[#3b82f6]/20 text-[#b8b8b8] hover:bg-[#1a2234]/80 hover:border-[#3b82f6]/50"
              }`}
            >
              <div className="font-medium">{conn.name}</div>
              <div className="text-xs opacity-75 capitalize">{conn.type}</div>
            </button>
          ))}
        </div>
      )}

      <Button
        onClick={() => setShowNewConnection(!showNewConnection)}
        variant="outline"
        className="w-full text-[#3b82f6] border-[#3b82f6]/30 hover:bg-[#3b82f6]/10"
      >
        {showNewConnection ? "Cancel" : "+ Add Connection"}
      </Button>

      {showNewConnection && (
        <Card className="bg-[#1a2234] border-[#3b82f6]/30 p-4 space-y-3">
          <input
            type="text"
            placeholder="Connection name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#0f1622] border border-[#3b82f6]/20 rounded px-3 py-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#3b82f6]/50"
          />

          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full bg-[#0f1622] border border-[#3b82f6]/20 rounded px-3 py-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#3b82f6]/50"
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="snowflake">Snowflake</option>
          </select>

          <input
            type="text"
            placeholder="Host"
            value={formData.host}
            onChange={(e) => setFormData({ ...formData, host: e.target.value })}
            className="w-full bg-[#0f1622] border border-[#3b82f6]/20 rounded px-3 py-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#3b82f6]/50"
          />

          <input
            type="text"
            placeholder="Port"
            value={formData.port}
            onChange={(e) => setFormData({ ...formData, port: e.target.value })}
            className="w-full bg-[#0f1622] border border-[#3b82f6]/20 rounded px-3 py-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#3b82f6]/50"
          />

          <input
            type="text"
            placeholder="Database"
            value={formData.database}
            onChange={(e) => setFormData({ ...formData, database: e.target.value })}
            className="w-full bg-[#0f1622] border border-[#3b82f6]/20 rounded px-3 py-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#3b82f6]/50"
          />

          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full bg-[#0f1622] border border-[#3b82f6]/20 rounded px-3 py-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#3b82f6]/50"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full bg-[#0f1622] border border-[#3b82f6]/20 rounded px-3 py-2 text-[#e8e8e8] text-sm focus:outline-none focus:border-[#3b82f6]/50"
          />

          <Button
            onClick={handleCreateConnection}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-semibold"
          >
            Create Connection
          </Button>
        </Card>
      )}
    </div>
  )
}
