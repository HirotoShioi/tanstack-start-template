## Commands

### Development
- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm watch` - Run TypeScript type checking in watch mode

### Testing
- `pnpm test` - Run all tests (non-browser tests via Vitest)
- `pnpm test:browser` - Run browser-based component tests with Playwright
  - Browser tests use the `*.browser.test.tsx` naming convention
  - Non-browser tests use standard `*.test.ts` or `*.test.tsx` naming

### Database (Drizzle ORM + PostgreSQL)
- `pnpm db:generate` - Generate migration files from schema
- `pnpm db:migrate` - Run migrations
- `pnpm db:push` - Push schema changes directly to database
- `pnpm db:pull` - Pull schema from database
- `pnpm db:studio` - Open Drizzle Studio UI
- Database schema is defined in [src/db/schema.ts](src/db/schema.ts)
- Connection configured in [drizzle.config.ts](drizzle.config.ts) using `DATABASE_URL` from `.env.local`

### Linting & Formatting
- `pnpm lint` - Lint code with Biome
- `pnpm format` - Check formatting with Biome
- `pnpm fix` - Auto-fix formatting issues with Biome
- `pnpm check` - Run all Biome checks
- Uses tabs for indentation and double quotes (see [biome.json](biome.json))
- Excludes: `src/routeTree.gen.ts`, `src/styles.css`, `src/components/ui/*`

### Shadcn Components
- `pnpm dlx shadcn@latest add <component>` - Add Shadcn UI components

## Architecture

### Tech Stack
- **Framework**: TanStack Start (full-stack React meta-framework)
- **Router**: TanStack Router with file-based routing
- **State Management**: TanStack Query for server state
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better Auth with email/password
- **UI**: Shadcn UI + Tailwind CSS v4
- **Testing**: Vitest with browser testing via Playwright
- **Build**: Vite with Nitro for SSR

### Project Structure

#### Routing ([src/routes/](src/routes/))
File-based routing where each file becomes a route:
- `__root.tsx` - Root layout component with `<Outlet />` for nested routes
- `index.tsx` - Home page (`/`)
- `todos.tsx` - Todos page (`/todos`)
- `sign-in.tsx`, `sign-up.tsx` - Auth pages
- `api/auth/$.ts` - Catch-all API route for Better Auth handlers

Route files auto-generate [src/routeTree.gen.ts](src/routeTree.gen.ts) - do not edit manually.

#### Services Layer ([src/services/](src/services/))
Business logic organized by domain with consistent structure:
- `functions.ts` - Server functions using `createServerFn()` from TanStack Start
- `queries.ts` - TanStack Query hooks (query options, mutations)
- `models.ts` / `model.ts` - TypeScript types/interfaces
- `repository.ts` - Database access layer using Drizzle ORM
- `schema.ts` - Zod schemas for input validation

Example pattern (todos):
1. Client calls mutation hook from `queries.ts`
2. Hook calls server function from `functions.ts`
3. Server function validates input, uses middleware, calls repository
4. Repository performs database operations via Drizzle

#### Middleware ([src/middlewares/](src/middlewares/))
- `auth.ts` - Authentication middleware using `createMiddleware()`
  - Checks user session via `getUserSession()`
  - Redirects to `/` if not authenticated
  - Injects `userSession` into context for server functions

#### Database ([src/db/](src/db/))
- `schema.ts` - Drizzle schema with tables: `user`, `session`, `account`, `verification`, `todos`
- `index.ts` - Database connection export
- Better Auth uses Drizzle adapter for auth tables

#### Authentication ([src/lib/](src/lib/))
- `auth.ts` - Better Auth configuration with email/password and TanStack Start cookies plugin
- `auth-client.ts` - Client-side auth instance
- Better Auth API routes handled in `src/routes/api/auth/$.ts`

#### Integrations ([src/integrations/](src/integrations/))
- `tanstack-query/` - TanStack Query setup with provider and devtools

#### Path Aliases
- `@/*` maps to `./src/*` (configured in [tsconfig.json](tsconfig.json))
- Use path aliases consistently: `import { db } from "@/db"`

### Server Functions Pattern

Server functions in this codebase use TanStack Start's `createServerFn()`:

```typescript
export const exampleFunction = createServerFn({ method: "POST" })
  .inputValidator(ExampleSchema)  // Zod validation
  .middleware([authMiddleware])   // Auth check
  .handler(async ({ context, data }) => {
    const { userSession } = context;
    // Business logic here
  });
```

- Server functions are type-safe and can be called directly from client components
- Mutations automatically work with TanStack Query
- Use `.middleware([authMiddleware])` for protected endpoints

### Testing Patterns

- **Browser tests** (`*.browser.test.tsx`): Component tests using Playwright
  - Use `render()` from `@/test/render`
  - Mock hooks with `vi.mock()`
  - Use `userEvent` from `vitest/browser` for interactions
  - Run with `pnpm test:browser`

- **Unit tests** (standard `*.test.ts`): Use Vitest with jsdom
  - Run with `pnpm test`

### Code Style
- TypeScript with strict mode enabled
- Tabs for indentation (enforced by Biome)
- Double quotes for strings (enforced by Biome)
- React 19 with JSX transform
- File naming: kebab-case for files, PascalCase for components
