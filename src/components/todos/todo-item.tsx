import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Todo } from "../../services/todos/models";
import { useDeleteTodo, useToggleTodo } from "../../services/todos/queries";

interface TodoItemProps {
	todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
	const deleteTodoMutation = useDeleteTodo();
	const toggleTodoMutation = useToggleTodo();

	const handleToggleTodo = () => {
		toggleTodoMutation.mutate({ data: { todoId: todo.id } });
	};

	const handleDeleteTodo = () => {
		deleteTodoMutation.mutate({ data: { todoId: todo.id } });
	};

	return (
		<div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
			<Checkbox
				checked={todo.completed}
				onCheckedChange={handleToggleTodo}
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
				onClick={handleDeleteTodo}
				disabled={deleteTodoMutation.isPending}
			>
				<Trash2 className="h-4 w-4 text-destructive" />
			</Button>
		</div>
	);
}
