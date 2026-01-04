import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAddTodo, useDeleteTodo, useToggleTodo } from "@/services/todos/mutations";
import { getTodosOptions } from "@/services/todos/queries";

export const Route = createFileRoute("/todos")({
	beforeLoad: async ({ context }) => {
		if (!context.userSession) {
			throw redirect({ to: "/" });
		}
		context.queryClient.ensureQueryData(getTodosOptions());
	},
	component: TodoList,
});

function TodoList() {
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const todosQuery = useSuspenseQuery(getTodosOptions());
	const addTodoMutation = useAddTodo();
	const deleteTodoMutation = useDeleteTodo();
	const toggleTodoMutation = useToggleTodo();

	const handleAddTodo = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTodoTitle.trim()) return;
		addTodoMutation.mutate(
			{ data: { title: newTodoTitle } },
			{
				onSuccess: () => setNewTodoTitle(""),
			}
		);
	};

	const handleToggleTodo = (todoId: number) => {
		toggleTodoMutation.mutate({ data: { todoId } });
	};

	const handleDeleteTodo = (todoId: number) => {
		deleteTodoMutation.mutate({ data: { todoId } });
	};

	return (
		<div className="container mx-auto max-w-2xl py-8 px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Todoリスト</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<form onSubmit={handleAddTodo} className="flex gap-2">
						<Input
							type="text"
							placeholder="新しいTodoを入力..."
							value={newTodoTitle}
							onChange={(e) => setNewTodoTitle(e.target.value)}
							disabled={addTodoMutation.isPending}
						/>
						<Button type="submit" disabled={addTodoMutation.isPending || !newTodoTitle.trim()}>
							{addTodoMutation.isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Plus className="h-4 w-4" />
							)}
							追加
						</Button>
					</form>

					<div className="space-y-2">
						{todosQuery.data.length === 0 ? (
							<p className="text-center text-muted-foreground py-8">
								Todoがありません。新しいTodoを追加してください。
							</p>
						) : (
							todosQuery.data.map((todo) => (
								<div
									key={todo.id}
									className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
								>
									<Checkbox
										checked={todo.completed}
										onCheckedChange={() => handleToggleTodo(todo.id)}
										disabled={toggleTodoMutation.isPending}
									/>
									<span
										className={`flex-1 ${
											todo.completed ? "line-through text-muted-foreground" : ""
										}`}
									>
										{todo.title}
									</span>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleDeleteTodo(todo.id)}
										disabled={deleteTodoMutation.isPending}
									>
										<Trash2 className="h-4 w-4 text-destructive" />
									</Button>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
