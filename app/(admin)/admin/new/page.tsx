import { MemberForm } from "@/components/admin/MemberForm";

export default function NewMemberPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-foreground">Add a member</h1>
        <p className="text-sm text-muted-foreground">
          They&apos;ll appear in the public directory once approved.
        </p>
      </div>
      <MemberForm />
    </div>
  );
}
