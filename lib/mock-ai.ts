// Mock AI Analysis Library — EchoMind
// All analysis is simulated with realistic data

export interface PersonalityProfile {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  emotionalStability: number
  positivityScore: number
  humorScore: number
  communicationStyle: {
    formal: number
    verbose: number
    empathetic: number
    analytical: number
  }
  dominantTraits: string[]
  personalitySummary: string
  aiInsights: string[]
}

export interface MemoryObject {
  id: string
  date: string
  content: string
  sentiment: 'positive' | 'negative' | 'neutral'
  sentimentScore: number
  detectedPeople: string[]
  tags: string[]
  cluster: string
  emotionType: 'joy' | 'sadness' | 'anger' | 'surprise' | 'fear' | 'neutral'
  intensity: number
}

export interface RelationshipNode {
  id: string
  name: string
  relationship: string
  interactionFrequency: number
  emotionalIntensity: number
  sentiment: 'positive' | 'negative' | 'neutral'
  topicsShared: string[]
  memoryCount: number
}

export interface TimelineEntry {
  date: string
  emotionalScore: number
  events: string[]
  mood: string
  messageCount: number
}

// ===== MOCK DATA GENERATORS =====

export function generatePersonalityProfile(userName: string = 'User'): PersonalityProfile {
  const seed = userName.length
  const variation = (base: number, range: number) => Math.min(100, Math.max(0, base + (Math.sin(seed * 7.3) * range)))

  return {
    openness: Math.round(variation(78, 12)),
    conscientiousness: Math.round(variation(65, 15)),
    extraversion: Math.round(variation(58, 20)),
    agreeableness: Math.round(variation(82, 10)),
    neuroticism: Math.round(variation(35, 18)),
    emotionalStability: Math.round(variation(71, 12)),
    positivityScore: Math.round(variation(74, 14)),
    humorScore: Math.round(variation(68, 16)),
    communicationStyle: {
      formal: Math.round(variation(45, 20)),
      verbose: Math.round(variation(72, 15)),
      empathetic: Math.round(variation(85, 8)),
      analytical: Math.round(variation(61, 18)),
    },
    dominantTraits: ['Empathetic', 'Creative', 'Curious', 'Supportive', 'Reflective'],
    personalitySummary: `${userName} demonstrates a rich cognitive personality profile marked by high openness to experience and strong empathetic tendencies. The memory analysis reveals a deeply creative and curious mind, often gravitating toward meaningful conversations and introspective thought patterns. Communication style is warm yet thoughtful, with a tendency toward expressive and emotionally rich exchanges. Emotional regulation patterns suggest above-average resilience with healthy processing of both positive and challenging experiences.`,
    aiInsights: [
      'Strong empathy markers detected across 847 memory instances',
      'Creative language patterns appear 3.2x more than average profiles',
      'Conflict resolution style is predominantly collaborative (89% of instances)',
      'Nostalgic memory clusters indicate strong long-term relationship bonds',
      'Humor manifests primarily as wit-based (72%) vs. situational (28%)',
      'Emotional vocabulary richness scores in top 15th percentile',
    ]
  }
}

