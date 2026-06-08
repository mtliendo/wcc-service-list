import { db } from "./index";
import { members } from "./schema";

const seedMembers: (typeof members.$inferInsert)[] = [
  // Babysitting
  {
    name: "Emma Hansen",
    category: "babysitting",
    bio: "Education major at St. Ambrose with five years of sitting experience for Windsor Crest families.",
    services: "Evening & weekend babysitting, homework help, light meal prep",
    availability: "Weeknights after 5pm, weekends",
    rate: "$15/hr",
    cprCertified: true,
    hasBabysitterCertificate: true,
    email: "emma.hansen@mockmail.com",
    phone: "563-555-0142",
    approved: true,
  },
  {
    name: "Lily Petersen",
    category: "babysitting",
    bio: "Local high schooler who loves crafts, board games, and getting kids outside.",
    services: "After-school care, weekend sitting, pet-friendly households welcome",
    availability: "Weekdays 3–7pm, Saturday mornings",
    rate: "$12/hr",
    cprCertified: true,
    hasBabysitterCertificate: false,
    email: "lily.petersen@mockmail.com",
    phone: "563-555-0198",
    approved: true,
  },
  {
    name: "Grace Andersen",
    category: "babysitting",
    bio: "Former daycare assistant who specializes in infants and toddlers.",
    services: "Infant & toddler care, overnight sitting, light housekeeping",
    availability: "Flexible — including overnights and last-minute requests",
    rate: "$18/hr",
    cprCertified: true,
    hasBabysitterCertificate: true,
    email: "grace.andersen@mockmail.com",
    phone: "563-555-0117",
    approved: true,
  },
  {
    name: "Sophie Larsen",
    category: "babysitting",
    bio: "College freshman home for the summer, looking for regular sitting gigs around the neighborhood.",
    services: "Daytime sitting, summer break care, homework help",
    availability: "Weekdays, summer 2026",
    rate: "$13/hr",
    cprCertified: false,
    hasBabysitterCertificate: false,
    email: "sophie.larsen@mockmail.com",
    phone: "563-555-0186",
    approved: true,
  },

  // Pet Sitting
  {
    name: "Jake Thompson",
    category: "pet_sitting",
    bio: "Lifelong dog owner offering walks, drop-ins, and overnight pet sitting in Windsor Crest.",
    services: "Dog walking, daily drop-ins, overnight house sitting",
    availability: "Mornings & evenings daily",
    rate: "$20/visit",
    cprCertified: false,
    hasBabysitterCertificate: false,
    email: "jake.thompson@mockmail.com",
    phone: "563-555-0163",
    approved: true,
  },
  {
    name: "Olivia Schmidt",
    category: "pet_sitting",
    bio: "Vet tech student who provides medication administration and special-needs pet care.",
    services: "Medication administration, senior pet care, cat & small animal sitting",
    availability: "Weekends and Wednesday afternoons",
    rate: "$25/visit",
    cprCertified: false,
    hasBabysitterCertificate: false,
    email: "olivia.schmidt@mockmail.com",
    phone: "563-555-0129",
    approved: true,
  },
  {
    name: "Mason Becker",
    category: "pet_sitting",
    bio: "Runs a small pet-sitting side business out of his Windsor Crest home — references available.",
    services: "Boarding (your home or mine), dog walking, puppy visits",
    availability: "Flexible scheduling, holiday availability",
    rate: "$30/night",
    cprCertified: false,
    hasBabysitterCertificate: false,
    email: "mason.becker@mockmail.com",
    phone: "563-555-0175",
    approved: true,
  },
  {
    name: "Ava Krueger",
    category: "pet_sitting",
    bio: "Animal lover with experience sitting dogs, cats, birds, and reptiles for traveling neighbors.",
    services: "Multi-pet households, exotic pets, plant watering add-on",
    availability: "Weekday afternoons, all-day weekends",
    rate: "$18/visit",
    cprCertified: false,
    hasBabysitterCertificate: false,
    email: "ava.krueger@mockmail.com",
    phone: "563-555-0154",
    approved: true,
  },

  // Businesses
  {
    name: "Dave Mueller",
    category: "businesses",
    businessName: "Mueller Lawn & Snow",
    website: "https://muellerlawnandsnow.example.com",
    bio: "Family-run lawn care and snow removal serving Windsor Crest and the surrounding Davenport area for over 12 years.",
    services: "Lawn mowing, fall cleanup, snow plowing & shoveling",
    availability: "Seasonal — booking now for spring 2026",
    email: "dave@muellerlawnandsnow.example.com",
    phone: "563-555-0110",
    approved: true,
  },
  {
    name: "Priya Nair",
    category: "businesses",
    businessName: "Quad Cities Plumbing Co.",
    website: "https://qcplumbingco.example.com",
    bio: "Licensed plumber offering honest, neighbor-friendly rates for repairs big and small.",
    services: "Leak repair, water heater installation, drain cleaning",
    availability: "Mon–Sat, emergency calls available",
    email: "priya@qcplumbingco.example.com",
    phone: "563-555-0133",
    approved: true,
  },
  {
    name: "Carlos Reyes",
    category: "businesses",
    businessName: "Crest Tech Repair",
    website: "https://cresttechrepair.example.com",
    bio: "Computer and phone repair run out of a home office on Crestview Drive — drop-offs welcome.",
    services: "Laptop & phone screen repair, virus removal, tech setup help",
    availability: "Evenings and weekends by appointment",
    email: "carlos@cresttechrepair.example.com",
    phone: "563-555-0148",
    approved: true,
  },
  {
    name: "Megan O'Brien",
    category: "businesses",
    businessName: "Riverside Handyman Services",
    website: "https://riversidehandyman.example.com",
    bio: "General handyman services for the small jobs that pile up — from leaky faucets to drywall patches.",
    services: "Furniture assembly, drywall repair, fixture installation, painting",
    availability: "Weekdays 8am–4pm",
    email: "megan@riversidehandyman.example.com",
    phone: "563-555-0121",
    approved: true,
  },
];

async function seed() {
  console.log("Seeding members…");
  await db.insert(members).values(seedMembers);
  console.log(`Inserted ${seedMembers.length} members.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
