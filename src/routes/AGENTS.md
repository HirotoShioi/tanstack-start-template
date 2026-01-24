# ROUTES

**File-based routing for TanStack Router**

## OVERVIEW
Maps files to URLs; `__root.tsx` is layout, `_authenticated` guards routes, `$.ts` catches all.

## STRUCTURE
```
routes/
├── __root.tsx              # Root layout + session prefetch
├── _authenticated.tsx      # Route group (guards child routes)
├── _authenticated/
│   └── todos.tsx           # /todos (protected)
├── index.tsx               # / (home)
├── sign-in.tsx             # /sign-in
├── sign-up.tsx             # /sign-up
└── api/auth/$.ts           # /api/auth/* (catch-all)
```

## WHERE TO LOOK
| Task | File | Notes |
|------|------|-------|
| Add public route | `routes/{name}.tsx` | Auto-maps to `/{name}` |
| Add protected route | `routes/_authenticated/{name}.tsx` | Requires auth |
| Add API endpoint | `routes/api/{path}/$.ts` | Catch-all handler |
| Modify layout | `__root.tsx` | Shell, meta, scripts |
| Change auth guard | `_authenticated.tsx` | Redirect logic |

## ROUTING PATTERNS

### Root Layout (`__root.tsx`)
- `beforeLoad`: Prefetches `getUserSession` into `context.userSession`
- `shellComponent`: HTML wrapper with devtools
- All routes inherit this context

### Route Groups (`_authenticated.tsx`)
- Prefix `_` creates layout without URL segment
- `beforeLoad`: Checks `context.userSession`, redirects if null
- Children inherit guard (e.g., `_authenticated/todos.tsx` → `/todos`)

### Catch-All Routes (`$.ts`)
- `$` matches any path segment
- Example: `api/auth/$.ts` handles `/api/auth/*`
- Delegates to `auth.handler` for Better Auth

### File Naming
- `__root.tsx`: Root layout (double underscore)
- `_layout.tsx`: Route group (single underscore)
- `{name}.tsx`: Public route
- `_authenticated/{name}.tsx`: Protected route

## DATA FLOW
1. Request → `__root.tsx` `beforeLoad` → fetch session → inject into context
2. Child route `beforeLoad` → access `context.userSession`
3. `_authenticated` guard → redirect if no session
4. Route component renders with session available

## ANTI-PATTERNS
- **NEVER** edit `src/routeTree.gen.ts` (auto-generated on route changes)
- **NEVER** bypass `_authenticated` guard for protected routes
- **NEVER** fetch session in individual routes (use root `beforeLoad`)

## GOTCHAS
- Route context typed in `__root.tsx` (`MyRouterContext`)
- Session fetched once in root, reused everywhere via context
- `Outlet` in `_authenticated.tsx` renders child routes
- API routes use `server.handlers` instead of `component`
