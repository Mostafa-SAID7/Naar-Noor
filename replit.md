# Naar & Noor

A Himalayan restaurant website with Angular frontend, .NET 8 API backend, and PostgreSQL database.

## Run & Operate

- `Start application` workflow — Angular frontend (port 5000)
- `API Server` workflow — .NET 8 API backend (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `DATABASE_URL` — Postgres connection string (set automatically by Replit DB)

## Stack

- **Package manager:** pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend:** Angular 18, Tailwind CSS 3.4 — `artifacts/naar-noor/`
- **API:** .NET 8 ASP.NET Core Web API — `artifacts/api-server/`
- **DB:** PostgreSQL + Entity Framework Core (migrations) + Drizzle ORM (TypeScript lib)
- **Validation:** Zod (`zod/v4`), `drizzle-zod`
- **API codegen:** Orval (from OpenAPI spec in `lib/api-spec/`)

## Where things live

- `artifacts/naar-noor/` — Angular 18 frontend (main app)
- `artifacts/api-server/` — .NET 8 Clean Architecture API (API, Application, Domain, Infrastructure layers)
- `artifacts/mockup-sandbox/` — React/Vite mockup sandbox for prototyping
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/` — Generated React Query hooks
- `lib/api-zod/` — Generated Zod schemas
- `lib/db/src/schema/` — Drizzle ORM schema (PostgreSQL)

## Architecture decisions

- .NET API uses Clean Architecture (Domain → Application → Infrastructure → API layers)
- EF Core migrations apply automatically on startup via `DatabaseSeeder.MigrateAsync()`
- API port is controlled via `PORT` env var, defaults to 8080 in production
- Angular `allowedHosts: true` in `angular.json` lets the Replit proxy iframe work
- CORS is open (`AllowAnyOrigin`) in the API for development flexibility

## Product

Naar & Noor is a Himalayan restaurant website. Users can browse the menu, read chef bios, see reviews, make table reservations, and contact the restaurant. The site features authentic Nepali/Himalayan dishes and a warm, premium dining atmosphere.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `dotnet-ef` global tool is not installed; EF migrations run automatically on app startup via `MigrateAsync()`
- Angular dev command passes `$PORT` via env but also explicitly sets `--port 5000` in the workflow command
- The `pnpm-lock.yaml` uses `minimumReleaseAge: 1440` (supply-chain security) — new packages take 1 day to be installable unless added to the exclusion list
- API server normalises `postgresql://` URIs to ADO.NET format in `DependencyInjection.cs`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
