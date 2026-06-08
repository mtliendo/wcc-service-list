import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'babysitting' | 'pet_sitting' | 'businesses'
  bio: text("bio"),
  services: text("services"), // short description of services offered
  availability: text("availability"),
  rate: text("rate"), // babysitting + pet sitting only
  cprCertified: boolean("cpr_certified").default(false).notNull(), // babysitting only
  hasBabysitterCertificate: boolean("has_babysitter_certificate")
    .default(false)
    .notNull(), // babysitting only
  businessName: text("business_name"), // businesses only
  website: text("website"), // businesses only
  imageUrl: text("image_url"), // Vercel Blob URL — optional
  email: text("email").notNull(),
  phone: text("phone"),
  approved: boolean("approved").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
