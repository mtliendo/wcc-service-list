import { eq } from 'drizzle-orm'
import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { createGateway } from '@ai-sdk/gateway'
import { db } from '@/lib/db'
import { members } from '@/lib/db/schema'

export const maxDuration = 30

const gateway = createGateway({
  apiKey: process.env.VERCEL_AI_GATEWAY_KEY,
})

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json()

  const directory = await db
    .select({
      name: members.name,
      category: members.category,
      bio: members.bio,
      services: members.services,
      availability: members.availability,
      rate: members.rate,
      cprCertified: members.cprCertified,
      hasBabysitterCertificate: members.hasBabysitterCertificate,
      businessName: members.businessName,
      website: members.website,
    })
    .from(members)
    .where(eq(members.approved, true))

  const result = streamText({
    model: gateway('anthropic/claude-opus-4.7'),
    system: `You are a friendly, helpful assistant for the Windsor Crest Club (WCC) community directory in Davenport, Iowa.
Help neighbors find the right babysitter, pet sitter, or local business for their needs.

Here is the full directory of approved members:
${JSON.stringify(directory)}

When recommending someone, mention their name, what they offer, their availability, and their category.
For babysitters, mention if they're CPR certified or hold a babysitter certificate when relevant.
If nothing in the directory matches what someone is looking for, say so honestly and suggest they check back later.
Be conversational, warm, and concise — like a helpful neighbor, not a salesperson. Never invent members or details that aren't in the directory.`,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
