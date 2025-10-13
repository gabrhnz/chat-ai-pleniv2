-- ============================================
-- Migration: Initial Schema for FAQ Bot
-- Description: Creates base tables for FAQs, documents, chunks, sessions, and analytics
-- Author: AI Assistant
-- Date: 2025-10-12
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- Table: faqs
-- Description: Stores FAQ pairs with embeddings for semantic search
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  keywords TEXT[], -- For full-text search fallback
  metadata JSONB DEFAULT '{}', -- Tags, source, last_updated, etc.
  embedding vector(384), -- sentence-transformers/all-MiniLM-L6-v2 dimensions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0
);

-- Indexes for faqs
CREATE INDEX IF NOT EXISTS faqs_category_idx ON faqs(category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS faqs_active_idx ON faqs(is_active);
CREATE INDEX IF NOT EXISTS faqs_created_at_idx ON faqs(created_at DESC);

-- Full-text search indexes (fallback)
CREATE INDEX IF NOT EXISTS faqs_question_fts_idx 
  ON faqs USING GIN (to_tsvector('spanish', question));
CREATE INDEX IF NOT EXISTS faqs_answer_fts_idx 
  ON faqs USING GIN (to_tsvector('spanish', answer));
CREATE INDEX IF NOT EXISTS faqs_keywords_idx 
  ON faqs USING GIN (keywords);

-- Vector similarity index (ivfflat)
-- Note: This will be created after we have some data (100+ rows recommended)
-- CREATE INDEX faqs_embedding_idx ON faqs 
--   USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- Table: documents
-- Description: Stores source documents (PDFs, reglamentos, guías)
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  document_type VARCHAR(50), -- pdf, docx, txt, md
  category VARCHAR(100),
  file_size_bytes INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS documents_category_idx ON documents(category);
CREATE INDEX IF NOT EXISTS documents_active_idx ON documents(is_active);

-- ============================================
-- Table: document_chunks
-- Description: Stores chunked text from documents with embeddings
-- ============================================
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  token_count INTEGER,
  embedding vector(384),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chunks_document_id_idx ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS chunks_document_index_idx ON document_chunks(document_id, chunk_index);

-- Vector similarity index for chunks
-- CREATE INDEX document_chunks_embedding_idx ON document_chunks 
--   USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- Table: chat_sessions
-- Description: Stores conversation history for context
-- ============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255),
  session_data JSONB DEFAULT '[]', -- Array of messages
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_last_interaction_idx ON chat_sessions(last_interaction DESC);

-- ============================================
-- Table: analytics
-- Description: Tracks queries, matches, and performance metrics
-- ============================================
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(50) NOT NULL, -- query, answer, fallback, admin_action
  user_id VARCHAR(255),
  query TEXT,
  matched_faqs UUID[],
  similarity_scores FLOAT[],
  response_time_ms INTEGER,
  tokens_used INTEGER,
  model_used VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_event_type_idx ON analytics(event_type);
CREATE INDEX IF NOT EXISTS analytics_created_at_idx ON analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_user_id_idx ON analytics(user_id);

