CREATE TYPE "public"."user_role" AS ENUM('admin', 'tenant', 'customer');--> statement-breakpoint
CREATE TABLE "post" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"senderId" integer NOT NULL,
	"receiverId" integer NOT NULL,
	"content" varchar(1000) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone,
	"deletedAt" timestamp with time zone,
	"read" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tenant" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tenant_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"deletedAt" timestamp with time zone,
	CONSTRAINT "tenant_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tenantId" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"nickname" varchar(255) NOT NULL,
	"lastLoginAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now(),
	"deletedAt" timestamp with time zone,
	"role" "user_role" NOT NULL,
	"fcmToken" varchar(255),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "post_senderId_idx" ON "post" USING btree ("senderId");--> statement-breakpoint
CREATE INDEX "post_receiverId_idx" ON "post" USING btree ("receiverId");--> statement-breakpoint
CREATE INDEX "user_tenantId_idx" ON "user" USING btree ("tenantId");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "user" USING btree (lower("email"));