import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { z } from "zod";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  memberId: z.string().uuid(),
  senderName: z.string().min(1).max(120),
  senderEmail: z.string().email(),
  message: z.string().min(1).max(2000),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact request" },
      { status: 400 }
    );
  }

  const { memberId, senderName, senderEmail, message } = parsed.data;

  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.id, memberId))
    .limit(1);

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  await resend.emails.send({
    from: "WCC Community Directory <directory@windsorcrestclub.org>",
    to: member.email,
    replyTo: senderEmail,
    subject: `New message from ${senderName} via the WCC Directory`,
    text: `${senderName} (${senderEmail}) sent you a message through the Windsor Crest Club directory:\n\n${message}\n\nReply directly to this email to respond to ${senderName}.`,
  });

  return NextResponse.json({ success: true });
}
