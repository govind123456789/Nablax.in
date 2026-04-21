-- Data Dictionary Storage Schema
-- Production-grade, versioned, auditable

CREATE TABLE IF NOT EXISTS data_dictionary_environments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  database_type VARCHAR(50) NOT NULL, -- 'postgresql', 'mysql', 'snowflake'
  connection_status VARCHAR(50) DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error'
  last_introspection_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_env_name UNIQUE(name)
);

CREATE TABLE IF NOT EXISTS data_dictionary_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  environment_id UUID NOT NULL REFERENCES data_dictionary_environments(id) ON DELETE CASCADE,
  table_name VARCHAR(255) NOT NULL,
  table_description TEXT,
  row_granularity VARCHAR(255),
  version INTEGER DEFAULT 1,
  ingestion_timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_table_per_env UNIQUE(environment_id, table_name)
);

CREATE TABLE IF NOT EXISTS data_dictionary_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES data_dictionary_tables(id) ON DELETE CASCADE,
  environment_id UUID NOT NULL REFERENCES data_dictionary_environments(id) ON DELETE CASCADE,
  column_name VARCHAR(255) NOT NULL,
  data_type VARCHAR(100) NOT NULL,
  nullable BOOLEAN DEFAULT TRUE,
  business_description TEXT,
  classification VARCHAR(50), -- 'identifier', 'metric', 'dimension', 'time', 'unknown'
  is_pii BOOLEAN DEFAULT FALSE,
  confidence_score FLOAT DEFAULT 0.5,
  needs_human_review BOOLEAN DEFAULT FALSE,
  locked BOOLEAN DEFAULT FALSE,
  sample_values JSONB, -- Array of sample non-PII values
  profile_null_pct FLOAT,
  profile_distinct_count INTEGER,
  profile_min VARCHAR(255),
  profile_max VARCHAR(255),
  inferred_meaning TEXT,
  human_override TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_column_per_table UNIQUE(table_id, column_name)
);

CREATE TABLE IF NOT EXISTS data_dictionary_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  environment_id UUID NOT NULL REFERENCES data_dictionary_environments(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL, -- 'introspect', 'profile', 'enrich', 'review', 'override'
  table_name VARCHAR(255),
  column_name VARCHAR(255),
  changes JSONB, -- Track what changed
  user_id VARCHAR(255),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for query performance
CREATE INDEX idx_dict_env_id ON data_dictionary_tables(environment_id);
CREATE INDEX idx_dict_table_id ON data_dictionary_columns(table_id);
CREATE INDEX idx_dict_env_col ON data_dictionary_columns(environment_id);
CREATE INDEX idx_dict_audit_env ON data_dictionary_audit_log(environment_id);
CREATE INDEX idx_dict_audit_action ON data_dictionary_audit_log(action);
CREATE INDEX idx_dict_updated ON data_dictionary_tables(updated_at);
CREATE INDEX idx_dict_col_updated ON data_dictionary_columns(updated_at);

-- Grant appropriate permissions (adjust roles as needed)
-- ALTER TABLE data_dictionary_environments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE data_dictionary_tables ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE data_dictionary_columns ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE data_dictionary_audit_log ENABLE ROW LEVEL SECURITY;
