import { db, tenantTable, userTable } from '@dst/db';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tenantsWithUsers = await db
      .select({
        tenantName: tenantTable.name,
        userId: userTable.id,
        userEmail: userTable.email,
        userNickname: userTable.nickname,
        userCreatedAt: userTable.createdAt,
        userRole: userTable.role,
      })
      .from(tenantTable)
      .leftJoin(userTable, eq(userTable.tenantId, tenantTable.id));

    return NextResponse.json({ data: tenantsWithUsers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
