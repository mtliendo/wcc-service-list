"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema";
import { auth0 } from "@/lib/auth0";

const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["babysitting", "pet_sitting", "businesses"]),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  services: z.string().optional(),
  availability: z.string().optional(),
  rate: z.string().optional(),
  cprCertified: z.boolean().default(false),
  hasBabysitterCertificate: z.boolean().default(false),
  businessName: z.string().optional(),
  website: z.string().optional(),
  imageUrl: z.string().optional(),
  approved: z.boolean().default(true),
});

export type MemberFormInput = z.infer<typeof memberSchema>;

async function requireAdmin() {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login?returnTo=/admin");
}

function toNullable(value: string | undefined) {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export async function uploadMemberPhoto(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return blob.url;
}

export async function createMember(input: MemberFormInput) {
  await requireAdmin();
  const data = memberSchema.parse(input);

  await db.insert(members).values({
    name: data.name,
    category: data.category,
    email: data.email,
    phone: toNullable(data.phone),
    bio: toNullable(data.bio),
    services: toNullable(data.services),
    availability: toNullable(data.availability),
    rate: toNullable(data.rate),
    cprCertified: data.cprCertified,
    hasBabysitterCertificate: data.hasBabysitterCertificate,
    businessName: toNullable(data.businessName),
    website: toNullable(data.website),
    imageUrl: toNullable(data.imageUrl),
    approved: data.approved,
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateMember(id: string, input: MemberFormInput) {
  await requireAdmin();
  const data = memberSchema.parse(input);

  await db
    .update(members)
    .set({
      name: data.name,
      category: data.category,
      email: data.email,
      phone: toNullable(data.phone),
      bio: toNullable(data.bio),
      services: toNullable(data.services),
      availability: toNullable(data.availability),
      rate: toNullable(data.rate),
      cprCertified: data.cprCertified,
      hasBabysitterCertificate: data.hasBabysitterCertificate,
      businessName: toNullable(data.businessName),
      website: toNullable(data.website),
      imageUrl: toNullable(data.imageUrl),
      approved: data.approved,
    })
    .where(eq(members.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteMember(id: string) {
  await requireAdmin();
  await db.delete(members).where(eq(members.id, id));
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function toggleApproved(id: string, approved: boolean) {
  await requireAdmin();
  await db.update(members).set({ approved }).where(eq(members.id, id));
  revalidatePath("/admin");
  revalidatePath("/");
}