export const MOCK_MEMORIES: MemoryObject[] = [
  {
    id: 'm1', date: '2024-01-15', content: 'Had the most amazing trip to Manali with the college group! The mountains were breathtaking and we stayed up all night talking about life. Sarah kept making everyone laugh with her stories. Best memories.',
    sentiment: 'positive', sentimentScore: 92, detectedPeople: ['Sarah', 'Rahul', 'Priya'], tags: ['travel', 'college', 'friends', 'mountains'], cluster: 'Travel & Adventures', emotionType: 'joy', intensity: 92
  },
  {
    id: 'm2', date: '2024-03-08', content: 'Mom called today. She sounded tired but tried to hide it. Made me realize I haven\'t been home in 6 months. Feeling guilty. Need to plan a visit soon. Miss her cooking.',
    sentiment: 'neutral', sentimentScore: 45, detectedPeople: ['Mom'], tags: ['family', 'home', 'guilt', 'love'], cluster: 'Family', emotionType: 'sadness', intensity: 55
  },
  {
    id: 'm3', date: '2024-02-14', content: 'Valentine\'s day was surprisingly wonderful. Cooked dinner at home instead of going out. We talked for 4 hours straight about everything — dreams, fears, childhood memories. Felt deeply connected.',
    sentiment: 'positive', sentimentScore: 95, detectedPeople: ['Arjun'], tags: ['love', 'relationship', 'intimate', 'cooking'], cluster: 'Relationships', emotionType: 'joy', intensity: 95
  },
  {
    id: 'm4', date: '2024-04-22', content: 'Presentation bombed. I had prepared for weeks and still froze in front of the team. Manager tried to be nice but I could see the disappointment. Spent the evening replaying every mistake.',
    sentiment: 'negative', sentimentScore: 15, detectedPeople: ['Manager', 'Team'], tags: ['work', 'stress', 'failure', 'anxiety'], cluster: 'Work & Career', emotionType: 'fear', intensity: 78
  },
  {
    id: 'm5', date: '2024-05-30', content: 'Graduation day! Never thought I\'d be so emotional. Dad cried, which made me cry even harder. The whole journey flashed before me — every all-nighter, every exam, every doubt.',
    sentiment: 'positive', sentimentScore: 98, detectedPeople: ['Dad', 'Mom', 'Classmates'], tags: ['college', 'graduation', 'milestone', 'family'], cluster: 'Milestones', emotionType: 'joy', intensity: 98
  },
  {
    id: 'm6', date: '2024-06-15', content: 'Bhai told me his startup failed. He lost everything he invested. Tried to console him but felt helpless. Stayed on call with him for 3 hours. He\'s stronger than he thinks.',
    sentiment: 'negative', sentimentScore: 28, detectedPeople: ['Bhai'], tags: ['family', 'support', 'struggle', 'consolation'], cluster: 'Family', emotionType: 'sadness', intensity: 70
  },
  {
    id: 'm7', date: '2024-07-04', content: 'Discovered this incredible cafe near the office. Spent 3 hours there reading and people-watching. The kind of solitude that recharges you. Ordered the same cold brew twice.',
    sentiment: 'positive', sentimentScore: 80, detectedPeople: [], tags: ['solo', 'reading', 'cafe', 'peace'], cluster: 'Personal Growth', emotionType: 'joy', intensity: 78
  },
  {
    id: 'm8', date: '2024-08-20', content: 'Fight with Priya over something so stupid. Neither of us would back down. We didn\'t speak for 3 days. Hated every minute of it. Finally she texted first and we sorted it out.',
    sentiment: 'negative', sentimentScore: 30, detectedPeople: ['Priya'], tags: ['friends', 'conflict', 'anger', 'reconciliation'], cluster: 'Relationships', emotionType: 'anger', intensity: 65
  },
  {
    id: 'm9', date: '2024-09-10', content: 'Got promoted! Lead Engineer. Didn\'t sleep last night just thinking about it. Called Dad immediately — he was quiet for a moment then said he always knew. That moment was worth everything.',
    sentiment: 'positive', sentimentScore: 97, detectedPeople: ['Dad', 'Manager'], tags: ['work', 'achievement', 'career', 'family', 'pride'], cluster: 'Work & Career', emotionType: 'joy', intensity: 97
  },
  {
    id: 'm10', date: '2024-10-25', content: 'Diwali back home. The whole family together after 2 years. Dadi made her special halwa. Cousins running around. The familiar chaos felt like medicine for the soul.',
    sentiment: 'positive', sentimentScore: 94, detectedPeople: ['Dadi', 'Mom', 'Dad', 'Cousins'], tags: ['family', 'festival', 'home', 'tradition'], cluster: 'Family', emotionType: 'joy', intensity: 94
  },
  {
    id: 'm11', date: '2024-11-14', content: 'Midnight thought: am I actually happy or just busy? Stayed up writing in my journal for 2 hours. Some realizations that I\'m not sure I was ready for.',
    sentiment: 'neutral', sentimentScore: 50, detectedPeople: [], tags: ['introspection', 'anxiety', 'growth', 'journal'], cluster: 'Personal Growth', emotionType: 'neutral', intensity: 45
  },
  {
    id: 'm12', date: '2024-12-31', content: 'New Year\'s Eve. Didn\'t go out. Sat on the terrace alone with chai and thought about the year. So much happened. Losses and wins in equal measure. Grateful. Tired. Ready.',
    sentiment: 'neutral', sentimentScore: 65, detectedPeople: [], tags: ['reflection', 'new year', 'gratitude', 'solo'], cluster: 'Milestones', emotionType: 'neutral', intensity: 60
  },
]