-- ============================================
-- Function: update_updated_at_column
-- Description: Trigger function to auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Function: match_faqs
-- Description: Semantic search function for FAQs using cosine similarity
-- ============================================
CREATE OR REPLACE FUNCTION match_faqs(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  question text,
  answer text,
  category varchar(100),
  keywords text[],
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    faqs.id,
    faqs.question,
    faqs.answer,
    faqs.category,
    faqs.keywords,
    faqs.metadata,
    1 - (faqs.embedding <=> query_embedding) as similarity
  FROM faqs
  WHERE faqs.is_active = true
    AND faqs.embedding IS NOT NULL
    AND 1 - (faqs.embedding <=> query_embedding) > match_threshold
  ORDER BY faqs.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================
-- Function: match_document_chunks
-- Description: Semantic search for document chunks
-- ============================================
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  chunk_text text,
  chunk_index integer,
  document_title text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.chunk_text,
    dc.chunk_index,
    d.title as document_title,
    1 - (dc.embedding <=> query_embedding) as similarity
  FROM document_chunks dc
  JOIN documents d ON dc.document_id = d.id
  WHERE d.is_active = true
    AND dc.embedding IS NOT NULL
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================
-- Function: hybrid_search (vector + full-text)
-- Description: Combines semantic and keyword search for better results
-- ============================================
CREATE OR REPLACE FUNCTION hybrid_search(
  query_text text,
  query_embedding vector(384),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  question text,
  answer text,
  category varchar(100),
  similarity float,
  rank float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH vector_search AS (
    SELECT
      faqs.id,
      faqs.question,
      faqs.answer,
      faqs.category,
      1 - (faqs.embedding <=> query_embedding) as similarity
    FROM faqs
    WHERE faqs.is_active = true
      AND faqs.embedding IS NOT NULL
    ORDER BY faqs.embedding <=> query_embedding
    LIMIT match_count * 2
  ),
  keyword_search AS (
    SELECT
      faqs.id,
      ts_rank(to_tsvector('spanish', faqs.question || ' ' || faqs.answer), plainto_tsquery('spanish', query_text)) as text_rank
    FROM faqs
    WHERE faqs.is_active = true
      AND (
        to_tsvector('spanish', faqs.question || ' ' || faqs.answer) @@ plainto_tsquery('spanish', query_text)
        OR faqs.keywords && string_to_array(lower(query_text), ' ')
      )
  )
  SELECT
    vs.id,
    vs.question,
    vs.answer,
    vs.category,
    vs.similarity,
    COALESCE(vs.similarity * 0.7 + ks.text_rank * 0.3, vs.similarity) as rank
  FROM vector_search vs
  LEFT JOIN keyword_search ks ON vs.id = ks.id
  WHERE vs.similarity > match_threshold
  ORDER BY rank DESC
  LIMIT match_count;
END;
$$;

-- ============================================
-- Row Level Security (RLS) Policies
-- Description: Basic RLS for public read, authenticated write
-- ============================================

-- Enable RLS on tables
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Public can read active FAQs
CREATE POLICY "FAQs are publicly readable"
  ON faqs FOR SELECT
  USING (is_active = true);

-- Authenticated users can insert FAQs (for admin panel)
CREATE POLICY "Authenticated users can insert FAQs"
  ON faqs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update FAQs
CREATE POLICY "Authenticated users can update FAQs"
  ON faqs FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Similar policies for other tables
CREATE POLICY "Documents are publicly readable"
  ON documents FOR SELECT
  USING (is_active = true);

CREATE POLICY "Chunks are publicly readable"
  ON document_chunks FOR SELECT
  USING (true);

-- Sessions are user-specific
CREATE POLICY "Users can read own sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

-- Analytics can be inserted by anyone
CREATE POLICY "Analytics are insertable"
  ON analytics FOR INSERT
  WITH CHECK (true);

-- ============================================
-- Comments for documentation
-- ============================================
COMMENT ON TABLE faqs IS 'Stores frequently asked questions with vector embeddings for semantic search';
COMMENT ON TABLE documents IS 'Source documents like PDFs, regulations, manuals';
COMMENT ON TABLE document_chunks IS 'Chunked text from documents for RAG';
COMMENT ON TABLE chat_sessions IS 'Conversation history for context-aware responses';
COMMENT ON TABLE analytics IS 'Query analytics and performance metrics';

COMMENT ON FUNCTION match_faqs IS 'Semantic search for FAQs using cosine similarity';
COMMENT ON FUNCTION match_document_chunks IS 'Semantic search for document chunks';
COMMENT ON FUNCTION hybrid_search IS 'Combines vector and full-text search for better recall';

-- ============================================
-- Initial Setup Complete
-- ============================================
-- Next steps:
-- 1. Run this migration: psql -d your_db < 001_initial_schema.sql
-- 2. Insert sample FAQs (see seed/sample_faqs.sql)
-- 3. Generate embeddings for FAQs
-- 4. Create vector indexes after 100+ rows

