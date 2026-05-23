'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Trait {
  label: string
  score: number
  emoji: string
  description: string
}

interface PersonProfile {
  personName: string
  shortBio: string
  traits: Trait[]
  communicationStyle: string
  topTopics: string[]
  emotionalTone: string
  favoriteQuote: string
  keyRelationships: string[]
  lifeThemes: string[]
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('there')
  const [gender, setGender] = useState('other')
  const [memCount, setMemCount] = useState(0)
  const [profile, setProfile] = useState<PersonProfile | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')
  const [personNameInput, setPersonNameInput] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('echomind_user')
    if (u) { const p = JSON.parse(u); setUserName(p.name); setGender(p.gender || 'other') }
    const mems = localStorage.getItem('echomind_memories')
    if (mems) setMemCount(JSON.parse(mems).length || 0)
    const cached = localStorage.getItem('echomind_person_profile')
    if (cached) setProfile(JSON.parse(cached))
  }, [])

  const runAnalysis = async () => {
    const raw = localStorage.getItem('echomind_memories')
    if (!raw) return
    const files = JSON.parse(raw)
    if (files.length === 0) return
    setAnalyzing(true)
    setAnalyzeError('')
    const allMemories = files.map((f: { name: string; content: string }) =>
      `=== FILE: ${f.name} ===\n${f.content}`
    ).join('\n\n')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memories: allMemories, personName: personNameInput.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setProfile(data)
      localStorage.setItem('echomind_person_profile', JSON.stringify(data))
    } catch (e: unknown) {
      setAnalyzeError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setAnalyzing(false)
    }
  }

  const avatarSrc = gender === 'female' ? '/echo_female.png' : gender === 'male' ? '/echo_male.png' : null
  const toneColor = profile?.emotionalTone === 'positive' ? '#5E7A55' : profile?.emotionalTone === 'introspective' ? '#6E8FA3' : '#C98B73'
  const toneBg = profile?.emotionalTone === 'positive' ? 'rgba(168,184,160,0.12)' : profile?.emotionalTone === 'introspective' ? 'rgba(110,143,163,0.1)' : 'rgba(201,139,115,0.1)'

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>

      {/* Greeting */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Hey, {userName} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          {profile
            ? `You've reconstructed ${profile.personName}'s personality. Go chat with them!`
            : "Upload files and build a personality — then chat with that person."}
        </p>
      </div>

      {/* No files yet */}
      {memCount === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--surface)', borderRadius: 16, border: '1px dashed var(--border)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.875rem' }}>🗂️</div>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: '1.2rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.5rem' }}>No files yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: 360, margin: '0 auto 1.25rem' }}>
            Upload someone's WhatsApp chats, diary, or notes — we'll reconstruct their personality.
          </p>
          <Link href="/dashboard/memories" className="btn" style={{ display: 'inline-flex' }}>Upload Files →</Link>
        </div>
      )}

      {/* Files uploaded, not yet analyzed */}
      {memCount > 0 && !profile && !analyzing && (
        <div style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1.1rem' }}>
            <div style={{ fontSize: '1.5rem', marginTop: 2 }}>🧠</div>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem' }}>
                {memCount} file{memCount > 1 ? 's' : ''} ready — who are these files about?
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Tell us the person's name so we can reconstruct their personality correctly. For example: if you uploaded <em>Priya's</em> chats, type <strong>Priya</strong>.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="input"
              placeholder="e.g. Priya, Dadi, Arjun, Mom..."
              value={personNameInput}
              onChange={e => setPersonNameInput(e.target.value)}
              id="person-name-input"
              style={{ flex: 1, minWidth: 180 }}
            />
            <button className="btn" onClick={runAnalysis} id="analyze-btn" disabled={analyzing}>
              Build Personality ✨
            </button>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.6rem' }}>
            💡 Leave blank and we'll try to detect the name from the files automatically.
          </p>
        </div>
      )}

      {/* Error */}
      {analyzeError && (
        <div style={{ padding: '0.875rem 1rem', background: 'rgba(201,139,115,0.08)', border: '1px solid rgba(201,139,115,0.25)', borderRadius: 10, marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--terra)' }}>
          ⚠ {analyzeError}
        </div>
      )}

      {/* Analyzing spinner */}
      {analyzing && (
        <div style={{ padding: '2.5rem', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: '1.25rem' }}>
            {[0, 150, 300].map(d => (
              <span key={d} style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'bounce 1s infinite', animationDelay: `${d}ms` }} />
            ))}
          </div>
          <p style={{ fontFamily: 'Lora, serif', fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.3rem' }}>Reconstructing the personality...</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Reading files, finding patterns, building who they are. Takes ~15 seconds.</p>
        </div>
      )}

      {/* ── PERSONALITY PROFILE ── */}
      {profile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Person hero card */}
          <div className="card" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(110,143,163,0.06), rgba(168,184,160,0.06))' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              {avatarSrc ? (
                <img src={avatarSrc} alt={profile.personName} style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(110,143,163,0.2), rgba(168,184,160,0.25))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.9rem', border: '2px solid var(--border)', flexShrink: 0 }}>
                  👤
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontFamily: 'Lora, serif', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text)' }}>
                    {profile.personName}
                  </h2>
                  <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 500, background: toneBg, color: toneColor, border: `1px solid ${toneColor}40` }}>
                    {profile.emotionalTone}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1rem' }}>
                  {profile.shortBio}
                </p>
                <Link href="/dashboard/chat" className="btn" style={{ display: 'inline-flex', fontSize: '0.875rem', padding: '0.55rem 1.25rem' }} id="chat-person-btn">
                  💬 Chat with {profile.personName}
                </Link>
              </div>
            </div>
          </div>

          {/* Personality traits */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <p className="section-label">Personality traits</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profile.traits.map(t => (
                <div key={t.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500 }}>{t.emoji} {t.label}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600 }}>{t.score}%</span>
                  </div>
                  <div className="progress" style={{ marginBottom: '0.25rem' }}>
                    <div className="progress-bar" style={{ width: `${t.score}%` }} />
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <p className="section-label">How they communicate</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6 }}>{profile.communicationStyle}</p>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <p className="section-label">What they talk about</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {profile.topTopics.map(t => <span key={t} className="pill">{t}</span>)}
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <p className="section-label">Key people in their life</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {profile.keyRelationships.map(r => (
                  <p key={r} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>👤 {r}</p>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <p className="section-label">Life themes</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {profile.lifeThemes.map(t => (
                  <span key={t} style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 500, background: 'rgba(201,139,115,0.1)', border: '1px solid rgba(201,139,115,0.25)', color: 'var(--terra)' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Characteristic quote */}
          {profile.favoriteQuote && (
            <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(110,143,163,0.06)', border: '1px solid rgba(110,143,163,0.18)', borderRadius: 14 }}>
              <p className="section-label" style={{ marginBottom: '0.5rem' }}>Something they actually said or wrote</p>
              <p style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.75 }}>
                "{profile.favoriteQuote}"
              </p>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {memCount} file{memCount > 1 ? 's' : ''} · Built with Gemini AI
            </p>
            <button onClick={runAnalysis} className="btn-outline" style={{ fontSize: '0.78rem', padding: '0.4rem 1rem' }} id="reanalyze-btn">
              Re-analyze
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </div>
  )
}
