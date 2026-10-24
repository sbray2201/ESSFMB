CREATE TABLE "learners" (
	"id" text PRIMARY KEY,
	"progress" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
