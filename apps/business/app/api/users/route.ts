import { db, postTable, userTable } from '@dst/db';
import { eq, isNull, or, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sq = db
      .select({
        id: postTable.id,
        content: postTable.content,
        senderId: postTable.senderId,
        receiverId: postTable.receiverId,
      })
      .from(postTable)
      .where(isNull(postTable.deletedAt))
      .as('sq');

    const usersWithPosts = await db
      .select({
        userId: userTable.id,
        userNickname: userTable.nickname,
        posts: sql<string>`json_agg(json_build_object(
          'id', ${sq.id},
          'content', ${sq.content},
          'type', CASE 
            WHEN ${sq.senderId} = ${userTable.id} THEN 'sent'
            WHEN ${sq.receiverId} = ${userTable.id} THEN 'received'
          END
        ))`.as('posts'),
      })
      .from(userTable)
      .leftJoin(sq, or(eq(sq.senderId, userTable.id), eq(sq.receiverId, userTable.id)))
      .where(isNull(userTable.deletedAt))
      .groupBy(userTable.id);

    return NextResponse.json({ data: usersWithPosts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
