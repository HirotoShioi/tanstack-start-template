# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-25 06:14:34 JST  
**Commit:** b1798e9  
**Branch:** main

## OVERVIEW
TanStack Start full-stack React app with PostgreSQL/Drizzle ORM, Better Auth, Shadcn UI, and Vitest/Playwright testing.

## STRUCTURE
```
my-app/
├── src/
│   ├── routes/         # File-based routing (see src/routes/AGENTS.md)
│   ├── services/       # Domain logic layers (auth, todos)
│   ├── components/     # React components (ui/, todos/)
│   ├── db/             # Drizzle schema + connection
│   ├── lib/            # Auth + utilities
│   ├── middlewares/    # Server function middleware
│   ├── integrations/   # TanStack Query setup
│   └── test/           # Test helpers (render.tsx, setup.browser.ts)
├── drizzle/            # Migration files
└── public/             # Static assets
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Add route | `src/routes/*.tsx` | Auto-generates routeTree.gen.ts |
| Add API endpoint | `src/routes/api/**/*.ts` | Catch-all via `$.ts` |
| Add domain logic | `src/services/{domain}/` | Follow *.server-functions.ts pattern |
| Add DB table | `src/db/schema.ts` | Then `pnpm db:push` |
| Add UI component | `src/components/{domain}/` | Use Shadcn via `pnpm dlx shadcn@latest add` |
| Auth config | `src/lib/auth.ts` | Better Auth setup |
| Middleware | `src/middlewares/auth.ts` | Use with `.middleware([authMiddleware])` |

## CONVENTIONS
- **Formatting**: Tabs (not spaces), double quotes enforced by Biome
- **Excludes**: `src/routeTree.gen.ts`, `src/styles.css`, `src/components/ui/*` (Biome ignores)
- **Path alias**: `@/*` → `./src/*` (use consistently)
- **File naming**: kebab-case for files, PascalCase for components
- **Server functions**: Use `createServerFn()` with `.inputValidator()` + `.middleware()` + `.handler()`
- **Test naming**: `*.browser.test.tsx` for Playwright, `*.test.ts` for unit tests

## SERVICES PATTERN
Each domain (auth, todos) follows:
```
{domain}/
├── {domain}.server-functions.ts   # Server endpoints (createServerFn)
├── {domain}.queries.ts             # Client hooks (useMutation, queryOptions)
├── {domain}.repositories.ts        # DB access layer (Drizzle)
├── {domain}.schemas.ts             # Zod validation schemas
└── {domain}.models.ts              # TypeScript types
```

**Flow**: Client → queries.ts → server-functions.ts → middleware → repositories.ts → DB

## DATABASE
- **Schema**: `src/db/schema.ts` (user, session, account, verification, todos)
- **Better Auth tables**: Managed via Drizzle adapter
- **Push changes**: `pnpm db:push` (dev), `pnpm db:generate && pnpm db:migrate` (prod)
- **Studio**: `pnpm db:studio` for GUI

## AUTH
- **Middleware**: `authMiddleware` checks session, redirects if unauthenticated, injects `userSession` into context
- **Server**: `getUserSession()` in `auth.server-functions.ts`
- **Client**: `useSignIn/useSignUp/useSignOut` in `auth.queries.ts`
- **Routes**: `/api/auth/$` catch-all delegates to Better Auth handler

## TESTING
- **Browser tests**: `*.browser.test.tsx` uses Playwright via `pnpm test:browser`
  - Setup: `src/test/setup.browser.ts` (cleanup after each)
  - Helper: `src/test/render.tsx` (wraps with QueryClientProvider)
- **Unit tests**: `*.test.ts` via `pnpm test`
- **Config**: `vitest.config.ts` (browser project) + `vitest.browser.config.ts`

## ANTI-PATTERNS (THIS PROJECT)
- **NEVER** use `as any`, `@ts-ignore`, `@ts-expect-error`
- **NEVER** edit `src/routeTree.gen.ts` (auto-generated)
- **NEVER** edit `src/components/ui/*` directly (Shadcn managed)
- **NEVER** commit without explicit request
- **NEVER** suppress type errors

## COMMANDS
```bash
# Dev
pnpm dev              # Start dev server (port 3000)
pnpm build            # Production build
pnpm preview          # Preview prod build

# DB
pnpm db:push          # Push schema to DB (dev)
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio

# Test
pnpm test             # Unit tests
pnpm test:browser     # Browser tests (Playwright)

# Lint/Format
pnpm lint             # Lint with Biome
pnpm format           # Check formatting
pnpm fix              # Auto-fix formatting
pnpm check            # All Biome checks
pnpm watch            # Type-check in watch mode
```

## GOTCHAS
- `src/routes/api/auth/$.ts` uses catch-all routing (`$`) for Better Auth
- Biome, not ESLint/Prettier (tabs + double quotes enforced)
- CI runs lint/typecheck/build but **no tests** (add if needed)
- Database scripts (`db:*`) integrated in root package.json (full-stack setup)
- TanStack Start uses Vite + Nitro for SSR