export const MOCK_RELATIONSHIPS: RelationshipNode[] = [
  { id: 'r1', name: 'Mom', relationship: 'Mother', interactionFrequency: 95, emotionalIntensity: 98, sentiment: 'positive', topicsShared: ['home', 'health', 'advice', 'cooking'], memoryCount: 142 },
  { id: 'r2', name: 'Dad', relationship: 'Father', interactionFrequency: 78, emotionalIntensity: 92, sentiment: 'positive', topicsShared: ['career', 'achievements', 'values', 'family'], memoryCount: 98 },
  { id: 'r3', name: 'Arjun', relationship: 'Partner', interactionFrequency: 99, emotionalIntensity: 99, sentiment: 'positive', topicsShared: ['life', 'dreams', 'daily', 'love'], memoryCount: 287 },
  { id: 'r4', name: 'Priya', relationship: 'Best Friend', interactionFrequency: 88, emotionalIntensity: 85, sentiment: 'positive', topicsShared: ['travel', 'gossip', 'work', 'emotions'], memoryCount: 213 },
  { id: 'r5', name: 'Sarah', relationship: 'College Friend', interactionFrequency: 62, emotionalIntensity: 74, sentiment: 'positive', topicsShared: ['college', 'travel', 'humor', 'nostalgia'], memoryCount: 87 },
  { id: 'r6', name: 'Rahul', relationship: 'College Friend', interactionFrequency: 45, emotionalIntensity: 60, sentiment: 'positive', topicsShared: ['college', 'trips', 'sports', 'jokes'], memoryCount: 54 },
  { id: 'r7', name: 'Bhai', relationship: 'Brother', interactionFrequency: 70, emotionalIntensity: 88, sentiment: 'positive', topicsShared: ['life', 'support', 'family', 'work'], memoryCount: 119 },
  { id: 'r8', name: 'Dadi', relationship: 'Grandmother', interactionFrequency: 35, emotionalIntensity: 90, sentiment: 'positive', topicsShared: ['tradition', 'stories', 'food', 'values'], memoryCount: 41 },
  { id: 'r9', name: 'Manager', relationship: 'Colleague', interactionFrequency: 80, emotionalIntensity: 55, sentiment: 'neutral', topicsShared: ['work', 'projects', 'deadlines', 'career'], memoryCount: 63 },
]

export const MOCK_TIMELINE: TimelineEntry[] = [
  { date: '2024-01', emotionalScore: 72, events: ['New year reflection', 'Manali trip planned'], mood: 'Optimistic', messageCount: 342 },
  { date: '2024-02', emotionalScore: 85, events: ['Valentine\'s dinner', 'Project milestone'], mood: 'Joyful', messageCount: 418 },
  { date: '2024-03', emotionalScore: 58, events: ['Mom\'s health concern', 'Work pressure'], mood: 'Anxious', messageCount: 289 },
  { date: '2024-04', emotionalScore: 42, events: ['Presentation failure', 'Imposter syndrome'], mood: 'Stressed', messageCount: 198 },
  { date: '2024-05', emotionalScore: 96, events: ['Graduation day', 'Family reunion'], mood: 'Euphoric', messageCount: 527 },
  { date: '2024-06', emotionalScore: 55, events: ['Bhai\'s startup failure', 'Supportive calls'], mood: 'Empathetic', messageCount: 312 },
  { date: '2024-07', emotionalScore: 74, events: ['Solo cafe days', 'New hobby started'], mood: 'Content', messageCount: 278 },
  { date: '2024-08', emotionalScore: 48, events: ['Friend conflict', 'Reconciliation'], mood: 'Turbulent', messageCount: 234 },
  { date: '2024-09', emotionalScore: 94, events: ['Promotion announcement', 'Team celebration'], mood: 'Triumphant', messageCount: 498 },
  { date: '2024-10', emotionalScore: 91, events: ['Diwali at home', 'Family gathering'], mood: 'Nostalgic', messageCount: 456 },
  { date: '2024-11', emotionalScore: 63, events: ['Midnight questioning', 'Journal writing'], mood: 'Reflective', messageCount: 267 },
  { date: '2024-12', emotionalScore: 77, events: ['Year-end review', 'New year goals'], mood: 'Grateful', messageCount: 389 },
]

