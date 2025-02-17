import { relations } from 'drizzle-orm';
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { userTable } from './user';

export const tenantTable = pgTable('tenant', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'string', withTimezone: true }),
  deletedAt: timestamp({ mode: 'string', withTimezone: true }),
});

export const tenantRelations = relations(tenantTable, ({ many }) => ({
  users: many(userTable),
}));
