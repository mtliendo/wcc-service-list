"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { getThumbnailUrl } from "@/lib/blob";
import { CATEGORIES } from "@/types/directory";
import type { FullMember } from "@/types/directory";
import { createMember, updateMember, uploadMemberPhoto } from "@/app/(admin)/admin/actions";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["babysitting", "pet_sitting", "businesses"]),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  services: z.string().optional(),
  availability: z.string().optional(),
  rate: z.string().optional(),
  cprCertified: z.boolean(),
  hasBabysitterCertificate: z.boolean(),
  businessName: z.string().optional(),
  website: z.string().optional(),
  imageUrl: z.string().optional(),
  approved: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function MemberForm({ member }: { member?: FullMember }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.name ?? "",
      category: (member?.category as FormValues["category"]) ?? "babysitting",
      email: member?.email ?? "",
      phone: member?.phone ?? "",
      bio: member?.bio ?? "",
      services: member?.services ?? "",
      availability: member?.availability ?? "",
      rate: member?.rate ?? "",
      cprCertified: member?.cprCertified ?? false,
      hasBabysitterCertificate: member?.hasBabysitterCertificate ?? false,
      businessName: member?.businessName ?? "",
      website: member?.website ?? "",
      imageUrl: member?.imageUrl ?? "",
      approved: member?.approved ?? true,
    },
  });

  const category = watch("category");
  const imageUrl = watch("imageUrl");
  const name = watch("name");
  const showRate = category === "babysitting" || category === "pet_sitting";
  const showCertFields = category === "babysitting";
  const showBusinessFields = category === "businesses";

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadMemberPhoto(formData);
      setValue("imageUrl", url, { shouldDirty: true });
    } catch {
      toast.error("Image upload failed. Check your Vercel Blob configuration.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      if (member) {
        await updateMember(member.id, values);
      } else {
        await createMember(values);
      }
      toast.success(member ? "Member updated" : "Member added");
      router.push("/admin");
    } catch {
      toast.error("Something went wrong saving this member.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card className="flex flex-col gap-5 border-border/70 bg-card p-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border-2 border-background ring-2 ring-primary/15">
            {imageUrl ? (
              <AvatarImage src={getThumbnailUrl(imageUrl)} alt={name || "Member"} />
            ) : null}
            <AvatarFallback className="bg-secondary text-secondary-foreground font-display text-lg">
              {(name || "?").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image" className="cursor-pointer">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/40">
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UploadCloud className="size-4" />
                )}
                {imageUrl ? "Replace photo" : "Upload photo"}
              </span>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
                disabled={uploading}
              />
            </Label>
            {imageUrl ? (
              <button
                type="button"
                onClick={() => setValue("imageUrl", "", { shouldDirty: true })}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
              >
                <X className="size-3" />
                Remove photo
              </button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Optional — initials avatar will show as a fallback.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name")} />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Category *</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...register("phone")} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={3} {...register("bio")} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="services">Services</Label>
            <Textarea
              id="services"
              rows={2}
              placeholder="e.g. Evening & weekend babysitting, light housekeeping"
              {...register("services")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="availability">Availability</Label>
            <Textarea
              id="availability"
              rows={2}
              placeholder="e.g. Weeknights after 5pm, weekends"
              {...register("availability")}
            />
          </div>
        </div>

        {showRate ? (
          <div className="flex flex-col gap-1.5 sm:max-w-xs">
            <Label htmlFor="rate">Rate</Label>
            <Input id="rate" placeholder="e.g. $15/hr" {...register("rate")} />
          </div>
        ) : null}

        {showCertFields ? (
          <div className="grid gap-4 rounded-2xl border border-border/60 bg-muted/40 p-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="cprCertified"
              render={({ field }) => (
                <label className="flex items-center justify-between gap-3 rounded-xl bg-card px-4 py-3">
                  <span className="text-sm font-medium text-foreground">
                    CPR Certified
                  </span>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </label>
              )}
            />
            <Controller
              control={control}
              name="hasBabysitterCertificate"
              render={({ field }) => (
                <label className="flex items-center justify-between gap-3 rounded-xl bg-card px-4 py-3">
                  <span className="text-sm font-medium text-foreground">
                    Babysitter Certificate
                  </span>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </label>
              )}
            />
          </div>
        ) : null}

        {showBusinessFields ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" {...register("businessName")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://"
                {...register("website")}
              />
            </div>
          </div>
        ) : null}

        <Controller
          control={control}
          name="approved"
          render={({ field }) => (
            <label className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
              <span className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Approved</span>
                <span className="text-xs text-muted-foreground">
                  Approved members are visible in the public directory.
                </span>
              </span>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </label>
          )}
        />
      </Card>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-full px-6"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {member ? "Save changes" : "Add member"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="rounded-full"
          onClick={() => router.push("/admin")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
