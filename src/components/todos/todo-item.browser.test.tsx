import { beforeEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import type { Todo } from "@/services/todos/todos.models";
import { render } from "@/test/render";

// ミューテーションフックをモック
const mockDeleteMutate = vi.fn();
const mockToggleMutate = vi.fn();
let mockDeleteIsPending = false;
let mockToggleIsPending = false;

vi.mock("@/services/todos/todos.queries.ts", () => ({
	useDeleteTodo: () => ({
		mutate: mockDeleteMutate,
		isPending: mockDeleteIsPending,
	}),
	useToggleTodo: () => ({
		mutate: mockToggleMutate,
		isPending: mockToggleIsPending,
	}),
}));

// モック設定後にコンポーネントをインポート
const { TodoItem } = await import("./todo-item");

// テストデータ
const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
	id: 1,
	title: "テストTodo",
	completed: false,
	createdAt: new Date(),
	userId: "user-1",
	...overrides,
});

describe("TodoItem", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockDeleteIsPending = false;
		mockToggleIsPending = false;
	});

	describe("初期表示", () => {
		it("Todoのタイトルが表示される", async () => {
			const todo = createTodo({ title: "買い物に行く" });
			const screen = await render(<TodoItem todo={todo} />);

			await expect
				.element(screen.getByText("買い物に行く"))
				.toBeInTheDocument();
		});

		it("未完了のTodoはチェックボックスがオフになっている", async () => {
			const todo = createTodo({ completed: false });
			const screen = await render(<TodoItem todo={todo} />);

			const checkbox = screen.getByRole("checkbox");
			await expect.element(checkbox).not.toBeChecked();
		});

		it("完了済みのTodoはチェックボックスがオンになっている", async () => {
			const todo = createTodo({ completed: true });
			const screen = await render(<TodoItem todo={todo} />);

			const checkbox = screen.getByRole("checkbox");
			await expect.element(checkbox).toBeChecked();
		});

		it("削除ボタンが表示される", async () => {
			const todo = createTodo();
			const screen = await render(<TodoItem todo={todo} />);

			await expect.element(screen.getByRole("button")).toBeInTheDocument();
		});
	});

	describe("ユーザー操作", () => {
		it("チェックボックスをクリックするとトグルミューテーションが呼ばれる", async () => {
			const todo = createTodo({ id: 5 });
			const screen = await render(<TodoItem todo={todo} />);

			await userEvent.click(screen.getByRole("checkbox"));

			expect(mockToggleMutate).toHaveBeenCalledWith({ data: { todoId: 5 } });
		});

		it("削除ボタンをクリックすると削除ミューテーションが呼ばれる", async () => {
			const todo = createTodo({ id: 10 });
			const screen = await render(<TodoItem todo={todo} />);

			await userEvent.click(screen.getByRole("button"));

			expect(mockDeleteMutate).toHaveBeenCalledWith({ data: { todoId: 10 } });
		});
	});

	describe("ローディング状態", () => {
		it("トグル処理中はチェックボックスが無効になる", async () => {
			mockToggleIsPending = true;
			const todo = createTodo();
			const screen = await render(<TodoItem todo={todo} />);

			await expect.element(screen.getByRole("checkbox")).toBeDisabled();
		});

		it("削除処理中は削除ボタンが無効になる", async () => {
			mockDeleteIsPending = true;
			const todo = createTodo();
			const screen = await render(<TodoItem todo={todo} />);

			await expect.element(screen.getByRole("button")).toBeDisabled();
		});
	});
});
