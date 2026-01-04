import { QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { render as renderUI } from "vitest-browser-react";
import { queryClient } from "@/lib/query-client";

export function render(ui: React.ReactElement) {
	queryClient.setDefaultOptions({
		queries: {
			retry: false,
		},
	});
	queryClient.clear();
	return renderUI(ui, {
		wrapper: ({ children }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	});
}
