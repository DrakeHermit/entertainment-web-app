import { integer, text, timestamp, pgTable, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: text().notNull().unique(),
    password: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
    jwt_token: text(),
});

export const movies = pgTable('movies', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    backdrop_path: text().notNull(),
    release_date: timestamp().notNull(),
    rating: real().notNull(),
});

export const tvSeries = pgTable('tvSeries', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    backdrop_path: text().notNull(),
    first_air_date: timestamp().notNull(),
    rating: real().notNull(),
});