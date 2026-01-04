import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useId, useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/sign-up")({
	component: SignUpPage,
});

const signUpSchema = z.object({
	name: z.string().min(1, "名前を入力してください"),
	email: z.string().min(1, "メールアドレスを入力してください").email("有効なメールアドレスを入力してください"),
	password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

function SignUpPage() {
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const formId = useId();

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		validators: {
			onSubmit: signUpSchema,
		},
		onSubmit: async ({ value }) => {
			setError("");
			setIsLoading(true);

			const { error } = await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
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
		},
	});

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
					<form
						id={formId}
						className="space-y-6"
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						{error && (
							<div className="rounded-md bg-destructive/10 p-4">
								<p className="text-sm text-destructive">{error}</p>
							</div>
						)}

						<FieldGroup>
							<form.Field name="name">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>名前</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="text"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="名前を入力"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>

							<form.Field name="email">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>
												メールアドレス
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="email"
												autoComplete="email"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="メールアドレスを入力"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>

							<form.Field name="password">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>パスワード</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="password"
												autoComplete="new-password"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="パスワードを入力（8文字以上）"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
						</FieldGroup>

						<Button type="submit" disabled={isLoading} className="w-full">
							{isLoading ? "処理中..." : "サインアップ"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
