import Link from "next/link";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { AdminMemberTable } from "@/components/admin/AdminMemberTable";
import type { FullMember } from "@/types/directory";

export default async function AdminPage() {
  const rows = await db
    .select()
    .from(members)
    .orderBy(desc(members.createdAt));

  const allMembers: FullMember[] = rows.map((member) => ({
    ...member,
    createdAt: member.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Members</h1>
          <p className="text-sm text-muted-foreground">
            {allMembers.length} {allMembers.length === 1 ? "member" : "members"} in
            the directory
          </p>
        </div>
        <Button render={<Link href="/admin/new" />} className="rounded-full">
          <Plus className="size-4" />
          Add Member
        </Button>
      </div>

      <AdminMemberTable members={allMembers} />
    </div>
  );
}
