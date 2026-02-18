import { integer, text, timestamp, pgTable, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: text().notNull().unique(),
    username: text(),
    password: text().notNull(),
    avatar_url: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
    jwt_token: text(),
});

export const movies = pgTable('movies', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tmdb_id: integer().notNull().unique(), 
  title: text().notNull(),
  backdrop_path: text().notNull(),
  release_date: timestamp().notNull(),
  rating: real().notNull(),
});

export const tvSeries = pgTable('tv_series', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tmdb_id: integer().notNull().unique(),
  name: text().notNull(),
  backdrop_path: text().notNull(),
  first_air_date: timestamp().notNull(),
  rating: real().notNull(),
});

export const bookmarkedMovies = pgTable('bookmarked_movies', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer().notNull().references(() => users.id, { onDelete: 'cascade' }),
  movie_id: integer().notNull().references(() => movies.id, { onDelete: 'cascade' }),
  bookmarked_at: timestamp().notNull().defaultNow(),
});

export const bookmarkedTvSeries = pgTable('bookmarked_tv_series', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer().notNull().references(() => users.id, { onDelete: 'cascade' }),
  series_id: integer().notNull().references(() => tvSeries.id, { onDelete: 'cascade' }),
  bookmarked_at: timestamp().notNull().defaultNow(),
});

export const movieComments = pgTable('movie_comments', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer().notNull().references(() => users.id, { onDelete: 'cascade' }),
  movie_id: integer().notNull().references(() => movies.id, { onDelete: 'cascade' }),
  content: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const tvSeriesComments = pgTable('tv_series_comments', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer().notNull().references(() => users.id, { onDelete: 'cascade' }),
  series_id: integer().notNull().references(() => tvSeries.id, { onDelete: 'cascade' }),
  content: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});