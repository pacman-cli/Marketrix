-- V3__add_strategist_profiles_and_activity_logs.sql

CREATE TABLE strategist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    years_experience INTEGER DEFAULT 0,
    expertise_tags JSONB DEFAULT '[]',
    expertise_summary TEXT,
    industries JSONB DEFAULT '[]',
    channels JSONB DEFAULT '[]',
    geographies JSONB DEFAULT '[]',
    reputation_score DOUBLE PRECISION DEFAULT 0.0,
    total_ratings INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    availability VARCHAR(20) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_strategist_profiles_user ON strategist_profiles(user_id);
CREATE INDEX idx_strategist_profiles_reputation ON strategist_profiles(reputation_score DESC);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_event ON activity_logs(event_type);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);
