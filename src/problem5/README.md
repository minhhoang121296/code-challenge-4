# Problem 5 - Express + TypeScript CRUD API (Prisma + PostgreSQL)

Backend HTTP API built with **Express**, **TypeScript**, and **Prisma ORM**. You can use **PostgreSQL in Docker** (local dev) or any **remote PostgreSQL server** (VPS, managed cloud DB, etc.) by setting `DATABASE_URL`-the app is the same in both cases.

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** reachable from the machine that runs the API
- **Docker** + Docker Compose plugin - only if you use the [local Docker database](#option-a--postgresql-via-docker-compose) option below

## Quick start (common steps)

```bash
cd src/problem5
cp .env.example .env
npm install
# Set DATABASE_URL (see “Database options” below), then:
npm run db:migrate:deploy   # apply migrations from prisma/migrations/
npm run dev
```

The server listens at `http://localhost:3000` (or the `PORT` value in `.env`).

| Script | Description |
|--------|-------------|
| `npm run db:up` | `docker compose up -d` - start PostgreSQL (Option A) |
| `npm run db:down` | Stop containers (keeps the volume) |
| `npm run db:migrate:deploy` | `prisma migrate deploy` - apply migrations (after clone / on a server) |
| `npm run db:migrate` | `prisma migrate dev` - when you change `schema.prisma` (creates a new migration) |
| `npm run db:push` | `prisma db push` - quick schema sync without migration files (mostly for experiments) |
| `npm run db:seed` | Seed sample data into `items` table |
| `npm test` | Run unit tests |
| `npm run build` | `prisma generate` + `tsc` |
| `npm start` | Run `dist/index.js` (run `build` first) |

**Production build**

```bash
npm run build
npm start
```

## Database options

Prisma only needs a valid `DATABASE_URL`. Pick **one** of the following.

### Option A - PostgreSQL via Docker Compose

Good for a self-contained local setup; uses [`docker-compose.yml`](./docker-compose.yml).

```bash
docker compose up -d
# In .env, keep the default from .env.example (or equivalent):
# DATABASE_URL="postgresql://problem5:problem5@localhost:5432/problem5?schema=public"
npm run db:migrate:deploy
npm run dev
```

### Option B - Remote PostgreSQL server

Use a database on another host:

1. **Create a database and user** on the server (or use the credentials your provider gives you). The database name, user, and password are up to you-the example below is illustrative only.
2. **Allow network access** from your app: open the server firewall / security group for the PostgreSQL port (usually **5432**), and ensure `pg_hba.conf` or the host’s equivalent allows your client IP (or use a VPN / tunnel if you do not want a public listen).
3. **Set `DATABASE_URL` in `.env`** to a standard PostgreSQL URL:

   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
   ```

   Many managed providers require **TLS**. Append their required query params, for example:

   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public&sslmode=require"
   ```

   (Use the exact connection string your provider documents; some use different hosts for “pooled” vs “direct” connections.)
4. **Run migrations** from a machine that can reach the database (your laptop or a CI runner with access):

   ```bash
   npm run db:migrate:deploy
   npm run dev
   ```

You do **not** need `docker compose` for Option B. If the remote server enforces **SSL** or a **non-default port**, include that in `DATABASE_URL` as required by your host.

## Configuration (`.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string. For [Docker Compose](#option-a--postgresql-via-docker-compose), the default in [`.env.example`](./.env.example) matches `docker-compose.yml`. For a [remote server](#option-b--remote-postgresql-server), use the URL from your provider (often with `sslmode=require` or similar). |
| `PORT` | HTTP port (default `3000`) |

**Docker Compose** (Option A only): user `problem5`, password `problem5`, database `problem5`, host port `5432` on `localhost`.

## Request body validation

`POST /api/items` and `PUT /api/items/:id` bodies are validated with **[Zod](https://zod.dev/)** (`src/validation/itemSchemas.ts`). On failure the API returns **400** with:

```json
{
  "error": "Validation failed",
  "details": [
    { "path": "title", "message": "Title must not be empty" }
  ]
}
```

Shared middleware: `validateBody` in `src/middleware/validateBody.ts`.
