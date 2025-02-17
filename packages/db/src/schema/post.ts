import { relations } from 'drizzle-orm';
import { boolean, index, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { userTable } from './user';

export const postTable = pgTable(
  'post',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    senderId: integer().notNull(),
    receiverId: integer().notNull(),
    content: varchar({ length: 1000 }).notNull(),
    createdAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow().notNull(),
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
