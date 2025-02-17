import { relations } from 'drizzle-orm';
import { boolean, index, integer, pgEnum, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { lower } from './utils/lower';

export const tenantTable = pgTable('tenant', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
  deletedAt: timestamp({ mode: 'string', withTimezone: true }),
});

export const tenantRelations = relations(tenantTable, ({ many }) => ({
  users: many(userTable),
}));

export const userRole = pgEnum('user_role', ['admin', 'tenant', 'customer']);

export const userTable = pgTable(
  'user',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    tenantId: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    nickname: varchar({ length: 255 }).notNull(),
    lastLoginAt: timestamp({ mode: 'string', withTimezone: true }),
    createdAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
    deletedAt: timestamp({ mode: 'string', withTimezone: true }),
    role: userRole().notNull(),
    fcmToken: varchar({ length: 255 }),
  },
  (table) => [index('user_tenantId_idx').on(table.tenantId), uniqueIndex('emailUniqueIndex').on(lower(table.email))],
);

export const userRelations = relations(userTable, ({ one, many }) => ({
  tenant: one(tenantTable, {
    fields: [userTable.tenantId],
    references: [tenantTable.id],
  }),
  posts: many(postTable),
}));

export const postTable = pgTable(
  'post',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    senderId: integer().notNull(),
    receiverId: integer().notNull(),
    content: varchar({ length: 1000 }).notNull(),
    createdAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
    updatedAt: timestamp({ mode: 'string', withTimezone: true }),
    deletedAt: timestamp({ mode: 'string', withTimezone: true }),
    read: boolean().default(false),
  },
  (table) => [index('post_senderId_idx').on(table.senderId), index('post_receiverId_idx').on(table.receiverId)],
);

export const postRelations = relations(postTable, ({ one }) => ({
  sender: one(userTable, {
    fields: [postTable.senderId],
    references: [userTable.id],
  }),
  receiver: one(userTable, {
    fields: [postTable.receiverId],
    references: [userTable.id],
  }),
}));
