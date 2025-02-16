import { db, postTable, userTable } from '@dst/db';
import { eq, or, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const usersWithPosts = await db
      .select({
        userId: userTable.id,
        userNickname: userTable.nickname,
        posts: sql<string>`json_agg(json_build_object(
          'id', ${postTable.id},
          'content', ${postTable.content},
          'type', CASE 
            WHEN ${postTable.senderId} = ${userTable.id} THEN 'sent'
            WHEN ${postTable.receiverId} = ${userTable.id} THEN 'received'
          END
        ))`.as('posts'),
      })
      .from(userTable)
      .leftJoin(postTable, or(eq(postTable.senderId, userTable.id), eq(postTable.receiverId, userTable.id)))
      .groupBy(userTable.id);

    return NextResponse.json({ data: usersWithPosts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
