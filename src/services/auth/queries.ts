import { queryOptions } from "@tanstack/react-query";
import { getUserSession } from "@/middleware/auth";

export const authKeys = {
	all: ["auth"] as const,
};

export function getUserSessionOptions() {
	return queryOptions({
		queryKey: [...authKeys.all],
		queryFn: getUserSession,
	});
}