// ===== MOCK PERSONA RESPONSES =====

export const PERSONA_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Oh hey! I was literally just thinking about you. What's up?",
    "Hey! Perfect timing, I just made chai. What's on your mind?",
    "Hii! I was actually journaling just now. Come in, sit down metaphorically. 😄"
  ],
  family: [
    "You know how it is with family... it's complicated but it's everything. Mom always says worrying is her love language and honestly? She's not wrong. I find myself doing the same thing now.",
    "Dad's silences mean more than anyone else's words. That's something I've learned. When he goes quiet, that's when he's feeling the most.",
    "Bhai and I fought a lot growing up but I'd pick up the phone for him at 3am no matter what. That kind of bond doesn't need constant maintenance — it just is."
  ],
  travel: [
    "Ugh, Manali was SOMETHING ELSE. There's this thing that happens in the mountains where everything that felt heavy just... lifts. Also we stayed up till 4am talking about the meaning of life which is either very deep or very dramatic depending on who you ask. 😂",
    "I think travel is really just an excuse to be a different version of yourself for a few days. And I love that about it.",
    "My best travel moments have never been the scenic spots — they're always the random conversations and the getting-lost parts."
  ],
  work: [
    "The presentation thing haunts me honestly. But I've been thinking — failure in front of people teaches you something that success never could. You find out exactly how your brain processes humiliation. Spoiler: mine processes it by replaying it on loop at 2am.",
    "Getting promoted felt unreal at first. Like I kept waiting for someone to say 'just kidding'. But Dad's reaction... that made it real.",
    "I'm ambitious but I'm also learning that rest isn't the opposite of productivity. It took me way too long to understand that."
  ],
  emotions: [
    "I feel things pretty intensely, not gonna lie. But I've gotten better at sitting with the feeling instead of immediately trying to fix it or explain it away.",
    "Honestly? The hardest days are the ones where nothing specific is wrong but something feels off. The unnamed melancholy is somehow worse.",
    "I journal when I'm overwhelmed. It's like having a conversation with yourself where no one interrupts and everyone listens. Highly recommend."
  ],
  default: [
    "That's actually something I think about too. Want to know what I've noticed from my own experiences?",
    "Interesting question. From everything I've processed and felt... let me think about this properly.",
    "You know, this reminds me of something. Give me a second to think through this the way I would naturally..."
  ]
}

export function getPersonaResponse(message: string): string {
  const lower = message.toLowerCase()
  let category = 'default'

  if (lower.includes('family') || lower.includes('mom') || lower.includes('dad') || lower.includes('bhai') || lower.includes('dadi')) {
    category = 'family'
  } else if (lower.includes('travel') || lower.includes('trip') || lower.includes('manali') || lower.includes('mountains')) {
    category = 'travel'
  } else if (lower.includes('work') || lower.includes('job') || lower.includes('career') || lower.includes('promotion') || lower.includes('stress')) {
    category = 'work'
  } else if (lower.includes('feel') || lower.includes('emotion') || lower.includes('sad') || lower.includes('happy') || lower.includes('anxious')) {
    category = 'emotions'
  } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('how are you')) {
    category = 'greeting'
  }

  const responses = PERSONA_RESPONSES[category]
  return responses[Math.floor(Math.random() * responses.length)]
}

export const MEMORY_CLUSTERS = [
  { name: 'Family', count: 142, color: '#7C3AED', icon: '👨‍👩‍👧', tags: ['mom', 'dad', 'bhai', 'dadi', 'home'] },
  { name: 'Travel & Adventures', count: 87, color: '#00D4FF', icon: '✈️', tags: ['manali', 'trip', 'mountains', 'travel'] },
  { name: 'Work & Career', count: 96, color: '#F59E0B', icon: '💼', tags: ['work', 'promotion', 'project', 'team'] },
  { name: 'Relationships', count: 213, color: '#F43F5E', icon: '💕', tags: ['arjun', 'love', 'priya', 'friends'] },
  { name: 'Personal Growth', count: 64, color: '#10B981', icon: '🌱', tags: ['journal', 'growth', 'reflection', 'solo'] },
  { name: 'Milestones', count: 38, color: '#3B82F6', icon: '🎓', tags: ['graduation', 'achievement', 'new year'] },
]
