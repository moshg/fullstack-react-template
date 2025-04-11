CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "app";
--> statement-breakpoint
CREATE ROLE "app_user" WITH NOINHERIT;--> statement-breakpoint
CREATE ROLE "auth_user" WITH NOINHERIT;--> statement-breakpoint
ALTER TABLE "public"."account" SET SCHEMA "auth";
--> statement-breakpoint
ALTER TABLE "public"."session" SET SCHEMA "auth";
--> statement-breakpoint
ALTER TABLE "public"."user" SET SCHEMA "auth";
--> statement-breakpoint
ALTER TABLE "public"."verification" SET SCHEMA "auth";
--> statement-breakpoint
ALTER TABLE "public"."books" SET SCHEMA "app";
--> statement-breakpoint
ALTER TABLE "public"."books_to_categories" SET SCHEMA "app";
--> statement-breakpoint
ALTER TABLE "public"."categories" SET SCHEMA "app";

-- Everything below this line was handwritten
--> statement-breakpoint
GRANT USAGE ON SCHEMA "app" TO "app_user";
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "app" TO "app_user";
--> statement-breakpoint
GRANT USAGE ON SCHEMA "auth" TO "auth_user";
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "auth" TO "auth_user";
