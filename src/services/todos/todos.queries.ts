import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import {
	addTodo,
	deleteTodo,
	getTodos,
	toggleTodoCompletion,
} from "./todos.server-functions";

export const todoKeys = {
	all: ["todos"] as const,
};

export function getTodosOptions() {
	return queryOptions({
		queryKey: [...todoKeys.all],
		queryFn: () => getTodos(),
	});
}

export function useAddTodo() {
	return useMutation({
		mutationFn: addTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: todoKeys.all,
			});
		},
	});
}

export function useDeleteTodo() {
	return useMutation({
		mutationFn: deleteTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: todoKeys.all,
			});
		},
	});
}

export function useToggleTodo() {
	return useMutation({
		mutationFn: toggleTodoCompletion,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: todoKeys.all,
			});
		},
	});
}
