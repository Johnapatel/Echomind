'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'ai'
  content: string
  time: string
}

interface PersonProfile {
  personName: string
  shortBio: string
  communicationStyle: string
  emotionalTone: string
}

function now() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<{ name: string; gender?: string } | null>(null)
  const [profile, setProfile] = useState<PersonProfile | null>(null)
  const [memories, setMemories] = useState('')
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const u = localStorage.getItem('echomind_user')
    if (u) setUser(JSON.parse(u))

    const p = localStorage.getItem('echomind_person_profile')
    const personProfile = p ? JSON.parse(p) : null
    setProfile(personProfile)

    const raw = localStorage.getItem('echomind_memories')
    if (raw) {
      const files = JSON.parse(raw)
      const combined = files.map((f: { name: string; content: string }) =>
        `=== ${f.name} ===\n${f.content}`
      ).join('\n\n')
      setMemories(combined)

      if (personProfile && combined.length > 50) {
        setMessages([{
          role: 'ai',
          content: `Hey! 😊 What's up?`,
          time: now(),
        }])
      }
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const avatarSrc = user?.gender === 'female' ? '/echo_female.png' : user?.gender === 'male' ? '/echo_male.png' : null

  // No files
  if (typeof window !== 'undefined' && !localStorage.getItem('echomind_memories')) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗂️</div>
        <h2 style={{ fontFamily: 'Lora, serif', fontSize: '1.3rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.5rem' }}>No files uploaded yet</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Upload someone's chats, diary, or notes first.</p>
        <Link href="/dashboard/memories" className="btn">Upload Files →</Link>
      </div>
    )
  }

  const send = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    setError('')

    const newMsg: Message = { role: 'user', content: msg, time: now() }
    const updated = [...messages, newMsg]
    setMessages(updated)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
          memories,
          personName: profile?.personName || 'this person',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(JSON.stringify(data))
      setMessages(prev => [...prev, { role: 'ai', content: data.text, time: now() }])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // No personality built yet
  if (!profile) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧠</div>
        <h2 style={{ fontFamily: 'Lora, serif', fontSize: '1.3rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.5rem' }}>
          Personality not built yet
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Go to <strong>Home</strong> and click <strong>"Build Personality ✨"</strong> first — takes about 15 seconds.
        </p>
        <Link href="/dashboard" className="btn">Go to Home →</Link>
      </div>
    )
  }

  const SUGGESTED = [
    `Tell me about yourself`,
    'How have you been feeling lately?',
    'What do you love doing?',
    'Tell me about someone important to you',
    'What was your happiest memory?',
  ]

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>

      {/* Header — shows the person */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', padding: '0.875rem 1.25rem', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
        {avatarSrc ? (
          <img src={avatarSrc} alt={profile.personName} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }} />
        ) : (
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(110,143,163,0.2), rgba(168,184,160,0.25))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', border: '2px solid var(--border)', flexShrink: 0 }}>
            👤
          </div>
        )}
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'Lora, serif', fontSize: '1rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.1rem' }}>
            {profile.personName}
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            {profile.communicationStyle}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.3rem 0.75rem', background: 'rgba(168,184,160,0.12)', border: '1px solid rgba(168,184,160,0.3)', borderRadius: 20 }}>
          <div className="dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: '0.7rem', color: '#5E7A55', fontWeight: 500 }}>Online</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="card" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1rem' }}>

        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
            Start the conversation below 👇
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              {msg.role === 'ai' && (
                <>
                  {avatarSrc
                    ? <img src={avatarSrc} alt="" style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '0.85rem' }}>👤</span>}
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{profile.personName} · {msg.time}</span>
                </>
              )}
              {msg.role === 'user' && (
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{user?.name || 'You'} · {msg.time}</span>
              )}
            </div>
            <div className={msg.role === 'user' ? 'bubble-me' : 'bubble-ai'} style={{ whiteSpace: 'pre-line' }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {avatarSrc
              ? <img src={avatarSrc} alt="" style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '0.85rem' }}>👤</span>}
            <div className="bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.65rem 0.875rem' }}>
              {[0, 160, 320].map(d => (
                <span key={d} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', opacity: 0.6, animation: 'typingBounce 1.1s ease-in-out infinite', animationDelay: `${d}ms` }} />
              ))}
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginLeft: 4 }}>{profile.personName} is typing...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(201,139,115,0.08)', border: '1px solid rgba(201,139,115,0.25)', borderRadius: 10, fontSize: '0.8rem', color: 'var(--terra)' }}>
            ⚠ {error}
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', marginLeft: 8, fontSize: '0.8rem' }}>dismiss</button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts — only at start */}
      {messages.length <= 1 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {SUGGESTED.map(s => (
            <button key={s} onClick={() => send(s)} className="btn-outline" style={{ fontSize: '0.74rem', padding: '0.35rem 0.8rem' }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          className="input"
          placeholder={`Message ${profile.personName}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          id="chat-input"
          style={{ flex: 1 }}
        />
        <button className="btn" onClick={() => send()} disabled={!input.trim() || loading} id="chat-send" style={{ flexShrink: 0, minWidth: 80 }}>
          Send
        </button>
      </div>

      <style>{`@keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }`}</style>
    </div>
  )
}
