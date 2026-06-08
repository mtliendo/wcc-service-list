import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema";
import { MemberForm } from "@/components/admin/MemberForm";
import type { FullMember } from "@/types/directory";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [row] = await db.select().from(members).where(eq(members.id, id)).limit(1);
  if (!row) notFound();

  const member: FullMember = { ...row, createdAt: row.createdAt.toISOString() };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-foreground">Edit {member.name}</h1>
        <p className="text-sm text-muted-foreground">
          Update their details below — changes go live immediately for approved
          members.
        </p>
      </div>
      <MemberForm member={member} />
    </div>
  );
}
