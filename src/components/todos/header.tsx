import { useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

interface HeaderProps {
	email?: string;
}

export function Header({ email }: HeaderProps) {
	const router = useRouter();

	const handleSignOut = async () => {
		await signOut();
		router.invalidate();
	};

	return (
		<header className="border-b">
			<div className="mx-auto flex items-center justify-between h-14 px-2">
				<span className="font-semibold">Todo App</span>
				<div className="flex items-center gap-4">
					<span className="text-sm text-muted-foreground">{email}</span>
					<Button variant="ghost" size="sm" onClick={handleSignOut}>
						<LogOut className="h-4 w-4 mr-1" />
						ログアウト
					</Button>
				</div>
			</div>
		</header>
	);
}
