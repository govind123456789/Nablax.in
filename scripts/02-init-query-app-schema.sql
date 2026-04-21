-- Query Intelligence App Tables
-- Stores user accounts, database connections, query history, and results

CREATE TABLE IF NOT EXISTS query_app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS database_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES query_app_users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  connection_type VARCHAR(50) NOT NULL, -- 'postgresql', 'mysql', 'snowflake'
  host VARCHAR(255) NOT NULL,
  port INTEGER NOT NULL,
  database_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password_encrypted TEXT NOT NULL, -- AES-256 encrypted
  is_shared BOOLEAN DEFAULT FALSE, -- TRUE for pre-configured environments
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS query_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES query_app_users(id) ON DELETE CASCADE,
  connection_id UUID REFERENCES database_connections(id) ON DELETE CASCADE,
  natural_language_question TEXT NOT NULL,
  generated_sql TEXT NOT NULL,
  sql_validation_status VARCHAR(50), -- 'valid', 'invalid', 'unsafe'
  sql_validation_message TEXT,
  execution_status VARCHAR(50), -- 'pending', 'executing', 'success', 'error', 'timeout'
  execution_error TEXT,
  execution_time_ms INTEGER,
  result_row_count INTEGER,
  result_preview JSONB, -- First 10 rows as JSON
  full_result_s3_path VARCHAR(255), -- For large result sets
  llm_insights TEXT,
  chart_type VARCHAR(50), -- 'bar', 'line', 'pie', 'scatter', null
  chart_config JSONB,
  is_saved BOOLEAN DEFAULT FALSE,
  saved_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, id) 
);

CREATE TABLE IF NOT EXISTS schema_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES database_connections(id) ON DELETE CASCADE,
  schema_json JSONB NOT NULL, -- Complete schema introspection result
  data_dictionary_json JSONB, -- Associated data dictionary
  cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  UNIQUE(connection_id)
);

-- Indexes for performance
CREATE INDEX idx_database_connections_user_id ON database_connections(user_id);
CREATE INDEX idx_query_history_user_id ON query_history(user_id);
CREATE INDEX idx_query_history_connection_id ON query_history(connection_id);
CREATE INDEX idx_query_history_created_at ON query_history(created_at DESC);
CREATE INDEX idx_schema_cache_connection_id ON schema_cache(connection_id);
