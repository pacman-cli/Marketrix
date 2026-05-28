# Marketrix — Implementation Plan

**Spec:** `docs/specs/2026-05-27-monolithic-architecture-design.md`  
**Date:** 2026-05-28  
**Approach:** Phased, bottom-up — foundation first, then services in dependency order

---

## Phase 1: Project Foundation & Configuration

### 1.1 Restructure Maven project
- Rename base package from `com.example.backend` to `com.example.marketrix`
- Rename `BackendApplication` to `MarketrixApplication`
- Remove the hello world endpoint
- Update `pom.xml` artifact to `marketrix`

### 1.2 Add all Maven dependencies
Add to `pom.xml`:
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-security`
- `spring-boot-starter-validation`
- `spring-boot-starter-websocket`
- `spring-boot-starter-actuator`
- `spring-boot-starter-cache`
- `flyway-core` + `flyway-database-postgresql`
- `postgresql`
- `com.pgvector:pgvector:0.1.6`
- `io.jsonwebtoken:jjwt-api:0.12.6`, `jjwt-impl`, `jjwt-jackson`
- `org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0`
- `spring-retry` + `spring-boot-starter-aop`
- `com.github.ben-manes.caffeine:caffeine`
- `software.amazon.awssdk:s3`
- `com.stripe:stripe-java:26.1.0`
- Keep `lombok`

### 1.3 Configuration files
- Replace `application.properties` with `application.yml` (server port, app name)
- Create `application-dev.yml` (local PostgreSQL, debug logging, permissive CORS)
- Create `application-prod.yml` (placeholder production config)

### 1.4 Common infrastructure package
Create `com.example.marketrix.common`:
- `BaseEntity` — mapped superclass with `id` (UUID, auto-generated), `createdAt`, `updatedAt`
- `ApiResponse<T>` — standard response wrapper `{success, data, message, timestamp}`
- `PagedResponse<T>` — paginated wrapper `{content, page, size, totalElements, totalPages}`
- `exception/` — `ResourceNotFoundException`, `BadRequestException`, `UnauthorizedException`
- `GlobalExceptionHandler` (`@RestControllerAdvice`) — maps exceptions to `{status, message, errors[], timestamp}`

### 1.5 Config classes
Create `com.example.marketrix.config`:
- `AsyncConfig` — `@EnableAsync`, `ThreadPoolTaskExecutor` (core=4, max=8, queue=100)
- `CacheConfig` — `@EnableCaching`, Caffeine cache manager
- `CorsConfig` — `WebMvcConfigurer` with allowed origins from config
- `OpenApiConfig` — SpringDoc info (title, version, description)

**Verification:** Application starts with `./mvnw spring-boot:run` (will fail on DB connection — expected until Phase 2).

---

## Phase 2: Database & Migrations

### 2.1 Flyway setup
- Create `src/main/resources/db/migration/` directory
- Configure Flyway in `application.yml` (baseline-on-migrate: true)

### 2.2 V1__init_schema.sql
Create all tables:
- `users` (UUID PK, email unique, password_hash, role, status, full_name, bio, expertise_tags text[], avatar_url, created_at, updated_at)
- `refresh_tokens` (id, user_id FK, token unique, expires_at)
- `startup_requirements` (id, founder_id FK, name, industry, stage, geography, budget, goals jsonb, problems jsonb, competitors jsonb, metadata jsonb, status, created_at)
- `audience_segments` (id, requirement_id FK, name, tagline, demographics jsonb, psychographics jsonb, behavioral_signals jsonb, preferred_channels jsonb, viability_score float, rationale text)
- `recommendations` (id, requirement_id FK, type, target_id UUID, score float, explanation text, created_at)
- `service_listings` (id, analyst_id FK, title, description, price decimal, category, tags jsonb, status, created_at)
- `gigs` (id, founder_id FK, title, description, budget decimal, requirements jsonb, status, created_at)
- `proposals` (id, gig_id FK, analyst_id FK, cover_letter, proposed_price decimal, status, created_at)
- `reports` (id, analyst_id FK, title, description, price decimal, tier, category, tags jsonb, file_key, preview_text, purchase_count int default 0, status, created_at)
- `report_purchases` (id, report_id FK, founder_id FK, transaction_id UUID, purchased_at)
- `transactions` (id, user_id FK, type, amount decimal, currency, stripe_payment_id, status, created_at)
- `conversations` (id, type, created_at)
- `conversation_participants` (conversation_id FK, user_id FK, PK composite)
- `messages` (id, conversation_id FK, sender_id FK, content text, read_at timestamp, created_at)
- `feedback` (id, user_id FK, target_type, target_id UUID, signal_type, rating int, comment text, created_at)

### 2.3 V2__add_pgvector.sql
- `CREATE EXTENSION IF NOT EXISTS vector;`
- `brief_embeddings` (id, requirement_id FK unique, embedding vector(1536))
- `strategist_embeddings` (id, user_id FK unique, embedding vector(1536))
- Create HNSW index on both embedding columns

**Verification:** `./mvnw spring-boot:run` with local PostgreSQL — Flyway runs migrations, tables created.

---

## Phase 3: Security & Auth Service

### 3.1 Security infrastructure
Create `com.example.marketrix.security`:
- `JwtTokenProvider` — generate access/refresh tokens, validate, extract claims
- `JwtAuthenticationFilter extends OncePerRequestFilter` — extract token from header, set SecurityContext
- `SecurityConfig` — SecurityFilterChain: permit `/api/auth/**`, `/swagger-ui/**`, `/actuator/health`; authenticate everything else
- `UserDetailsServiceImpl implements UserDetailsService` — load user by email from DB

### 3.2 Auth service implementation
Create `com.example.marketrix.auth`:
- `entity/User.java` — JPA entity with all columns
- `entity/RefreshToken.java` — JPA entity
- `enums/Role.java`, `enums/UserStatus.java`
- `repository/UserRepository.java` — findByEmail, existsByEmail
- `repository/RefreshTokenRepository.java` — findByToken, deleteByUserId
- `dto/RegisterRequest.java` — @Valid annotations
- `dto/LoginRequest.java`
- `dto/AuthResponse.java`
- `dto/UserDto.java` — safe user representation (no password)
- `service/AuthService.java` — register, login, refresh, logout logic
- `controller/AuthController.java` — 4 endpoints

**Verification:** Test register → login → access protected endpoint → refresh token flow via curl/Swagger.

---

## Phase 4: Startup Intake Service

### 4.1 Implementation
Create `com.example.marketrix.intake`:
- `entity/StartupRequirement.java` — JPA entity, JSONB columns mapped with `@JdbcTypeCode(SqlTypes.JSON)`
- `enums/BriefStatus.java`
- `repository/StartupRequirementRepository.java` — findByFounderId
- `dto/BriefSubmitRequest.java` — validated fields
- `dto/BriefResponse.java`
- `event/BriefSubmittedEvent.java` — contains requirementId
- `service/IntakeService.java` — validate, save, publish event
- `controller/IntakeController.java` — 3 endpoints

**Verification:** POST a brief → verify persisted in DB with status SUBMITTED, event published (log it).

---

## Phase 5: AI Orchestrator Service

### 5.1 LLM clients
Create `com.example.marketrix.ai`:
- `client/ClaudeApiClient.java` — RestClient POST to Anthropic Messages API; handles request/response mapping
- `client/OpenAiEmbeddingClient.java` — RestClient POST to OpenAI embeddings endpoint
- `client/dto/ClaudeRequest.java`, `ClaudeResponse.java` — API DTOs
- `client/dto/EmbeddingRequest.java`, `EmbeddingResponse.java`

### 5.2 Prompt templates
Create `src/main/resources/prompts/`:
- `brief-extraction.txt` — system prompt for structured extraction (outputs JSON schema)
- `segment-generation.txt` — system prompt for audience segmentation
- `positioning-analysis.txt` — system prompt for competitive positioning

### 5.3 Pipeline services
- `service/BriefParserService.java` — calls Claude, parses JSON response, validates schema
- `service/SegmentGeneratorService.java` — calls Claude with extracted features, produces segments
- `service/EmbeddingService.java` — calls OpenAI, stores vector in `brief_embeddings`
- `service/PositioningService.java` — optional competitive analysis via Claude

### 5.4 Orchestrator
- `service/AiOrchestratorService.java` — `@EventListener` on `BriefSubmittedEvent`, `@Async`
  - Fetch requirement → parse → map features → generate segments → embed → publish `SegmentsGeneratedEvent`
  - Update status to PROCESSING at start, COMPLETE at end, FAILED on error
- `entity/AudienceSegment.java` — JPA entity
- `entity/BriefEmbedding.java` — JPA entity with pgvector column
- `repository/AudienceSegmentRepository.java`
- `repository/BriefEmbeddingRepository.java`
- `event/SegmentsGeneratedEvent.java`

**Verification:** Submit brief → observe async processing in logs → segments appear in DB → status = COMPLETE.

---

## Phase 6: Recommendation Service

### 6.1 Implementation
Create `com.example.marketrix.recommendation`:
- `entity/Recommendation.java`
- `enums/RecommendationType.java`
- `repository/RecommendationRepository.java` — custom native query for vector similarity search
- `dto/RecommendationResponse.java`
- `event/RecommendationsReadyEvent.java`
- `service/RecommendationService.java`:
  - `@EventListener` on `SegmentsGeneratedEvent`
  - Vector search for top-10 strategists
  - Tag overlap calculation
  - Score computation: `0.5*sim + 0.3*tagOverlap + 0.2*reputation`
  - Rule-based channel recommendations (stage × budget × channels matrix)
  - Persist recommendations
  - Publish `RecommendationsReadyEvent`
- `controller/RecommendationController.java` — `GET /api/recommendations/{requirementId}`

**Verification:** After AI pipeline completes → recommendations generated and retrievable via GET.

---

## Phase 7: Marketplace Service

### 7.1 Implementation
Create `com.example.marketrix.marketplace`:
- `entity/ServiceListing.java`, `entity/Gig.java`, `entity/Proposal.java`
- `enums/ListingStatus.java`, `enums/GigStatus.java`, `enums/ProposalStatus.java`
- `repository/ServiceListingRepository.java`, `GigRepository.java`, `ProposalRepository.java`
- `dto/CreateServiceRequest.java`, `CreateGigRequest.java`, `SubmitProposalRequest.java`
- `dto/ServiceListingResponse.java`, `GigResponse.java`, `ProposalResponse.java`
- `service/MarketplaceService.java` — CRUD + filtering with JPA Specifications
- `controller/MarketplaceController.java` — 6 endpoints

**Verification:** Create service listing as analyst → create gig as founder → submit proposal → accept proposal.

---

## Phase 8: Report Service

### 8.1 File storage
Create `com.example.marketrix.report`:
- `service/FileStorageService.java` — S3 upload (multipart), generate presigned download URL

### 8.2 Report CRUD & purchase
- `entity/Report.java`, `entity/ReportPurchase.java`
- `enums/ReportTier.java`, `enums/ReportStatus.java`
- `repository/ReportRepository.java`, `ReportPurchaseRepository.java`
- `dto/PublishReportRequest.java`, `ReportResponse.java`, `PurchaseResponse.java`
- `service/ReportService.java` — publish (upload + persist), catalog browse (paginated + filtered), purchase flow, download (verify ownership + signed URL)
- `controller/ReportController.java` — 5 endpoints

**Verification:** Upload report as analyst → browse catalog → purchase → download via signed URL.

---

## Phase 9: Messaging Service

### 9.1 WebSocket configuration
Create `com.example.marketrix.messaging`:
- `config/WebSocketConfig.java` — `@EnableWebSocketMessageBroker`, STOMP endpoints, allowed origins

### 9.2 Messaging implementation
- `entity/Conversation.java`, `entity/ConversationParticipant.java`, `entity/Message.java`
- `enums/ConversationType.java`
- `repository/ConversationRepository.java`, `MessageRepository.java`
- `dto/SendMessageRequest.java`, `MessageResponse.java`, `ConversationResponse.java`
- `service/MessagingService.java` — create conversation, send message (persist + broadcast via `SimpMessagingTemplate`)
- `controller/MessagingController.java` — 3 REST endpoints

**Verification:** Create conversation between two users → send message via REST → verify WebSocket broadcast.

---

## Phase 10: Feedback Service

### 10.1 Implementation
Create `com.example.marketrix.feedback`:
- `entity/Feedback.java`
- `enums/TargetType.java`, `enums/SignalType.java`
- `repository/FeedbackRepository.java` — custom queries for reputation calculation
- `dto/SubmitFeedbackRequest.java`, `FeedbackResponse.java`
- `event/FeedbackReceivedEvent.java`
- `service/FeedbackService.java` — submit feedback, calculate reputation, nightly batch (`@Scheduled`)
- `controller/FeedbackController.java` — 3 endpoints

**Verification:** Submit rating → verify reputation recalculation → verify event published.

---

## Phase 11: Admin Service

### 11.1 Implementation
Create `com.example.marketrix.admin`:
- `dto/PlatformStatsResponse.java`
- `service/AdminService.java` — approve/suspend users, approve/reject reports, aggregate stats
- `controller/AdminController.java` — 6 endpoints, all `@PreAuthorize("hasRole('ADMIN')")`

**Verification:** As admin → approve pending analyst → approve pending report → view platform stats.

---

## Phase 12: Payment Integration (Stripe)

### 12.1 Implementation
Create `com.example.marketrix.common.payment`:
- `entity/Transaction.java`
- `enums/TransactionType.java`, `enums/TransactionStatus.java`
- `repository/TransactionRepository.java`
- `service/StripeService.java` — create PaymentIntent, handle webhook events
- `controller/WebhookController.java` — `POST /api/webhooks/stripe` (verify signature, process events)

### 12.2 Integration
- Wire `StripeService` into `ReportService.purchase()` flow
- Wire into `MarketplaceService` for gig payments

**Verification:** Create payment intent → simulate webhook → verify transaction recorded.

---

## Phase 13: Final Integration & Polish

### 13.1 WebSocket notifications
- Wire `RecommendationsReadyEvent` → push to founder's WebSocket topic
- Wire new message notifications

### 13.2 Rate limiting
- Create `RateLimitFilter` — 100 req/min general, 10 req/min on `/api/ai/**` paths

### 13.3 Caching
- Add `@Cacheable` on report catalog queries and analyst profile lookups
- Configure cache TTL (5 min for catalog, 15 min for profiles)

### 13.4 Health checks
- Custom `HealthIndicator` for Claude API connectivity
- Actuator endpoint configured

### 13.5 API documentation
- Add `@Operation`, `@ApiResponse` annotations on all controllers
- Verify Swagger UI renders correctly at `/swagger-ui.html`

### 13.6 Final verification
- Full flow test: Register → Submit brief → AI processes → Recommendations appear → Purchase report → Rate analyst
- Verify all 9 services operational
- Verify WebSocket notifications working
- Verify error handling on all failure paths

**Verification:** End-to-end happy path works. Error cases return proper responses.

---

## Dependency Order Summary

```
Phase 1  → Foundation (no service depends on another)
Phase 2  → Database (all services need tables)
Phase 3  → Auth (all services need authentication)
Phase 4  → Intake (AI needs briefs to process)
Phase 5  → AI Orchestrator (Recommendations need segments)
Phase 6  → Recommendations (depends on AI output)
Phase 7  → Marketplace (independent, needs auth)
Phase 8  → Reports (independent, needs auth + file storage)
Phase 9  → Messaging (independent, needs auth)
Phase 10 → Feedback (needs recommendations + marketplace to exist)
Phase 11 → Admin (needs all other services to manage)
Phase 12 → Payments (integrates with reports + marketplace)
Phase 13 → Polish (integrates everything)
```

---

## Estimated Effort

| Phase | Effort |
|-------|--------|
| 1. Foundation | 1-2 hours |
| 2. Database | 1 hour |
| 3. Auth | 2-3 hours |
| 4. Intake | 1 hour |
| 5. AI Orchestrator | 3-4 hours |
| 6. Recommendations | 2 hours |
| 7. Marketplace | 2 hours |
| 8. Reports | 2-3 hours |
| 9. Messaging | 2 hours |
| 10. Feedback | 1-2 hours |
| 11. Admin | 1 hour |
| 12. Payments | 2 hours |
| 13. Polish | 2-3 hours |
| **Total** | **~22-28 hours** |
