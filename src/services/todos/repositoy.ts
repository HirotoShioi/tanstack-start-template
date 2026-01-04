import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import type { Todo } from "./models";

interface TodoRepository {
	get(userId: string): Promise<Array<Todo>>;
	add(userId: string, title: string): Promise<Todo>;
	delete(userId: string, todoId: number): Promise<void>;
	toggleCompletion(userId: string, todoId: number): Promise<void>;
}

async function get(userId: string): Promise<Array<Todo>> {
	return await db
		.select()
		.from(todos)
		.where(eq(todos.userId, userId))
		.orderBy(asc(todos.id));
}

async function add(userId: string, title: string): Promise<Todo> {
	const [newTodo] = await db
		.insert(todos)
		.values({
			title,
			userId,
			completed: false,
		})
		.returning();
	return newTodo;
}

async function deleteTodo(userId: string, todoId: number): Promise<void> {
	await db
		.delete(todos)
		.where(and(eq(todos.id, todoId), eq(todos.userId, userId)));
}

async function toggleCompletion(userId: string, todoId: number): Promise<void> {
	const [todo] = await db
		.select()
		.from(todos)
		.where(and(eq(todos.id, todoId), eq(todos.userId, userId)));

	if (todo) {
		await db
			.update(todos)
			.set({ completed: !todo.completed })
			.where(and(eq(todos.id, todoId), eq(todos.userId, userId)));
	}
}

export const todoRepository: TodoRepository = {
	get,
	add,
	delete: deleteTodo,
	toggleCompletion,
};
