# Data Dictionary Generator - Implementation Guide

## System Overview

The Automatic Data Dictionary Generator is a production-grade system that automatically inspects databases, profiles data, infers meaning, and generates business-friendly documentation for QueryMind.

### Architecture

```
Database Connection
       ↓
┌─────────────────────────────────────────┐
│ 1. Schema Introspection Module          │ ← Tables, columns, types
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 2. Data Profiling Module                │ ← Statistics, null%, samples
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 3. Heuristic Inference Engine           │ ← Classifications, PII, granularity
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 4. LLM Semantic Enrichment Engine       │ ← Business descriptions
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 5. Confidence & Review Engine           │ ← Confidence scores, flags
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 6. Data Dictionary Store                │ ← Persistent, versioned storage
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 7. QueryMind Integration Layer          │ ← System prompts, validation
└─────────────────┬───────────────────────┘
                  ↓
             QueryMind Engine
```

## API Endpoints

### POST /api/dictionary/introspect
Discovers database schema without data scanning.

**Request:**
```json
{
  "environment_id": "uuid",
  "connection_string": "postgres://...",
  "database_type": "postgresql"
}
```

**Response:**
```json
{
  "success": true,
  "environment_id": "uuid",
  "tables_found": 12,
  "total_columns": 145
}
```

### POST /api/dictionary/profile
Profiles table columns with statistics and masked samples.

**Request:**
```json
{
  "environment_id": "uuid",
  "table_name": "customers",
  "connection_string": "postgres://..."
}
```

### POST /api/dictionary/enrich
Runs full enrichment pipeline (inference + LLM + confidence).

**Request:**
```json
{
  "environment_id": "uuid",
  "table_name": "customers"
}
```

### GET /api/dictionary/environment?id={id}
Retrieves complete QueryMind-ready dictionary context.

## Non-Negotiable Principles

1. **Context before intelligence** - Data profiling comes before LLM enrichment
2. **Structure before language** - Schemas and types are analyzed before semantic meaning
3. **Determinism before LLMs** - Heuristics run first; LLM fills gaps
4. **Safety before convenience** - PII detection, confidence scoring, and review gates

## Failure Modes & Safeguards

| Failure Mode | Safeguard |
|---|---|
| LLM hallucination | Structured prompting, JSON validation, fallback heuristics |
| PII exposure | Field name patterns + value patterns, automatic masking |
| Low confidence fields | Multi-factor confidence scoring, human review flags |
| Missing connections | Status checks, audit logging |
| Incomplete enrichment | Fallback descriptions, explicit "needs_confirmation" flags |

## Execution Flow

1. User initiates pipeline on environment
2. Introspection scans schema (read-only, no data scans)
3. Profiling samples data and computes statistics
4. Heuristics infer classifications deterministically
5. LLM enriches with business language (with guardrails)
6. Confidence engine scores each definition
7. QueryMind integration layer validates and injects context

## Security Considerations

- All database connections are read-only
- PII values are masked before any LLM processing
- Audit log tracks every action for compliance
- Row-level security can be enabled per table
- Column-level definitions can be locked after human review
