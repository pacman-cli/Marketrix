# AI Service — Audience Intelligence Engine

The core intelligence layer of Marketrix. Transforms unstructured startup briefs into structured audience intelligence through a 6-stage async pipeline.

## Architecture

```
ai-service/
├── prompts/              # All LLM prompt templates (versioned)
├── config/               # Channel matrix, taxonomy mappings
├── docs/                 # AI architecture documentation
└── (code lives in backend/src/.../ai/)
```

## 6-Stage Pipeline

```
Stage 1: Brief Ingestion       → Validate + persist + queue job
Stage 2: Structured Extraction → LLM extracts category, stage, geo, goals, competitors
Stage 3: Feature Mapping       → Rule-based: category→taxonomy, geo→cluster, budget→tier
Stage 4: Segment Generation    → LLM generates 3-5 audience segments with psychographics
Stage 5: Recommendation Gen    → Vector search + channel matrix + positioning analysis
Stage 6: Delivery              → Mark complete + WebSocket push to founder
```

## AI Components

| Component | Type | Model/Approach |
|-----------|------|----------------|
| BriefParser | LLM | Claude claude-sonnet-4-20250514 — JSON extraction |
| SegmentGenerator | LLM | Claude claude-sonnet-4-20250514 — psychographic profiles |
| PositioningAnalyst | LLM | Claude claude-sonnet-4-20250514 — competitor gap analysis |
| ChannelRecommender | Hybrid | Rule matrix + LLM synthesis |
| EmbeddingGenerator | API | OpenAI text-embedding-3-small (1536-dim) |
| SimilaritySearch | DB | pgvector cosine similarity |
| FeedbackLearner | Batch | Nightly reputation + confidence recalculation |

## RAG Architecture

Three vector indexes in pgvector:
- `brief_embeddings` — startup brief descriptions
- `strategist_embeddings` — expert expertise summaries
- `report_embeddings` (future) — report descriptions + tags

## Scoring Formula

```
final_score = (0.5 × cosine_similarity) + (0.3 × tag_overlap) + (0.2 × reputation)
```

Diversity constraint: top-3 shown must cover ≥2 distinct specialty types.

## Feedback Learning Loop

| Signal | Effect |
|--------|--------|
| Thumbs up on segment | confidence_score +0.05 |
| Thumbs down on segment | confidence_score -0.08 |
| Report purchase | report relevance_weight increases |
| Strategist hired | strategist ranking boost for similar categories |
| Star rating (1-5) | reputation = 0.6×recent_avg + 0.4×older_avg |

## Future: Model Training

The feedback data collected enables future fine-tuning:
- Segment quality scoring model
- Channel recommendation weight optimization
- Strategist-brief matching model
