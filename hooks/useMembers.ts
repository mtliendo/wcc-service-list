import { useQuery } from "@tanstack/react-query";
import type { Category, PublicMember } from "@/types/directory";

async function fetchMembers(category: Category): Promise<PublicMember[]> {
  const res = await fetch(`/api/members?category=${category}`);
  if (!res.ok) throw new Error("Failed to load directory");
  return res.json();
}

export function useMembers(category: Category) {
  return useQuery({
    queryKey: ["members", category],
    queryFn: () => fetchMembers(category),
  });
}
