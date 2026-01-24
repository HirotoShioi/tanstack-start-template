# AUTH SERVICE

**Session management and client auth flows**

## OVERVIEW
Bridges Better Auth with TanStack Query; provides session state and sign-in/up/out hooks.

## STRUCTURE
```
auth/
├── auth.server-functions.ts   # getUserSession (server-side session fetch)
├── auth.queries.ts             # Client hooks (useSignIn/Up/Out) + session options
└── auth.models.ts              # User type
```

**No repositories/schemas** (Better Auth handles DB + validation).

## WHERE TO LOOK
| Task | File | Notes |
|------|------|-------|
| Add server session check | `auth.server-functions.ts` | Calls Better Auth API |
| Add client auth hook | `auth.queries.ts` | Uses `authClient` from `lib/auth-client.ts` |
| Modify User type | `auth.models.ts` | Inferred from Better Auth schema |

## INTEGRATION POINTS

### Better Auth Config (`lib/auth.ts`)
- Exports `auth` object (server-side Better Auth instance)
- Used by `/api/auth/$` catch-all route
- Handles email/password, sessions, cookies

### Auth Client (`lib/auth-client.ts`)
- Exports `authClient` (client-side Better Auth instance)
- Used by `useSignIn/useSignUp/useSignOut` for mutations

### Middleware (`middlewares/auth.ts`)
- `authMiddleware` calls `getUserSession()` from this service
- Redirects if session is null
- Injects `userSession` into server function context

## DATA FLOW

### Session Fetch (Server)
1. Root route `__root.tsx` calls `getUserSessionOptions()` in `beforeLoad`
2. Executes `getUserSession()` from `auth.server-functions.ts`
3. Server calls `auth.api.getSession({ headers })` (Better Auth)
4. Returns `{ user, session }` or `null`
5. Result cached in React Query, injected into `context.userSession`

### Sign In/Up/Out (Client)
1. Component calls `useSignIn()` from `auth.queries.ts`
2. Hook executes `authClient.signIn.email()` (client-side Better Auth)
3. On success: navigates to `/todos`, resets query cache
4. Session automatically refreshed via root `beforeLoad`

## CLIENT HOOKS (`auth.queries.ts`)

### Session Query
```typescript
getUserSessionOptions() → queryOptions({
  queryKey: authKeys.all,
  queryFn: getUserSession
})
```

### Mutations
```typescript
useSignIn()   → authClient.signIn.email()  → navigate("/todos")
useSignUp()   → authClient.signUp.email()  → navigate("/todos")
useSignOut()  → authClient.signOut()       → navigate("/")
```

**All mutations reset query cache on success.**

## SERVER VS CLIENT

| Concern | Server | Client |
|---------|--------|--------|
| Session fetch | `getUserSession()` | `getUserSessionOptions()` |
| Auth operations | N/A (handled by Better Auth API) | `authClient.signIn/Up/Out()` |
| Middleware | `authMiddleware` uses `getUserSession()` | N/A |
| Route guard | `_authenticated` checks `context.userSession` | N/A |

## CONVENTIONS
- **No validation schemas**: Better Auth handles input validation
- **No repositories**: Better Auth manages DB via Drizzle adapter
- **Session prefetch**: Root route fetches once, reused everywhere
- **Client mutations**: Navigate + reset cache on success
- **Server middleware**: Calls `getUserSession()`, redirects if null

## ANTI-PATTERNS
- **NEVER** fetch session in individual routes (use root `beforeLoad`)
- **NEVER** bypass `authMiddleware` for protected server functions
- **NEVER** store session in local state (use React Query cache)

## EXTENDING
- Add OAuth provider: Configure in `lib/auth.ts`, add button in sign-in/up forms
- Add custom session data: Extend Better Auth config + `User` type in `auth.models.ts`
- Add role-based auth: Extend `authMiddleware` to check `userSession.user.role`
