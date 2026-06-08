"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getThumbnailUrl } from "@/lib/cloudinary";
import { CATEGORIES } from "@/types/directory";
import type { FullMember } from "@/types/directory";
import { deleteMember, toggleApproved } from "@/app/(admin)/admin/actions";

const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map((category) => [category.value, category.label])
);

export function AdminMemberTable({ members }: { members: FullMember[] }) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleToggle(member: FullMember, approved: boolean) {
    setPendingId(member.id);
    startTransition(async () => {
      try {
        await toggleApproved(member.id, approved);
        toast.success(
          approved
            ? `${member.name} is now visible in the directory`
            : `${member.name} is now hidden from the directory`
        );
      } catch {
        toast.error("Couldn't update approval status.");
      } finally {
        setPendingId(null);
      }
    });
  }

  function handleDelete(member: FullMember) {
    if (!confirm(`Remove ${member.name} from the directory? This can't be undone.`)) {
      return;
    }
    setPendingId(member.id);
    startTransition(async () => {
      try {
        await deleteMember(member.id);
        toast.success(`${member.name} was removed`);
      } catch {
        toast.error("Couldn't remove this member.");
      } finally {
        setPendingId(null);
      }
    });
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border/70 bg-card/60 px-6 py-16 text-center text-muted-foreground">
        <p>No members yet. Add your first one to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Phone</TableHead>
            <TableHead>Approved</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="hover:bg-muted/30">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    {member.imageUrl ? (
                      <AvatarImage
                        src={getThumbnailUrl(member.imageUrl)}
                        alt={member.name}
                      />
                    ) : null}
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{member.name}</span>
                    {member.businessName ? (
                      <span className="text-xs text-muted-foreground">
                        {member.businessName}
                      </span>
                    ) : null}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="border-border/70 font-normal">
                  {CATEGORY_LABELS[member.category] ?? member.category}
                </Badge>
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                {member.email}
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                {member.phone ?? "—"}
              </TableCell>
              <TableCell>
                <Switch
                  checked={member.approved}
                  disabled={isPending && pendingId === member.id}
                  onCheckedChange={(checked) => handleToggle(member, checked)}
                  aria-label={`Toggle approval for ${member.name}`}
                />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon-sm" className="rounded-full" />
                    }
                  >
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Open actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      render={<Link href={`/admin/${member.id}/edit`} />}
                    >
                      <Pencil className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      disabled={isPending && pendingId === member.id}
                      onClick={() => handleDelete(member)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
