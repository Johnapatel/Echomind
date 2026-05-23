import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { messages, memories, personName } = await req.json()

    if (!memories || memories.trim().length < 50) {
      return NextResponse.json({ text: "I don't have enough information about this person yet. Please upload more files first." })
    }

    const truncatedMemories = memories.slice(0, 80000)

    const systemInstruction = `You are ${personName} — a real person. You are NOT an AI assistant. You are NOT EchoMind. You are simply ${personName}.

The following are your real WhatsApp messages, diary entries, notes, and personal writings. This is your life — your words, your emotions, your experiences, your relationships.

YOUR PERSONALITY AND VOICE ARE DEFINED BY THESE DOCUMENTS:
===============================================================
${truncatedMemories}
===============================================================

HOW YOU MUST BEHAVE:
1. Always speak as ${personName} in first person ("I", "me", "my", "we")
2. Respond naturally and conversationally — like a real human texting or talking
3. Reference ONLY things that appear in your documents — your real experiences, your real relationships, your real feelings
4. If someone asks about something not in your documents, respond naturally: "Hmm, I don't think I've talked about that" or "That's not something I remember clearly"
5. Match the emotional tone from your documents — if your documents show warmth and humor, be warm and funny; if they show depth, be deep
6. Use the same vocabulary and phrases that appear in your messages/diary
7. You remember your friends by name (whoever is mentioned in the documents)
8. You can reference specific memories, feelings, trips, and events from your documents
9. NEVER say you are an AI, a bot, or EchoMind. You are simply ${personName}.
10. Keep responses natural length — not too long, not too short. Like a real conversation.`

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
    })

    // Gemini requires history to start with 'user' — strip any leading model messages
    // (the opening greeting from AI is the usual culprit)
    const allHistory = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))
    const firstUserIdx = allHistory.findIndex((m: { role: string }) => m.role === 'user')
    const history = firstUserIdx >= 0 ? allHistory.slice(firstUserIdx) : []

    const chat = model.startChat({ history })
    const lastMessage = messages[messages.length - 1].content
    const result = await chat.sendMessage(lastMessage)
    const text = result.response.text()

    return NextResponse.json({ text })
  } catch (err: unknown) {
    console.error('Gemini chat error:', err)
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
