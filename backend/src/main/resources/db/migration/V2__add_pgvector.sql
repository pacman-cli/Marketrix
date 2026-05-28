-- V2__add_pgvector.sql
-- Enable pgvector extension and create embedding tables

CREATE EXTENSION IF NOT EXISTS vector;

-- Brief embeddings (for semantic matching)
CREATE TABLE brief_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID NOT NULL UNIQUE REFERENCES startup_requirements(id) ON DELETE CASCADE,
    embedding vector(1536) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Strategist embeddings (for expert matching)
CREATE TABLE strategist_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    embedding vector(1536) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- HNSW indexes for fast approximate nearest neighbor search
CREATE INDEX idx_brief_embeddings_vector ON brief_embeddings USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_strategist_embeddings_vector ON strategist_embeddings USING hnsw (embedding vector_cosine_ops);
