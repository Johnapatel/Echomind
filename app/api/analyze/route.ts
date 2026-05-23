import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { memories, personName: nameHint } = await req.json()

    if (!memories || memories.trim().length < 50) {
      return NextResponse.json({ error: 'Not enough content to analyze' }, { status: 400 })
    }

    const truncated = memories.slice(0, 60000)

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const nameInstruction = nameHint
      ? `IMPORTANT: The person we are building the personality for is named "${nameHint}". Use this as the personName.`
      : `Try to detect the person's first name from how others address them in chats. If truly unknown, use a friendly short name based on context.`

    const prompt = `Analyze the following personal documents (WhatsApp chats, diary entries, notes) and extract a detailed personality profile of the MAIN PERSON whose writing/messages these are.

${nameInstruction}

DOCUMENTS:
${truncated}

Return a JSON object with EXACTLY this structure (no markdown, no code blocks, just raw JSON):
{
  "personName": "the most likely first name of the person whose personality we are building (look at how others address them, or whose diary it is)",
  "shortBio": "2-3 warm sentences describing who this person is based on their writings — their essence",
  "traits": [
    { "label": "trait name", "score": 0-100, "emoji": "relevant emoji", "description": "1 short sentence about this trait from evidence in the docs" }
  ],
  "communicationStyle": "brief description of how they write/talk (e.g. warm and humorous, thoughtful and introspective, casual and expressive)",
  "topTopics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "emotionalTone": "positive or mixed or introspective",
  "favoriteQuote": "the most meaningful or characteristic sentence or excerpt from their actual documents — something that really sounds like them",
  "keyRelationships": ["Name1 (relationship type)", "Name2 (relationship type)"],
  "lifeThemes": ["theme1", "theme2", "theme3"]
}

Rules:
- Include 4-6 traits with scores between 40-95
- Traits should come from actual evidence in the documents
- The favoriteQuote must be a REAL quote from the documents (word for word)
- personName should be the subject of the documents (whose personality we are building)
- emotionalTone must be exactly one of: positive, mixed, introspective
- Make it feel warm and human, not clinical
- Return ONLY the JSON object, nothing else`

    const result = await model.generateContent(prompt)
    const raw = result.response.text()

    // Strip markdown code blocks if present
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Could not parse personality profile from AI response')

    const profile = JSON.parse(jsonMatch[0])
    return NextResponse.json(profile)
  } catch (err: unknown) {
    console.error('Analyze error:', err)
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
