import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getUserSession } from "@/services/auth/auth.server-functions";

export const authMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const userSession = await getUserSession();
		if (!userSession) {
			throw redirect({ to: "/" });
		}
		return next({ context: { userSession } });
	},
);
