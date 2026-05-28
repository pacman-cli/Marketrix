-- V1__init_schema.sql
-- Marketrix full database schema

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    full_name VARCHAR(255) NOT NULL,
    bio TEXT,
    expertise_tags TEXT[],
    avatar_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Refresh tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Startup requirements (briefs)
CREATE TABLE startup_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    founder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    stage VARCHAR(50) NOT NULL,
    geography VARCHAR(100),
    budget VARCHAR(50),
    goals JSONB DEFAULT '[]',
    problems JSONB DEFAULT '[]',
    competitors JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Audience segments
CREATE TABLE audience_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID NOT NULL REFERENCES startup_requirements(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),
    demographics JSONB DEFAULT '{}',
    psychographics JSONB DEFAULT '{}',
    behavioral_signals JSONB DEFAULT '[]',
    preferred_channels JSONB DEFAULT '[]',
    viability_score DOUBLE PRECISION DEFAULT 0.0,
    rationale TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Recommendations
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID NOT NULL REFERENCES startup_requirements(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    target_id UUID,
    score DOUBLE PRECISION DEFAULT 0.0,
    explanation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Service listings (analyst marketplace)
CREATE TABLE service_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analyst_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    tags JSONB DEFAULT '[]',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Gigs (founder job posts)
CREATE TABLE gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    founder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    budget DECIMAL(10,2),
    requirements JSONB DEFAULT '[]',
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Proposals
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    analyst_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    proposed_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analyst_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    tier VARCHAR(20) NOT NULL DEFAULT 'STANDARD',
    category VARCHAR(100),
    tags JSONB DEFAULT '[]',
    file_key VARCHAR(500),
    preview_text TEXT,
    purchase_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_REVIEW',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Report purchases
CREATE TABLE report_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    founder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID,
    purchased_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    stripe_payment_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(30) NOT NULL DEFAULT 'DIRECT',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Conversation participants
CREATE TABLE conversation_participants (
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, user_id)
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Feedback
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(30) NOT NULL,
    target_id UUID NOT NULL,
    signal_type VARCHAR(30) NOT NULL,
    rating INTEGER,
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_startup_requirements_founder ON startup_requirements(founder_id);
CREATE INDEX idx_startup_requirements_status ON startup_requirements(status);
CREATE INDEX idx_audience_segments_requirement ON audience_segments(requirement_id);
CREATE INDEX idx_recommendations_requirement ON recommendations(requirement_id);
CREATE INDEX idx_service_listings_analyst ON service_listings(analyst_id);
CREATE INDEX idx_service_listings_status ON service_listings(status);
CREATE INDEX idx_gigs_founder ON gigs(founder_id);
CREATE INDEX idx_gigs_status ON gigs(status);
CREATE INDEX idx_proposals_gig ON proposals(gig_id);
CREATE INDEX idx_reports_analyst ON reports(analyst_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_report_purchases_founder ON report_purchases(founder_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_feedback_target ON feedback(target_type, target_id);
