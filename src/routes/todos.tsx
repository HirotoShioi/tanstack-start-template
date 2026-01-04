import { createFileRoute, redirect } from "@tanstack/react-router";
import { getTodosOptions } from "@/services/todos/queries";

export const Route = createFileRoute("/todos")({
	beforeLoad: async ({ context }) => {
		if (!context.userSession) {
			throw redirect({ to: "/" });
		}
        context.queryClient.ensureQueryData(getTodosOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/todos"!</div>;
}
