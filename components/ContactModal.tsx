"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactFormSchema = z.object({
  senderName: z.string().min(1, "Please share your name"),
  senderEmail: z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Tell them a bit more about what you need"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactModal({
  memberId,
  memberName,
  open,
  onOpenChange,
}: {
  memberId: string;
  memberName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        setStatus("idle");
        reset();
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [open, reset]);

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, ...values }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="size-12 text-secondary" />
            <DialogTitle className="font-display text-2xl">Message sent!</DialogTitle>
            <DialogDescription className="text-base">
              They&apos;ll be in touch soon.
            </DialogDescription>
            <Button
              variant="outline"
              className="mt-2 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Contact {memberName.split(" ")[0]}
              </DialogTitle>
              <DialogDescription>
                Send a message through the WCC directory — your email stays
                private until you choose to share it.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="senderName">Your Name</Label>
                <Input id="senderName" {...register("senderName")} />
                {errors.senderName ? (
                  <p className="text-xs text-destructive">{errors.senderName.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="senderEmail">Your Email</Label>
                <Input id="senderEmail" type="email" {...register("senderEmail")} />
                {errors.senderEmail ? (
                  <p className="text-xs text-destructive">{errors.senderEmail.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder={`Hi ${memberName.split(" ")[0]}, I found you on the WCC directory and...`}
                  {...register("message")}
                />
                {errors.message ? (
                  <p className="text-xs text-destructive">{errors.message.message}</p>
                ) : null}
              </div>

              {status === "error" ? (
                <p className="text-sm text-destructive">
                  Something went wrong sending your message. Please try again.
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-full sm:w-auto"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
