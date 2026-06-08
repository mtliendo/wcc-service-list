import { Auth0Client } from '@auth0/nextjs-auth0/server'

// Vercel injects VERCEL_URL/VERCEL_BRANCH_URL as real env vars at runtime —
// it does NOT expand "$VERCEL_URL" inside another var's value (that's a
// Next.js .env-file feature, not a platform one), so APP_BASE_URL must be
// computed here rather than templated in the dashboard.
const appBaseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.APP_BASE_URL

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  secret: process.env.AUTH0_SECRET!,
  appBaseUrl,
})
