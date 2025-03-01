import { db, tenantTable, userTable } from '@dst/db';
import { eq, isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sq = db
      .select({ id: userTable.id, nickname: userTable.nickname, tenantId: userTable.tenantId })
      .from(userTable)
      .leftJoin(tenantTable, eq(userTable.tenantId, tenantTable.id))
      .where(isNull(userTable.deletedAt))
      .as('sq');

    const tenantsWithUsers = await db
      .select({
        tenantId: tenantTable.id,
        tenantName: tenantTable.name,
        userId: sq.id,
        nickname: sq.nickname,
      })
      .from(tenantTable)
      .leftJoin(sq, eq(sq.tenantId, tenantTable.id))
      .where(isNull(tenantTable.deletedAt));

    return NextResponse.json({ data: tenantsWithUsers });
  } catch (_err) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
