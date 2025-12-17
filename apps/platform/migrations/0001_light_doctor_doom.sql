CREATE TABLE "answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"text" text NOT NULL,
	"house" text NOT NULL,
	"score" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "houses" (
	"name" text PRIMARY KEY NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "impersonatedBy" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "displayUsername" text DEFAULT 'not_specified' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "house" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hasCompletedSorting" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_house_houses_name_fk" FOREIGN KEY ("house") REFERENCES "public"."houses"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_house_houses_name_fk" FOREIGN KEY ("house") REFERENCES "public"."houses"("name") ON DELETE no action ON UPDATE no action;