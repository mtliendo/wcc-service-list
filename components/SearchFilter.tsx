"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchFilter({
  value,
  onChange,
  placeholder = "Search by name or service…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-full border-border/70 bg-card pl-11 text-base shadow-sm focus-visible:ring-primary/30"
      />
    </div>
  );
}
