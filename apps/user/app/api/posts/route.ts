import { db, postTable, userTable } from '@dst/db';
import createClient from '@dst/supabase/createServerClient';
import { eq, isNull, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const user = db
      .select({
        id: userTable.id,
        nickname: userTable.nickname,
      })
      .from(userTable)
      .where(isNull(userTable.deletedAt));
    const sender = user.as('sender');
    const receiver = user.as('receiver');

    const usersWithPosts = await db
      .select({
        postId: postTable.id,
        content: postTable.content,
        sender: sql<string>`json_build_object(
          'id', ${sender.id},
          'nickname', ${sender.nickname}
        )`.as('sender'),
        receiver: sql<string>`json_build_object(
          'id', ${receiver.id},
          'nickname', ${receiver.nickname}
        )`.as('receiver'),
      })
      .from(postTable)
      .innerJoin(sender, eq(postTable.senderId, sender.id))
      .innerJoin(receiver, eq(postTable.receiverId, receiver.id))
      .where(isNull(postTable.deletedAt));

    return NextResponse.json({ data: usersWithPosts });
  } catch (_err) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
