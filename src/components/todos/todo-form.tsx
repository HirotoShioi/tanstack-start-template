import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddTodo } from "../../services/todos/todos.queries";

export function TodoForm() {
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const addTodoMutation = useAddTodo();

	const handleAddTodo = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTodoTitle.trim()) return;
		addTodoMutation.mutate(
			{ data: { title: newTodoTitle } },
			{
				onSuccess: () => setNewTodoTitle(""),
			},
		);
	};

	return (
		<form onSubmit={handleAddTodo} className="flex gap-2">
			<Input
				type="text"
				placeholder="新しいTodoを入力..."
				value={newTodoTitle}
				onChange={(e) => setNewTodoTitle(e.target.value)}
				disabled={addTodoMutation.isPending}
			/>
			<Button
				type="submit"
				disabled={addTodoMutation.isPending || !newTodoTitle.trim()}
			>
				{addTodoMutation.isPending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<Plus className="h-4 w-4" />
				)}
				追加
			</Button>
		</form>
	);
}
