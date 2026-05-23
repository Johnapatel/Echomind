'use client'
import { useRef, useState } from 'react'
import { generatePersonalityProfile, MOCK_MEMORIES, MOCK_TIMELINE, MOCK_RELATIONSHIPS, MEMORY_CLUSTERS } from '@/lib/mock-ai'

export default function LegacyPage() {
  const [userName] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('echomind_user')
      return stored ? JSON.parse(stored).name : 'User'
    }
    return 'User'
  })
  const [isSealed, setIsSealed] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)
  const profile = generatePersonalityProfile(userName)
  const topMemories = MOCK_MEMORIES.filter(m => m.sentimentScore > 85)

  const handleDownload = async () => {
    setIsGenerating(true)
    await new Promise(r => setTimeout(r, 1500))
    window.print()
    setIsGenerating(false)
  }

  const handleSeal = async () => {
    setIsGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsSealed(true)
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="glass-card rounded-2xl p-5 flex items-center justify-between no-print">
        <div>
          <h2 className="font-orbitron text-lg font-bold text-em-text mb-1">DIGITAL LEGACY REPORT</h2>
          <p className="text-em-text-muted text-sm">Complete personality documentation ready for download</p>
        </div>
        <div className="flex gap-3">
          {!isSealed ? (
            <button onClick={handleSeal} disabled={isGenerating} className="btn-ghost" id="legacy-seal-btn">
              {isGenerating ? 'SEALING...' : '🔒 SEAL LEGACY'}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span className="text-em-emerald">✓</span>
              <span className="font-orbitron text-xs text-em-emerald">SEALED</span>
            </div>
          )}
          <button onClick={handleDownload} disabled={isGenerating} className="btn-primary" id="legacy-download-btn">
            <span>{isGenerating ? '⏳ GENERATING...' : '📄 DOWNLOAD PDF'}</span>
          </button>
        </div>
      </div>

      {/* Report */}
      <div ref={reportRef} className="space-y-6">
        {/* Cover */}
        <div className="glass-card rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,237,0.06))' }}>
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="font-orbitron text-3xl font-bold text-em-cyan mb-2">My Digital Legacy</h1>
          <h2 className="text-xl text-em-text mb-4">{userName}</h2>
          <div className="flex justify-center gap-6 text-sm text-em-text-muted">
            <span>Created: {new Date().toLocaleDateString()}</span>
            <span>•</span>
            <span>640 memories</span>
            <span>•</span>
            <span>87% confidence</span>
          </div>
          {isSealed && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span className="text-em-emerald text-xl">🔒</span>
              <span className="font-orbitron text-sm text-em-emerald">LEGACY SEALED — {new Date().toLocaleDateString()}</span>
            </div>
          )}
          <p className="text-em-text-muted text-xs">These insights come from patterns in your memories. They're thoughtful, not definitive. Take them as a gift to yourself. 💙</p>
        </div>

        {/* Personality profile */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-em-cyan mb-4 border-b border-em-border pb-2">01 — Personality Profile</h3>
          <p className="text-em-text-muted leading-relaxed mb-4">{profile.personalitySummary}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Openness', val: profile.openness },
              { label: 'Conscientiousness', val: profile.conscientiousness },
              { label: 'Extraversion', val: profile.extraversion },
              { label: 'Agreeableness', val: profile.agreeableness },
              { label: 'Stability', val: profile.emotionalStability },
            ].map(t => (
              <div key={t.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.1)' }}>
                <p className="font-orbitron text-2xl font-bold text-em-cyan">{t.val}</p>
                <p className="text-em-text-muted text-xs mt-1">{t.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dominant traits */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-em-violet-light mb-4 border-b border-em-border pb-2">02 — Your Dominant Traits</h3>
          <div className="flex gap-3 flex-wrap mb-4">
            {profile.dominantTraits.map(t => (
              <span key={t} className="badge-violet module-badge px-4 py-2">{t}</span>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {profile.aiInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-em-text-muted">
                <span className="text-em-violet-light flex-shrink-0">▸</span> {insight}
              </div>
            ))}
          </div>
        </div>

        {/* Top memories */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-em-emerald mb-4 border-b border-em-border pb-2">03 — Defining Memories</h3>
          <div className="space-y-3">
            {topMemories.map(m => (
              <div key={m.id} className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-orbitron text-xs text-em-text-muted">{m.date}</span>
                  <span className="badge-emerald module-badge text-xs">{m.cluster}</span>
                  <span className="ml-auto font-orbitron text-em-emerald text-sm">{m.sentimentScore}/100</span>
                </div>
                <p className="text-em-text text-sm">{m.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Memory clusters */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-em-amber mb-4 border-b border-em-border pb-2">04 — Memory Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MEMORY_CLUSTERS.map(c => (
              <div key={c.name} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${c.color}08`, border: `1px solid ${c.color}20` }}>
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="font-orbitron text-lg font-bold" style={{ color: c.color }}>{c.count}</p>
                  <p className="text-em-text-muted text-xs">{c.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Relationships */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-em-blue mb-4 border-b border-em-border pb-2">05 — Your Key Relationships</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MOCK_RELATIONSHIPS.slice(0, 6).map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold text-em-bg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3B82F6, #00D4FF)' }}>{r.name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-em-text text-sm font-medium">{r.name} <span className="text-em-text-muted font-normal">({r.relationship})</span></p>
                  <p className="text-em-text-muted text-xs">{r.memoryCount} shared memories · {r.interactionFrequency}% interaction</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emotional journey */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-em-rose mb-4 border-b border-em-border pb-2">06 — Emotional Journey Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Peak Emotion', val: 'Euphoric', sub: 'Graduation · May 2024', color: '#10B981' },
              { label: 'Avg Mood Score', val: '73/100', sub: 'Above population average', color: '#00D4FF' },
              { label: 'Resilience', val: 'High', sub: 'Consistent recovery patterns', color: '#7C3AED' },
              { label: 'Growth Arc', val: 'Positive', sub: 'Upward trend detected', color: '#F59E0B' },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                <p className="font-orbitron text-lg font-bold" style={{ color: s.color }}>{s.val}</p>
                <p className="text-em-text text-xs mt-1">{s.label}</p>
                <p className="text-em-text-muted text-xs">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-em-text-dim text-xs">
            EchoMind · Created with love ❤️ · {new Date().toLocaleDateString()}
          </p>
          <p className="text-em-text-dim text-xs mt-1">Insights are thoughtful patterns, not clinical facts.</p>
        </div>
      </div>
    </div>
  )
}
