<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# WCC Community Directory — project notes for agents

A public member directory for Windsor Crest Club (a Davenport, Iowa
neighborhood association): babysitters, pet sitters, and local businesses,
plus an Auth0-gated admin area for managing listings. See [README.md](README.md)
for the full stack list and setup steps.

## Conventions specific to this codebase

- **Auth/middleware**: this project uses `proxy.ts` at the project root (NOT
  `middleware.ts`) exporting a `proxy` function that delegates to
  `auth0.middleware(request)`. This is the Next.js 16 convention — confirm
  against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
  before changing it.
- **Auth0 SDK is v4** (`@auth0/nextjs-auth0`). Use `Auth0Client` from the
  `/server` subpath (see [lib/auth0.ts](lib/auth0.ts)) and the v4 env var
  names — `AUTH0_SECRET`, `APP_BASE_URL`, `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`,
  `AUTH0_CLIENT_SECRET`. Auth routes are auto-mounted at `/auth/login`,
  `/auth/logout`, `/auth/callback`, `/auth/profile` — no `/api` prefix and no
  catch-all route handler file. Use `auth0.getSession()` in Server
  Components/actions and `requireAdmin()` in
  [app/(admin)/admin/actions.ts](<app/(admin)/admin/actions.ts>) to guard admin
  mutations.
- **shadcn/ui runs on `@base-ui/react`**, not Radix. Components compose with a
  `render` prop instead of `asChild`, e.g.
  `<Button render={<Link href="/admin" />}>`. `AvatarImage` renders a plain
  `<img>` and takes standard `src`/`alt` props directly (no `asChild`).
- **Server Actions over redirects**: admin mutations in
  [app/(admin)/admin/actions.ts](<app/(admin)/admin/actions.ts>) call
  `revalidatePath` and return rather than calling `redirect()` — navigation
  happens client-side via `router.push("/admin")` in
  [components/admin/MemberForm.tsx](components/admin/MemberForm.tsx) after a
  successful submit. This avoids fragile `NEXT_REDIRECT` digest/error-string
  matching on the client.
- **Babysitting cert fields**: `members.cprCertified` and
  `members.hasBabysitterCertificate` are simple booleans (see
  [lib/db/schema.ts](lib/db/schema.ts)) shown as public badges on
  [components/MemberCard.tsx](components/MemberCard.tsx) for the
  `babysitting` category only.
- **Design direction**: warm "neighborhood community" aesthetic — cream/
  terracotta/sage oklch palette, Fraunces (display) + Karla (body) fonts, a
  subtle grain texture, staggered Framer Motion reveals. Avoid generic
  Inter/Geist/Roboto and purple-gradient "AI slop" — see
  [app/globals.css](app/globals.css) and [app/layout.tsx](app/layout.tsx) for
  the established palette and type system before adding new UI.
- **Env vars**: every external service credential is documented with setup
  notes in [.env.example](.env.example) — copy it to `.env.local`, never
  commit the latter.
