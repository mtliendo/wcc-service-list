"use client";

import { ShieldCheck, HeartHandshake, Clock, Globe, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getThumbnailUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import type { PublicMember } from "@/types/directory";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function MemberCard({
  member,
  onContact,
}: {
  member: PublicMember;
  onContact: (member: PublicMember) => void;
}) {
  const isBabysitting = member.category === "babysitting";
  const isBusiness = member.category === "businesses";
  const showRate = (isBabysitting || member.category === "pet_sitting") && member.rate;

  return (
    <Card
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden border-border/70 bg-card p-5 transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_oklch(0.32_0.035_50_/_0.35)]"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/40 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-0"
      />

      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 shrink-0 border-2 border-background ring-2 ring-primary/15">
          {member.imageUrl ? (
            <AvatarImage
              src={getThumbnailUrl(member.imageUrl)}
              alt={member.name}
            />
          ) : null}
          <AvatarFallback className="bg-secondary text-secondary-foreground font-display text-lg">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="truncate font-display text-xl leading-tight text-foreground">
            {isBusiness && member.businessName ? member.businessName : member.name}
          </h3>
          {isBusiness && member.businessName ? (
            <p className="text-sm text-muted-foreground">by {member.name}</p>
          ) : null}
          {isBabysitting ? (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {member.cprCertified ? (
                <Badge
                  variant="outline"
                  className="gap-1 border-secondary/40 bg-secondary/10 text-secondary-foreground/80 [&>svg]:text-secondary"
                >
                  <HeartHandshake className="size-3" />
                  CPR Certified
                </Badge>
              ) : null}
              {member.hasBabysitterCertificate ? (
                <Badge
                  variant="outline"
                  className="gap-1 border-primary/30 bg-primary/10 text-primary [&>svg]:text-primary"
                >
                  <ShieldCheck className="size-3" />
                  Certified Babysitter
                </Badge>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {member.bio ? (
        <p className="line-clamp-2 text-sm text-muted-foreground">{member.bio}</p>
      ) : null}

      <div className="flex flex-col gap-1.5 text-sm">
        {member.services ? (
          <p className="text-foreground/85">
            <span className="font-medium text-foreground">Offers:</span>{" "}
            {member.services}
          </p>
        ) : null}
        {member.availability ? (
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-3.5 shrink-0 text-secondary" />
            {member.availability}
          </p>
        ) : null}
        {showRate ? (
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <Wallet className="size-3.5 shrink-0 text-secondary" />
            {member.rate}
          </p>
        ) : null}
        {isBusiness && member.website ? (
          <a
            href={member.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-secondary underline-offset-4 hover:underline"
          >
            <Globe className="size-3.5 shrink-0" />
            {member.website.replace(/^https?:\/\//, "")}
          </a>
        ) : null}
      </div>

      <Button
        onClick={() => onContact(member)}
        className="mt-auto w-full rounded-full"
      >
        Contact {member.name.split(" ")[0]}
      </Button>
    </Card>
  );
}
