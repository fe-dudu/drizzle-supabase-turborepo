CREATE INDEX "post_senderId_idx" ON "post" USING btree ("senderId");--> statement-breakpoint
CREATE INDEX "post_receiverId_idx" ON "post" USING btree ("receiverId");--> statement-breakpoint
CREATE INDEX "user_tenantId_idx" ON "user" USING btree ("tenantId");