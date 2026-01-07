import type { todos } from "@/db/schema";

export type Todo = typeof todos.$inferSelect;
