import { db, postTable, userTable } from '@dst/db';
import { aliasedTable, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sender = aliasedTable(userTable, 'sender');
    const receiver = aliasedTable(userTable, 'receiver');

    const usersWithPosts = await db
      .select({
        postId: postTable.id,
        content: postTable.content,
        sender: sql<string>`json_build_object(
          'id', sender.id,
          'nickname', sender.nickname
        )`.as('sender'),
        receiver: sql<string>`json_build_object(
          'id', receiver.id,
          'nickname', receiver.nickname
        )`.as('receiver'),
      })
      .from(postTable)
      .innerJoin(sender, eq(postTable.senderId, sender.id))
      .innerJoin(receiver, eq(postTable.receiverId, receiver.id));

    return NextResponse.json({ data: usersWithPosts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
