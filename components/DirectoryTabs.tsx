"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, type Category } from "@/types/directory";

export function DirectoryTabs({
  value,
  onValueChange,
}: {
  value: Category;
  onValueChange: (value: Category) => void;
}) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as Category)}
    >
      <TabsList className="h-auto w-full gap-1 rounded-full border border-border/70 bg-card/70 p-1.5 sm:w-fit">
        {CATEGORIES.map((category) => (
          <TabsTrigger
            key={category.value}
            value={category.value}
            className="h-10 flex-1 rounded-full px-5 text-sm font-medium text-foreground/65 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-md sm:flex-none"
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
