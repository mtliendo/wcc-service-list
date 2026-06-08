# WCC Community Directory — Implementation Spec

## Overview

Build a public-facing community services directory for a neighborhood association (WCC). Members can browse babysitters, pet sitters, and local businesses/handymen. Visitors can contact members via a form (email sent via Resend). There is an AI chatbot for natural language search. Admins manage all member data via a protected portal.

---

## Stack

| Layer         | Technology                                                             |
| ------------- | ---------------------------------------------------------------------- |
| Framework     | Next.js (latest, App Router)                                           |
| Language      | TypeScript                                                             |
| Styling       | Tailwind CSS + shadcn/ui                                               |
| Animations    | Framer Motion                                                          |
| Data fetching | TanStack Query                                                         |
| Auth          | Auth0 (`@auth0/nextjs-auth0`)                                          |
| Database      | Neon (serverless Postgres)                                             |
| ORM           | Drizzle ORM                                                            |
| Image storage | Cloudinary                                                             |
| Email         | Resend                                                                 |
| AI            | Vercel AI SDK + Vercel AI Gateway (Anthropic claude-sonnet-4-20250514) |
| Hosting       | Vercel                                                                 |

---

## Environment Variables

Create `.env.local` with:

```env
# Auth0
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

# Neon
DATABASE_URL=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# Resend
RESEND_API_KEY=

# Vercel AI Gateway
VERCEL_AI_GATEWAY_KEY=
```

> **Dev vs Prod**: Vercel preview branches use a dev Neon database. Production uses the prod Neon database. Set `DATABASE_URL` accordingly in each Vercel environment.

---

## Database Schema

```ts
// lib/db/schema.ts
import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core'

export const members = pgTable('members', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // 'babysitting' | 'pet_sitting' | 'businesses'
  bio: text('bio'),
  services: text('services'), // short description of services offered
  availability: text('availability'),
  rate: text('rate'), // babysitting + pet sitting only
  businessName: text('business_name'), // businesses only
  website: text('website'), // businesses only
  imageUrl: text('image_url'), // Cloudinary URL — optional
  email: text('email').notNull(),
  phone: text('phone'),
  approved: boolean('approved').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

Run migrations with: `npx drizzle-kit push`

---

## Folder Structure

```
app/
├── api/
│   ├── auth/[auth0]/route.ts         # Auth0 catch-all handler
│   ├── members/route.ts              # GET — returns members WITHOUT email/phone
│   ├── contact/route.ts              # POST — looks up member, sends email via Resend
│   └── chat/route.ts                 # POST — AI chatbot, streaming
├── (admin)/
│   ├── layout.tsx                    # Auth0 session guard — redirects to / if no session
│   └── admin/
│       ├── page.tsx                  # Member list with edit/delete/approve actions
│       ├── new/page.tsx              # Add new member form
│       └── [id]/
│           └── edit/page.tsx         # Edit existing member form
├── layout.tsx                        # Root layout
└── page.tsx                          # Public directory page

components/
├── DirectoryTabs.tsx                 # Tab switcher: Babysitting / Pet Sitting / Businesses
├── MemberCard.tsx                    # Card: avatar/photo, name, services, availability, contact button
├── ContactModal.tsx                  # Modal with contact form (name, email, message)
├── ChatWidget.tsx                    # Floating AI chat button + drawer
└── SearchFilter.tsx                  # Text search input

hooks/
└── useMembers.ts                     # TanStack Query: fetches /api/members?category=

lib/
├── db/
│   ├── index.ts                      # Neon + Drizzle client
│   └── schema.ts                     # members table (see above)
├── cloudinary.ts                     # Server-side upload helper
├── auth.ts                           # Auth0 getSession helper
└── utils.ts

types/
└── directory.ts                      # PublicMember, FullMember, Category types
```

---

## API Routes

### `GET /api/members?category=babysitting`

- Queries Neon for approved members filtered by category
- **Strips `email` and `phone` from the response** — these never reach the client
- Returns: `PublicMember[]`

```ts
type PublicMember = {
  id: string
  name: string
  category: string
  bio: string | null
  services: string | null
  availability: string | null
  rate: string | null
  businessName: string | null
  website: string | null
  imageUrl: string | null
  approved: boolean
  createdAt: string
}
```

### `POST /api/contact`

Body: `{ memberId: string, senderName: string, senderEmail: string, message: string }`

- Looks up full member record from DB (including email)
- Sends email to member via Resend with sender's message
- Returns `{ success: true }` — never exposes member email to client

### `POST /api/chat`

Body: `{ messages: CoreMessage[] }`

- Fetches all approved members from DB server-side
- Injects full directory into system prompt
- Streams response via Vercel AI SDK `streamText`
- Uses Vercel AI Gateway → Anthropic claude-sonnet-4-20250514

System prompt pattern:

```
You are a helpful assistant for the WCC community directory.
Help visitors find the right person for their needs.
Here is the full directory:
${JSON.stringify(allMembers)}

