import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
	id: serial().primaryKey(),
	title: text().notNull(),
	completed: boolean().default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	userId: text("user_id").notNull(),
});
