import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	beforeLoad: async ({ context }) => {
		if (context.userSession) {
			throw redirect({ to: "/todos" });
		}
	},
	component: App,
});

function App() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-4">
			<div className="text-center space-y-6 max-w-md">
				<div className="flex justify-center">
					<CheckCircle2 className="h-16 w-16 text-primary" />
				</div>
				<h1 className="text-4xl font-bold">Todo App</h1>
				<p className="text-muted-foreground">Simple Todo Management App</p>
				<div className="pt-4 flex gap-3 justify-center">
					<Button asChild variant="outline" size="lg">
						<Link to="/sign-in">Login</Link>
					</Button>
					<Button asChild size="lg">
						<Link to="/sign-up">Sign Up</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
