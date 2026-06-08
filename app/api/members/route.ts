import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema";
import type { PublicMember } from "@/types/directory";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const conditions = category
    ? and(eq(members.approved, true), eq(members.category, category))
    : eq(members.approved, true);

  const rows = await db.select().from(members).where(conditions);

  const publicMembers: PublicMember[] = rows.map(
    ({ email: _email, phone: _phone, ...member }) => ({
      ...member,
      createdAt: member.createdAt.toISOString(),
    })
  );

  return NextResponse.json(publicMembers);
}
