# WCC Community Directory

A public directory site for **Windsor Crest Club (WCC)**, a neighborhood
association in Davenport, Iowa. Neighbors can browse and search for local
babysitters, pet sitters, and small businesses; an admin area lets WCC board
members add, edit, approve, and remove listings.

## Tech stack

- **Next.js 16** (App Router, TypeScript) — note the `proxy.ts` convention
  replaces `middleware.ts` in this version; see [AGENTS.md](AGENTS.md)
- **Tailwind CSS v4 + shadcn/ui** (on `@base-ui/react` primitives — components
  use the `render` prop for composition, not `asChild`)
- **Framer Motion** for page and list animations
- **TanStack Query** for client-side data fetching
- **Auth0** (`@auth0/nextjs-auth0` v4) for admin authentication
- **Neon (Postgres) + Drizzle ORM** for the member database
- **Cloudinary** for profile photo uploads
- **Resend** for the "contact this member" email flow
- **Vercel AI Gateway / AI SDK** for the directory chat assistant

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy [.env.example](.env.example) to `.env.local` and fill in real values.
Each section in that file includes brief notes on where to get the
corresponding credentials (Auth0 application + callback URLs, a Neon
connection string, a Cloudinary unsigned upload preset, a Resend API key, and
a Vercel AI Gateway key).

```bash
cp .env.example .env.local
```

### 3. Set up the database

Push the Drizzle schema to your Neon database, then seed it with sample
directory data (12 realistic Windsor Crest members across all three
categories):

```bash
npm run db:push
npm run db:seed
```

Use `npm run db:studio` any time to browse/edit data with Drizzle Studio.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the public
directory. Visit [http://localhost:3000/admin](http://localhost:3000/admin) to
sign in with Auth0 and manage listings (login is required — there is no public
sign-up, the WCC board provisions admin accounts directly in Auth0).

## Project structure

```
app/
  page.tsx                  Public directory (hero, search, tabs, member grid, chat)
  layout.tsx                Root layout — fonts, QueryProvider, Toaster
  api/
    members/route.ts        GET — public, approved members (no contact info)
    contact/route.ts        POST — validates + emails a member via Resend
    chat/route.ts           POST — directory chat assistant (AI Gateway)
  (admin)/
    layout.tsx              Auth guard + admin shell (header, logout)
    admin/
      page.tsx              Member table (approve / edit / delete)
      actions.ts            Server actions for member CRUD (admin-only)
      new/page.tsx          Add-member form
      [id]/edit/page.tsx    Edit-member form
components/
  MemberCard.tsx, SearchFilter.tsx, DirectoryTabs.tsx,
  ContactModal.tsx, ChatWidget.tsx, QueryProvider.tsx
  admin/                    MemberForm, AdminMemberTable
  ui/                       shadcn/ui primitives (base-ui)
hooks/useMembers.ts         TanStack Query hook for /api/members
lib/
  db/                       Drizzle client, schema, seed script
  auth0.ts                  Auth0Client instance
  cloudinary.ts             Unsigned upload + thumbnail URL helpers
types/directory.ts          Shared Category / PublicMember / FullMember types
proxy.ts                    Mounts Auth0 routes (replaces middleware.ts)
```

## Directory categories

Members fall into one of three categories — `babysitting`, `pet_sitting`, and
`businesses`. Babysitting listings additionally track **CPR certified** and
**babysitter certificate** status as simple yes/no fields; when set, these
appear as public badges on that member's card so neighbors can filter for
sitters with formal training at a glance.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Auth0 Next.js SDK](https://github.com/auth0/nextjs-auth0)
- [Drizzle ORM](https://orm.drizzle.team)
- [shadcn/ui](https://ui.shadcn.com)

## Deploy

The easiest way to deploy is [Vercel](https://vercel.com/new), which pairs
naturally with Neon, the Vercel AI Gateway, and Auth0's redirect-based login
flow. Remember to add the production `APP_BASE_URL` and Auth0 callback/logout
URLs once you have a deployed domain.
