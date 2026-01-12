import { beforeEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import type { Todo } from "@/services/todos/todos.models";
import { render } from "@/test/render";

// Mock mutation hooks
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

// Import component after mock setup
const { TodoItem } = await import("./todo-item");

// Test data
const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
	id: 1,
	title: "Test Todo",
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

	describe("Initial display", () => {
		it("displays the todo title", async () => {
			const todo = createTodo({ title: "Go shopping" });
			const screen = await render(<TodoItem todo={todo} />);

			await expect.element(screen.getByText("Go shopping")).toBeInTheDocument();
		});

		it("checkbox is unchecked for incomplete todos", async () => {
			const todo = createTodo({ completed: false });
			const screen = await render(<TodoItem todo={todo} />);

			const checkbox = screen.getByRole("checkbox");
			await expect.element(checkbox).not.toBeChecked();
		});

		it("checkbox is checked for completed todos", async () => {
			const todo = createTodo({ completed: true });
			const screen = await render(<TodoItem todo={todo} />);

			const checkbox = screen.getByRole("checkbox");
			await expect.element(checkbox).toBeChecked();
		});

		it("displays the delete button", async () => {
			const todo = createTodo();
			const screen = await render(<TodoItem todo={todo} />);

			await expect.element(screen.getByRole("button")).toBeInTheDocument();
		});
	});

	describe("User interaction", () => {
		it("calls toggle mutation when checkbox is clicked", async () => {
			const todo = createTodo({ id: 5 });
			const screen = await render(<TodoItem todo={todo} />);

			await userEvent.click(screen.getByRole("checkbox"));

			expect(mockToggleMutate).toHaveBeenCalledWith({ data: { todoId: 5 } });
		});

		it("calls delete mutation when delete button is clicked", async () => {
			const todo = createTodo({ id: 10 });
			const screen = await render(<TodoItem todo={todo} />);

			await userEvent.click(screen.getByRole("button"));

			expect(mockDeleteMutate).toHaveBeenCalledWith({ data: { todoId: 10 } });
		});
	});

	describe("Loading state", () => {
		it("disables checkbox during toggle processing", async () => {
			mockToggleIsPending = true;
			const todo = createTodo();
			const screen = await render(<TodoItem todo={todo} />);

			await expect.element(screen.getByRole("checkbox")).toBeDisabled();
		});

		it("disables delete button during delete processing", async () => {
			mockDeleteIsPending = true;
			const todo = createTodo();
			const screen = await render(<TodoItem todo={todo} />);

			await expect.element(screen.getByRole("button")).toBeDisabled();
		});
	});
});
