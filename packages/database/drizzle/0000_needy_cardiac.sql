CREATE TABLE "Author" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"isbn" text,
	"year" integer,
	"authorId" integer NOT NULL,
	CONSTRAINT "Books_isbn_unique" UNIQUE("isbn")
);
--> statement-breakpoint
ALTER TABLE "Books" ADD CONSTRAINT "Books_authorId_Author_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."Author"("id") ON DELETE no action ON UPDATE no action;