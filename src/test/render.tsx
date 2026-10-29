import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { render as renderUI } from "vitest-browser-react";

export function render(ui: React.ReactElement) {
	// Fresh client per render so tests never share cached data
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	return renderUI(ui, {
		wrapper: ({ children }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	});
}
