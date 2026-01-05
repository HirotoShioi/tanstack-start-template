import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
	beforeLoad: async ({ context }) => {
		if (!context.userSession) {
			throw redirect({ to: "/" });
		}
	},
  component: Outlet,
})

