import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/sign-in")({
	component: SignInPage,
});

function SignInPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [rememberMe, setRememberMe] = useState(true);

	const emailId = useId();
	const passwordId = useId();
	const rememberMeId = useId();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		const { error } = await authClient.signIn.email(
			{
				email,
				password,
				callbackURL: "/",
				rememberMe,
			},
			{
				onRequest: () => {
					setIsLoading(true);
				},
				onSuccess: () => {
					navigate({ to: "/" });
				},
				onError: (ctx) => {
					setError(ctx.error.message);
					setIsLoading(false);
				},
			},
		);

		if (error) {
			setError(error.message || "サインインに失敗しました");
		}
		setIsLoading(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">サインイン</CardTitle>
					<CardDescription>
						アカウントをお持ちでないですか？{" "}
						<Link to="/sign-up" className="text-primary hover:underline">
							サインアップ
						</Link>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-6" onSubmit={handleSubmit}>
						{error && (
							<div className="rounded-md bg-destructive/10 p-4">
								<p className="text-sm text-destructive">{error}</p>
							</div>
						)}

						<div className="space-y-4">
							<div className="space-y-2">
								<label
									htmlFor={emailId}
									className="block text-sm font-medium"
								>
									メールアドレス
								</label>
								<Input
									id={emailId}
									name="email"
									type="email"
									autoComplete="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="メールアドレスを入力"
								/>
							</div>

							<div className="space-y-2">
								<label
									htmlFor={passwordId}
									className="block text-sm font-medium"
								>
									パスワード
								</label>
								<Input
									id={passwordId}
									name="password"
									type="password"
									autoComplete="current-password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="パスワードを入力"
								/>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Checkbox
								id={rememberMeId}
								checked={rememberMe}
								onCheckedChange={(checked) =>
									setRememberMe(checked === true)
								}
							/>
							<label
								htmlFor={rememberMeId}
								className="text-sm cursor-pointer"
							>
								ログイン状態を保持
							</label>
						</div>

						<Button type="submit" disabled={isLoading} className="w-full">
							{isLoading ? "処理中..." : "サインイン"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
