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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@/services/auth/auth.queries";

export const Route = createFileRoute("/sign-in")({
	component: SignInPage,
});

const signInSchema = z.object({
	email: z
		.email("Please enter a valid email address")
		.min(1, "Please enter your email address"),
	password: z.string().min(1, "Please enter your password"),
	rememberMe: z.boolean(),
});

function SignInPage() {
	const formId = useId();
	const signInMutation = useSignIn();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			rememberMe: true,
		},
		validators: {
			onSubmit: signInSchema,
		},
		onSubmit: async ({ value }) => {
			signInMutation.mutate(value);
		},
	});

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Sign In</CardTitle>
					<CardDescription>
						Don't have an account?{" "}
						<Link to="/sign-up" className="text-primary hover:underline">
							Sign up
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
						{signInMutation.error && (
							<div className="rounded-md bg-destructive/10 p-4">
								<p className="text-sm text-destructive">
									{signInMutation.error.message}
								</p>
							</div>
						)}

						<FieldGroup>
							<form.Field name="email">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="email"
												autoComplete="email"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Enter your email"
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
											<FieldLabel htmlFor={field.name}>Password</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="password"
												autoComplete="current-password"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="Enter your password"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>

							<form.Field name="rememberMe">
								{(field) => {
									return (
										<Field orientation="horizontal">
											<Checkbox
												id={field.name}
												name={field.name}
												checked={field.state.value}
												onCheckedChange={(checked) =>
													field.handleChange(checked === true)
												}
											/>
											<FieldLabel
												htmlFor={field.name}
												className="font-normal cursor-pointer"
											>
												Remember me
											</FieldLabel>
										</Field>
									);
								}}
							</form.Field>
						</FieldGroup>

						<Button
							type="submit"
							disabled={signInMutation.isPending}
							className="w-full"
						>
							{signInMutation.isPending ? "Processing..." : "Sign in"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
