import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { lower } from '../utils/lower';
import { postTable } from './post';
import { tenantTable } from './tenant';

export const userRole = pgEnum('user_role', ['admin', 'tenant', 'customer']);

export const userTable = pgTable(
  'user',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    tenantId: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    nickname: varchar({ length: 255 }).notNull(),
    lastLoginAt: timestamp({ mode: 'string', withTimezone: true }),
    createdAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: 'string', withTimezone: true }),
    deletedAt: timestamp({ mode: 'string', withTimezone: true }),
    role: userRole().default('customer').notNull(),
    fcmToken: varchar({ length: 255 }),
  },
  () => [userEmailIndex],
);

const userEmailIndex = uniqueIndex('user_email_idx').on(lower(userTable.email));

export const userRelations = relations(userTable, ({ one, many }) => ({
  tenant: one(tenantTable, {
    fields: [userTable.tenantId],
    references: [tenantTable.id],
  }),
  posts: many(postTable),
}));
