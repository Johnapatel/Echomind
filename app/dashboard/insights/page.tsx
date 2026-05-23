'use client'

const TRAITS = [
  { label: 'Warmth', val: 82, emoji: '❤️', color: 'var(--terra)' },
  { label: 'Curiosity', val: 76, emoji: '🔍', color: 'var(--accent)' },
  { label: 'Resilience', val: 71, emoji: '💪', color: 'var(--sage)' },
  { label: 'Creativity', val: 68, emoji: '🎨', color: '#B08A5E' },
  { label: 'Empathy', val: 89, emoji: '🫂', color: 'var(--terra)' },
]

export default function InsightsPage() {
  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: '1.6rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>
          Your insights ✨
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          A gentle reflection of patterns found in your memories.
        </p>
      </div>

      {/* Traits */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <p className="section-label">Personality glimpse</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {TRAITS.map(t => (
            <div key={t.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500 }}>{t.emoji} {t.label}</span>
                <span style={{ fontSize: '0.8rem', color: t.color, fontWeight: 600 }}>{t.val}%</span>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${t.val}%`, background: `linear-gradient(90deg, ${t.color}, ${t.color}99)` }} />
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '1.25rem', fontStyle: 'italic' }}>
          These are thoughtful guesses based on your memories — not facts. Take them lightly 💙
        </p>
      </div>

      {/* Mood overview */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <p className="section-label">Overall emotional tone</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          {[
            { label: 'Warm moments', val: '64%', bg: 'rgba(168,184,160,0.12)', border: 'rgba(168,184,160,0.3)', color: '#5E7A55' },
            { label: 'Reflective', val: '22%', bg: 'rgba(110,143,163,0.1)', border: 'rgba(110,143,163,0.25)', color: 'var(--accent)' },
            { label: 'Difficult', val: '14%', bg: 'rgba(201,139,115,0.1)', border: 'rgba(201,139,115,0.25)', color: 'var(--terra)' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center', padding: '1rem 0.5rem', background: m.bg, borderRadius: 10, border: `1px solid ${m.border}` }}>
              <p style={{ fontFamily: 'Lora, serif', fontSize: '1.35rem', fontWeight: 600, color: m.color, marginBottom: '0.25rem' }}>{m.val}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(201,139,115,0.07)', border: '1px solid rgba(201,139,115,0.18)', borderRadius: 12 }}>
        <p style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', color: 'var(--terra)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>
          "You carry a warmth that quietly makes the world feel safer for the people around you."
        </p>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>— Your echo, based on your memories</p>
      </div>
    </div>
  )
}
