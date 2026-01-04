import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useId } from "react";
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
import { useSignUp } from "@/services/auth/mutations";

export const Route = createFileRoute("/sign-up")({
	component: SignUpPage,
});

const signUpSchema = z.object({
	name: z.string().min(1, "名前を入力してください"),
	email: z.string().min(1, "メールアドレスを入力してください").email("有効なメールアドレスを入力してください"),
	password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

function SignUpPage() {
	const formId = useId();
	const signUpMutation = useSignUp();

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
			signUpMutation.mutate(value);
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
						{signUpMutation.error && (
							<div className="rounded-md bg-destructive/10 p-4">
								<p className="text-sm text-destructive">{signUpMutation.error.message}</p>
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

						<Button type="submit" disabled={signUpMutation.isPending} className="w-full">
							{signUpMutation.isPending ? "処理中..." : "サインアップ"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
