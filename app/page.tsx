"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, PawPrint, Wrench } from "lucide-react";
import { DirectoryTabs } from "@/components/DirectoryTabs";
import { MemberCard } from "@/components/MemberCard";
import { SearchFilter } from "@/components/SearchFilter";
import { ContactModal } from "@/components/ContactModal";
import { ChatWidget } from "@/components/ChatWidget";
import { Skeleton } from "@/components/ui/skeleton";
import { useMembers } from "@/hooks/useMembers";
import type { Category, PublicMember } from "@/types/directory";

const EMPTY_COPY: Record<Category, { icon: React.ReactNode; text: string }> = {
  babysitting: {
    icon: <Home className="size-6 text-primary" />,
    text: "No babysitters listed yet — check back soon, or ask the chat helper.",
  },
  pet_sitting: {
    icon: <PawPrint className="size-6 text-primary" />,
    text: "No pet sitters listed yet — check back soon, or ask the chat helper.",
  },
  businesses: {
    icon: <Wrench className="size-6 text-primary" />,
    text: "No local businesses listed yet — check back soon, or ask the chat helper.",
  },
};

export default function HomePage() {
  const [category, setCategory] = useState<Category>("babysitting");
  const [search, setSearch] = useState("");
  const [contactTarget, setContactTarget] = useState<PublicMember | null>(null);

  const { data: members, isLoading } = useMembers(category);

  const filtered = useMemo(() => {
    if (!members) return [];
    const query = search.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) =>
      [member.name, member.services, member.businessName, member.bio]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(query))
    );
  }, [members, search]);

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="bg-grain relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-accent/35 via-background to-background">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-5 px-6 py-16 sm:py-20">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/80 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-primary"
          >
            Windsor Crest Club · Davenport, Iowa
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="max-w-2xl font-display text-4xl leading-[1.08] text-foreground sm:text-5xl md:text-6xl"
          >
            Trusted neighbors,
            <br />
            <span className="text-primary">right around the corner.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            A community-built directory of babysitters, pet sitters, and local
            businesses recommended by your Windsor Crest Club neighbors. Find
            someone you can trust — because they&apos;re already part of the
            neighborhood.
          </motion.p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <DirectoryTabs value={category} onValueChange={setCategory} />
          <div className="sm:w-72">
            <SearchFilter value={search} onChange={setSearch} />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-64 rounded-2xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border/70 bg-card/60 px-6 py-16 text-center">
                {EMPTY_COPY[category].icon}
                <p className="max-w-sm text-muted-foreground">
                  {search
                    ? `No matches for "${search}" in this category yet.`
                    : EMPTY_COPY[category].text}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                  >
                    <MemberCard member={member} onContact={setContactTarget} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-border/60 bg-card/40 py-8 text-center text-sm text-muted-foreground">
        <p>
          Windsor Crest Club · Davenport, Iowa — built by neighbors, for
          neighbors.
        </p>
      </footer>

      <ChatWidget />

      {contactTarget ? (
        <ContactModal
          memberId={contactTarget.id}
          memberName={contactTarget.name}
          open={!!contactTarget}
          onOpenChange={(open) => {
            if (!open) setContactTarget(null);
          }}
        />
      ) : null}
    </div>
  );
}
