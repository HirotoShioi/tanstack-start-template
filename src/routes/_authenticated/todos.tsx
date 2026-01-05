import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/todos/header";
import { TodoForm } from "@/components/todos/todo-form";
import { TodoItem } from "@/components/todos/todo-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTodosOptions } from "@/services/todos/queries";

export const Route = createFileRoute("/_authenticated/todos")({
	loader: async ({ context }) => {
		await context.queryClient.fetchQuery(getTodosOptions());
	},
	component: TodoList,
});

function TodoList() {
	const { userSession } = Route.useRouteContext();
	const todosQuery = useSuspenseQuery(getTodosOptions());

	return (
		<div className="min-h-screen">
			<Header email={userSession?.user.email} />
			<div className="container mx-auto max-w-2xl py-8 px-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Todoリスト</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<TodoForm />
						<div className="space-y-2">
							{todosQuery.data.length === 0 ? (
								<p className="text-center text-muted-foreground py-8">
									Todoがありません。新しいTodoを追加してください。
								</p>
							) : (
								todosQuery.data.map((todo) => (
									<TodoItem key={todo.id} todo={todo} />
								))
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
