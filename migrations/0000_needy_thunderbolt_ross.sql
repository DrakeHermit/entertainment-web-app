CREATE TABLE "bookmarked_movies" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bookmarked_movies_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"movie_id" integer NOT NULL,
	"bookmarked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookmarked_tv_series" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bookmarked_tv_series_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"series_id" integer NOT NULL,
	"bookmarked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "movies_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tmdb_id" integer NOT NULL,
	"title" text NOT NULL,
	"backdrop_path" text NOT NULL,
	"release_date" timestamp NOT NULL,
	"rating" real NOT NULL,
	CONSTRAINT "movies_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE "tv_series" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tv_series_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tmdb_id" integer NOT NULL,
	"name" text NOT NULL,
	"backdrop_path" text NOT NULL,
	"first_air_date" timestamp NOT NULL,
	"rating" real NOT NULL,
	CONSTRAINT "tv_series_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" text NOT NULL,
	"username" text,
	"password" text NOT NULL,
	"avatar_url" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"jwt_token" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookmarked_movies" ADD CONSTRAINT "bookmarked_movies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarked_movies" ADD CONSTRAINT "bookmarked_movies_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarked_tv_series" ADD CONSTRAINT "bookmarked_tv_series_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarked_tv_series" ADD CONSTRAINT "bookmarked_tv_series_series_id_tv_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."tv_series"("id") ON DELETE cascade ON UPDATE no action;