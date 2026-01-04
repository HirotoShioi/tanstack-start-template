import { queryOptions } from "@tanstack/react-query";
import { getTodos } from "./functions";

export const todoKeys = {
    all: ["todos"] as const,
}

export function getTodosOptions() {
    return queryOptions({
        queryKey: [...todoKeys.all],
        queryFn: () => getTodos(),
        initialData: [],
    });
}