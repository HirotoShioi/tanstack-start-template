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
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/sign-up")({
	component: SignUpPage,
});

function SignUpPage() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		const { error } = await authClient.signUp.email(
			{
				email,
				password,
				name,
				callbackURL: "/",
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
			setError(error.message || "サインアップに失敗しました");
		}
		setIsLoading(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">アカウントを作成</CardTitle>
					<CardDescription>
						すでにアカウントをお持ちですか？{" "}
						<Link to="/sign-in" className="text-primary hover:underline">
							サインイン
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
									htmlFor={nameId}
									className="block text-sm font-medium"
								>
									名前
								</label>
								<Input
									id={nameId}
									name="name"
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="名前を入力"
								/>
							</div>

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
									autoComplete="new-password"
									required
									minLength={8}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="パスワードを入力（8文字以上）"
								/>
							</div>
						</div>

						<Button type="submit" disabled={isLoading} className="w-full">
							{isLoading ? "処理中..." : "サインアップ"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
