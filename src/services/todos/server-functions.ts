import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/middlewares/auth";
import { todoRepository } from "@/services/todos/repository";
import {
	AddTodoSchema,
	DeleteTodoSchema,
	ToggleTodoSchema,
} from "@/services/todos/schemas";

export const getTodos = createServerFn()
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const { userSession } = context;
		const todoList = await todoRepository.get(userSession.user.id);
		return todoList;
	});

export const addTodo = createServerFn({
	method: "POST",
})
	.inputValidator(AddTodoSchema)
	.middleware([authMiddleware])
	.handler(async ({ context, data }) => {
		const { userSession } = context;
		const { title } = data;
		const newTodo = await todoRepository.add(userSession.user.id, title);
		return newTodo;
	});

export const deleteTodo = createServerFn({
	method: "POST",
})
	.inputValidator(DeleteTodoSchema)
	.middleware([authMiddleware])
	.handler(async ({ context, data }) => {
		const { userSession } = context;
		const { todoId } = data;
		await todoRepository.delete(userSession.user.id, todoId);
	});

export const toggleTodoCompletion = createServerFn({
	method: "POST",
})
	.inputValidator(ToggleTodoSchema)
	.middleware([authMiddleware])
	.handler(async ({ context, data }) => {
		const { userSession } = context;
		const { todoId } = data;
		await todoRepository.toggleCompletion(userSession.user.id, todoId);
	});
