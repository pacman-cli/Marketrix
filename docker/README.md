# Database Setup

Start PostgreSQL with pgvector using Docker:

```bash
cd docker
docker compose up -d
```

This starts a PostgreSQL 16 instance with the pgvector extension pre-installed.

**Connection details:**
- Host: `localhost`
- Port: `5432`
- Database: `marketrix`
- Username: `postgres`
- Password: `postgres`

**Stop:**
```bash
docker compose down
```

**Reset (delete all data):**
```bash
docker compose down -v
```

The backend will automatically run Flyway migrations on startup to create all tables.
