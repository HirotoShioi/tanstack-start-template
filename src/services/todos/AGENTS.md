# TODOS SERVICE

**Complete reference implementation of service layer pattern**

## OVERVIEW
Todo CRUD with full-stack type safety: client hooks → server functions → repository → DB.

## STRUCTURE
```
todos/
├── todos.server-functions.ts   # getTodos, addTodo, deleteTodo, toggleTodoCompletion
├── todos.queries.ts             # Client hooks + cache keys
├── todos.repositories.ts        # Drizzle ORM data access
├── todos.schemas.ts             # Zod validation (Add/Delete/Toggle)
└── todos.models.ts              # Todo type
```

## WHERE TO LOOK
| Task | File | Notes |
|------|------|-------|
| Add endpoint | `todos.server-functions.ts` | Use `createServerFn()` + `authMiddleware` |
| Add client hook | `todos.queries.ts` | Wrap server fn with `useMutation` |
| Add validation | `todos.schemas.ts` | Zod schema for input |
| Add DB query | `todos.repositories.ts` | Drizzle query |
| Add type | `todos.models.ts` | Infer from schema |

## ENDPOINTS

### Server Functions (`todos.server-functions.ts`)
```typescript
getTodos()                      // GET, returns Todo[]
addTodo({ title })              // POST, returns Todo
deleteTodo({ todoId })          // POST, returns void
toggleTodoCompletion({ todoId }) // POST, returns void
```

**Common pattern:**
```typescript
createServerFn({ method: "POST" })
  .inputValidator(Schema)       // Zod validation
  .middleware([authMiddleware]) // Auth guard
  .handler(async ({ context, data }) => {
    const { userSession } = context;
    return await todoRepository.method(userSession.user.id, ...);
  });
```

## DATA FLOW

### Client → Server → DB
1. Component calls `useAddTodo()` from `todos.queries.ts`
2. Hook executes `addTodo()` from `todos.server-functions.ts`
3. Server validates input with `AddTodoSchema`
4. `authMiddleware` checks session, injects `userSession` into context
5. Handler calls `todoRepository.add(userId, title)`
6. Repository executes Drizzle query on `todos` table
7. Mutation `onSuccess` invalidates `todoKeys.all` cache
8. React Query refetches `getTodosOptions()` automatically

### Repository Layer (`todos.repositories.ts`)
```typescript
todoRepository = {
  get(userId)                    // SELECT WHERE userId
  add(userId, title)             // INSERT
  delete(userId, todoId)         // DELETE WHERE userId AND id
  toggleCompletion(userId, todoId) // UPDATE completed
}
```

## CLIENT HOOKS (`todos.queries.ts`)

### Query
```typescript
getTodosOptions() → queryOptions({
  queryKey: todoKeys.all,
  queryFn: getTodos
})
```

### Mutations
```typescript
useAddTodo()       → useMutation({ mutationFn: addTodo })
useDeleteTodo()    → useMutation({ mutationFn: deleteTodo })
useToggleTodo()    → useMutation({ mutationFn: toggleTodoCompletion })
```

**All mutations invalidate `todoKeys.all` on success.**

## VALIDATION (`todos.schemas.ts`)
```typescript
AddTodoSchema    = z.object({ title: z.string().min(1) })
DeleteTodoSchema = z.object({ todoId: z.string() })
ToggleTodoSchema = z.object({ todoId: z.string() })
```

## CONVENTIONS
- **Cache keys**: Centralized in `todoKeys` object
- **Auth**: All mutations protected by `authMiddleware`
- **Validation**: Input validated before repository call
- **Types**: `Todo` inferred from `todos.$inferSelect`
- **User scoping**: All queries filter by `userSession.user.id`

## EXTENDING
To add new operation:
1. Add Zod schema in `todos.schemas.ts`
2. Add repository method in `todos.repositories.ts`
3. Add server function in `todos.server-functions.ts` with `.inputValidator()` + `.middleware([authMiddleware])`
4. Add client hook in `todos.queries.ts` with cache invalidation
