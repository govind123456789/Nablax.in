"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Lock, Edit2, Save, X } from "lucide-react"

interface FieldForReview {
  id: string
  tableName: string
  columnName: string
  suggestedDescription: string
  classification: string
  confidence: number
  needsReview: boolean
  isLocked: boolean
  notes: string
}

export function FieldReviewer({ selectedEnv }: { selectedEnv: string | null }) {
  const [fields, setFields] = useState<FieldForReview[]>([
    {
      id: "1",
      tableName: "transactions",
      columnName: "fraud_score",
      suggestedDescription: "ML-generated risk score for transaction fraud detection",
      classification: "metric",
      confidence: 0.73,
      needsReview: true,
      isLocked: false,
      notes: "",
    },
    {
      id: "2",
      tableName: "customers",
      columnName: "ssn_hash",
      suggestedDescription: "Hashed social security number for identity verification",
      classification: "identifier",
      confidence: 0.88,
      needsReview: true,
      isLocked: false,
      notes: "",
    },
  ])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, any>>({})

  const pendingReview = fields.filter((f) => f.needsReview)
  const approved = fields.filter((f) => !f.needsReview)

  const handleApprove = (id: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, needsReview: false, isLocked: true } : f)))
  }

  const handleStartEdit = (field: FieldForReview) => {
    setEditingId(field.id)
    setEditValues({
      description: field.suggestedDescription,
      classification: field.classification,
      notes: field.notes,
    })
  }

  const handleSaveEdit = (id: string) => {
    setFields(
      fields.map((f) =>
        f.id === id
          ? {
              ...f,
              suggestedDescription: editValues.description,
              classification: editValues.classification,
              notes: editValues.notes,
              isLocked: true,
              needsReview: false,
            }
          : f,
      ),
    )
    setEditingId(null)
  }

  return (
    <div className="space-y-8">
      {!selectedEnv ? (
        <Card className="bg-[#f97316]/10 border-[#f97316]/30 p-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#f97316]" />
          <p className="text-sm text-[#f97316]">Select an environment to review fields</p>
        </Card>
      ) : (
        <>
          {/* Pending Review */}
          {pendingReview.length > 0 && (
            <div>
              <h2 className="text-2xl font-light mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-[#f97316]" />
                Pending Review ({pendingReview.length})
              </h2>
              <div className="space-y-4">
                {pendingReview.map((field) => (
                  <Card
                    key={field.id}
                    className="bg-[#1a1a1a]/50 border-[#f97316]/30 p-6 border-l-4 border-l-[#f97316]"
                  >
                    {editingId === field.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm mb-2 text-[#b8b8b8]">Description</label>
                          <textarea
                            className="w-full bg-[#0a0a0a]/50 border border-[#d4af37]/30 rounded-lg px-4 py-2 text-[#e8e8e8] focus:border-[#d4af37] focus:outline-none resize-none"
                            rows={3}
                            value={editValues.description}
                            onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2 text-[#b8b8b8]">Classification</label>
                          <select
                            className="w-full bg-[#0a0a0a]/50 border border-[#d4af37]/30 rounded-lg px-4 py-2 text-[#e8e8e8]"
                            value={editValues.classification}
                            onChange={(e) => setEditValues({ ...editValues, classification: e.target.value })}
                          >
                            <option value="identifier">Identifier</option>
                            <option value="metric">Metric</option>
                            <option value="dimension">Dimension</option>
                            <option value="time">Time</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-2 text-[#b8b8b8]">Reviewer Notes</label>
                          <textarea
                            className="w-full bg-[#0a0a0a]/50 border border-[#d4af37]/30 rounded-lg px-4 py-2 text-[#e8e8e8] focus:border-[#d4af37] focus:outline-none resize-none"
                            rows={2}
                            value={editValues.notes}
                            onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
                            placeholder="Add any notes..."
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleSaveEdit(field.id)}
                            className="bg-[#10b981] text-white hover:bg-[#059669] flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Save & Approve
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingId(null)}
                            className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono text-[#8a8a8a] bg-[#0a0a0a]/50 px-2 py-1 rounded">
                                {field.tableName}
                              </span>
                              <h3 className="text-lg font-medium text-[#e8e8e8]">{field.columnName}</h3>
                            </div>
                            <p className="text-[#b8b8b8] mb-3">{field.suggestedDescription}</p>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/30">
                                {field.classification}
                              </Badge>
                              <span
                                className={`text-sm font-medium ${field.confidence >= 0.8 ? "text-[#10b981]" : "text-[#f97316]"}`}
                              >
                                {(field.confidence * 100).toFixed(0)}% confidence
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleApprove(field.id)}
                            className="flex-1 bg-[#10b981] text-white hover:bg-[#059669] flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleStartEdit(field)}
                            variant="outline"
                            className="flex-1 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 flex items-center justify-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit & Approve
                          </Button>
                        </div>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Approved Fields */}
          {approved.length > 0 && (
            <div>
              <h2 className="text-2xl font-light mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
                Approved ({approved.length})
              </h2>
              <div className="space-y-3">
                {approved.map((field) => (
                  <Card key={field.id} className="bg-[#1a1a1a]/50 border-[#10b981]/30 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-[#8a8a8a]">{field.tableName}</span>
                          <h3 className="text-base font-medium text-[#e8e8e8]">{field.columnName}</h3>
                          {field.isLocked && <Lock className="w-4 h-4 text-[#d4af37]" />}
                        </div>
                        <p className="text-sm text-[#b8b8b8]">{field.suggestedDescription}</p>
                      </div>
                      <Badge className="bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30">Approved</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {fields.length === 0 && (
            <Card className="bg-[#1a1a1a]/50 border-[#d4af37]/30 p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto mb-4" />
              <p className="text-lg font-light text-[#b8b8b8]">All fields have been reviewed!</p>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