When recommending someone, mention their name, what they offer, and availability.
Be conversational and friendly.
```

---

## Pages

### `/` — Public Directory

- Hero section with WCC branding and short description
- `<SearchFilter />` — filters cards by name/services text search
- `<DirectoryTabs />` — Babysitting | Pet Sitting | Businesses
- Grid of `<MemberCard />` components per tab
- Floating `<ChatWidget />` button (bottom right)
- Each card has a "Contact" button that opens `<ContactModal />`

### `<MemberCard />`

- If `imageUrl` exists: show Cloudinary image (use `w_200,h_200,c_fill,g_face` transform in URL)
- If no image: show shadcn `Avatar` with initials fallback
- Show: name, services, availability, rate (if applicable), business name (if applicable)
- "Contact" button → opens `<ContactModal memberId={id} memberName={name} />`

### `<ContactModal />`

- Fields: Your Name, Your Email, Message
- Zod validation
- On submit: POST to `/api/contact`
- Success state: "Message sent! They'll be in touch soon."

### `<ChatWidget />`

- Floating button bottom-right
- Opens a chat drawer/sheet
- Uses Vercel AI SDK `useChat` hook pointed at `/api/chat`
- Placeholder: "Describe what you're looking for..."

### `/admin` — Member List (protected)

- Table of all members (including unapproved)
- Columns: Name, Category, Email, Phone, Approved, Actions
- Actions: Edit | Delete | Toggle Approved
- "Add Member" button → `/admin/new`

### `/admin/new` and `/admin/[id]/edit` — Member Form

Fields:

- Name (required)
- Category — select: Babysitting | Pet Sitting | Businesses
- Email (required)
- Phone
- Bio
- Services
- Availability
- Rate (shown only for Babysitting + Pet Sitting)
- Business Name (shown only for Businesses)
- Website (shown only for Businesses)
- Image upload → upload to Cloudinary, store URL in DB
- Approved toggle

---

## Cloudinary Image Upload

Use an unsigned upload preset for simplicity (create one in Cloudinary dashboard):

```ts
// lib/cloudinary.ts
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'wcc_members') // create this in Cloudinary dashboard

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData },
  )
  const data = await res.json()
  return data.secure_url
}
```

In member cards, append Cloudinary transforms to the URL:

```ts
// Replace /upload/ with /upload/w_200,h_200,c_fill,g_face/ for thumbnails
imageUrl.replace('/upload/', '/upload/w_200,h_200,c_fill,g_face/')
```

---

## Auth0 Setup Notes

- Application type: **Regular Web Application**
- Allowed Callback URLs: `http://localhost:3000/api/auth/callback`, `https://your-domain.com/api/auth/callback`
- Allowed Logout URLs: `http://localhost:3000`, `https://your-domain.com`
- The admin portal only needs to support **your own login** — no need for social connections or user management beyond a single admin account

Admin layout guard:

```tsx
// app/(admin)/layout.tsx
import { getSession } from '@auth0/nextjs-auth0'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/')
  return <>{children}</>
}
```

---

## Drizzle Config

```ts
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
```

---

## Key Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## Seed Data (Dev)

After running `db:push`, seed the dev database with mock members matching the 3 categories. Use realistic Iowa-area names and `mockmail.com` email addresses. 4 members per category, 12 total. No images needed for seed data — initials avatars will render as fallback.

---

## Design Direction

- Clean, friendly, community-feel aesthetic
- Light mode default
- Warm neutral palette — think cream/slate, not stark white/black
- Clear tab navigation for the 3 categories
- Cards should feel approachable, not corporate
- Mobile responsive — many community members will use phones
- The AI chatbot widget should feel helpful, not gimmicky

---

## What NOT to build (yet)

- Public member submission form (admin-only for now)
- Email notifications when a new member is added
- Twilio SMS (pending 10DLC approval — add later)
- Member authentication (members don't log in, only admins do)
- Payments
