import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export type SignInInput = {
	email: string;
	password: string;
	rememberMe: boolean;
};

export type SignUpInput = {
	name: string;
	email: string;
	password: string;
};

export function useSignIn() {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (input: SignInInput) => {
			const { data, error } = await authClient.signIn.email({
				email: input.email,
				password: input.password,
				callbackURL: "/",
				rememberMe: input.rememberMe,
			});

			if (error) {
				throw new Error(error.message || "サインインに失敗しました");
			}

			return data;
		},
		onSuccess: () => {
			navigate({ to: "/" });
		},
	});
}

export function useSignUp() {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (input: SignUpInput) => {
			const { data, error } = await authClient.signUp.email({
				email: input.email,
				password: input.password,
				name: input.name,
				callbackURL: "/",
			});

			if (error) {
				throw new Error(error.message || "サインアップに失敗しました");
			}

			return data;
		},
		onSuccess: () => {
			navigate({ to: "/" });
		},
	});
}
