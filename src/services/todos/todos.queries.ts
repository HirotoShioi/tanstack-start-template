import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
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
	const queryClient = useQueryClient();

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
	const queryClient = useQueryClient();

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
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: toggleTodoCompletion,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: todoKeys.all,
			});
		},
	});
}
