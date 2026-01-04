import { z } from "zod";

export const AddTodoSchema = z.object({
    title: z.string().min(1),
});

export const DeleteTodoSchema = z.object({
    todoId: z.number().min(1),
});

export const ToggleTodoSchema = z.object({
    todoId: z.number().min(1),
});