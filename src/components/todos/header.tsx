import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/services/auth/auth.queries";

interface HeaderProps {
	email?: string;
}

export function Header({ email }: HeaderProps) {
	const signOut = useSignOut();

	return (
		<header className="border-b">
			<div className="mx-auto flex items-center justify-between h-14 px-2">
				<span className="font-semibold">Todo App</span>
				<div className="flex items-center gap-4">
					<span className="text-sm text-muted-foreground">{email}</span>
					<Button variant="ghost" size="sm" onClick={() => signOut.mutate()}>
						<LogOut className="h-4 w-4 mr-1" />
						Logout
					</Button>
				</div>
			</div>
		</header>
	);
}
