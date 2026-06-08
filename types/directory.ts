export type Category = "babysitting" | "pet_sitting" | "businesses";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "babysitting", label: "Babysitting" },
  { value: "pet_sitting", label: "Pet Sitting" },
  { value: "businesses", label: "Businesses" },
];

export type PublicMember = {
  id: string;
  name: string;
  category: string;
  bio: string | null;
  services: string | null;
  availability: string | null;
  rate: string | null;
  cprCertified: boolean;
  hasBabysitterCertificate: boolean;
  businessName: string | null;
  website: string | null;
  imageUrl: string | null;
  approved: boolean;
  createdAt: string;
};

export type FullMember = PublicMember & {
  email: string;
  phone: string | null;
};
