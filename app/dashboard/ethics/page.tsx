'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const DATA_CATEGORIES = [
  { id: 'memories', label: 'Memory Objects', desc: 'Uploaded text, chat logs, diary entries', size: '2.4 MB', count: 640, icon: '📁', canDelete: true },
  { id: 'personality', label: 'Personality Analysis', desc: 'AI-generated trait scores and summaries', size: '0.3 MB', count: 1, icon: '🧬', canDelete: true },
  { id: 'relationships', label: 'Relationship Graph', desc: 'Network of detected people and connections', size: '0.1 MB', count: 9, icon: '🕸️', canDelete: true },
  { id: 'timeline', label: 'Emotional Timeline', desc: 'Mood scores and event markers', size: '0.2 MB', count: 247, icon: '📊', canDelete: true },
  { id: 'chat', label: 'Persona Chat History', desc: 'Conversations with AI persona', size: '0.05 MB', count: 0, icon: '💬', canDelete: true },
]

const CONSENT_ITEMS = [
  { id: 'memory_analysis', label: 'Memory Analysis & Indexing', desc: 'Allow AI to analyze and index uploaded memories', default: true },
  { id: 'personality_ai', label: 'Personality AI Processing', desc: 'Allow generation of personality traits from memories', default: true },
  { id: 'persona_sim', label: 'Persona Simulation', desc: 'Allow AI to simulate your communication style', default: true },
  { id: 'relationship_graph', label: 'Relationship Detection', desc: 'Allow AI to detect and map people in memories', default: true },
  { id: 'analytics', label: 'Usage Analytics', desc: 'Anonymous platform improvement data', default: false },
]

export default function EthicsPage() {
  const [consents, setConsents] = useState<Record<string, boolean>>({})
  const [deletedCategories, setDeletedCategories] = useState<Set<string>>(new Set())
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [showAccountDelete, setShowAccountDelete] = useState(false)
  const [retention, setRetention] = useState('indefinite')
  const router = useRouter()

  useEffect(() => {
    const initial = Object.fromEntries(CONSENT_ITEMS.map(c => [c.id, c.default]))
    setConsents(initial)
  }, [])

  const handleDeleteCategory = (id: string) => {
    setDeletedCategories(prev => new Set([...prev, id]))
    setShowDeleteModal(null)
  }

  const handleDeleteAccount = () => {
    localStorage.removeItem('echomind_user')
    router.push('/login')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.04), rgba(0,212,255,0.04))' }}>
        <div className="flex items-start gap-4">
          <span className="text-4xl">⚖️</span>
          <div>
            <h2 className="text-xl font-semibold text-em-text mb-2">Your Privacy, Your Control 👍</h2>
            <p className="text-em-text-muted max-w-2xl">EchoMind cares about you. Everything stored here is yours — you decide what to keep, what to share, and when to delete. No surprises.</p>
          </div>
        </div>
      </div>

      {/* Ethical warnings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '💡', title: 'AI gives thoughtful guesses', desc: 'All personality insights and chat responses are AI-generated patterns. They may feel meaningful but aren’t always accurate. Think of them as a mirror, not a verdict.', color: '#00D4FF' },
          { icon: '🔒', title: 'Your data stays with you', desc: 'In demo mode, everything lives in your browser. Nothing is uploaded to any server. Your memories are private.', color: '#10B981' },
          { icon: '💖', title: 'Be kind to other people’s privacy', desc: 'Your memories mention real people. They didn’t choose to be here. Use this tool thoughtfully and with care.', color: '#7C3AED' },
        ].map(w => (
          <div key={w.title} className="glass-card rounded-2xl p-5" style={{ borderColor: `${w.color}30`, borderWidth: '1px' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{w.icon}</span>
              <h3 className="font-orbitron text-xs font-bold" style={{ color: w.color }}>{w.title}</h3>
            </div>
            <p className="text-em-text-muted text-xs leading-relaxed">{w.desc}</p>
          </div>
        ))}
      </div>

      {/* Consent management */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-em-text mb-4">What you let EchoMind do</h3>
        <div className="space-y-3">
          {CONSENT_ITEMS.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl transition-all" style={{ background: consents[item.id] ? 'rgba(0,212,255,0.04)' : 'rgba(244,63,94,0.04)', border: `1px solid ${consents[item.id] ? 'rgba(0,212,255,0.15)' : 'rgba(244,63,94,0.15)'}` }}>
              <div className="flex-1">
                <p className="text-em-text text-sm font-medium">{item.label}</p>
                <p className="text-em-text-muted text-xs">{item.desc}</p>
              </div>
              <button
                onClick={() => setConsents(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                className="relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300"
                style={{ background: consents[item.id] ? '#00D4FF' : 'rgba(100,116,139,0.4)' }}
                id={`consent-toggle-${item.id}`}
              >
                <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300" style={{ left: consents[item.id] ? '26px' : '2px' }} />
              </button>
              <span className={`font-orbitron text-xs w-10 ${consents[item.id] ? 'text-em-cyan' : 'text-em-rose'}`}>
                {consents[item.id] ? 'ON' : 'OFF'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data retention */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-em-text mb-4">How long to keep your data</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { val: '30days', label: '30 Days' },
            { val: '90days', label: '90 Days' },
            { val: '1year', label: '1 Year' },
            { val: 'indefinite', label: 'Indefinite' },
          ].map(opt => (
            <button
              key={opt.val}
              onClick={() => setRetention(opt.val)}
              className="p-3 rounded-xl font-orbitron text-sm transition-all"
              style={{
                background: retention === opt.val ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${retention === opt.val ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: retention === opt.val ? '#00D4FF' : '#64748B',
              }}
              id={`retention-${opt.val}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data categories */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-em-text mb-4">What we have stored</h3>
        <div className="space-y-3">
          {DATA_CATEGORIES.map(cat => (
            <div key={cat.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: deletedCategories.has(cat.id) ? 'rgba(244,63,94,0.04)' : 'rgba(255,255,255,0.03)', border: `1px solid ${deletedCategories.has(cat.id) ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.08)'}`, opacity: deletedCategories.has(cat.id) ? 0.5 : 1 }}>
              <span className="text-2xl">{cat.icon}</span>
              <div className="flex-1">
                <p className="text-em-text text-sm font-medium">{cat.label}</p>
                <p className="text-em-text-muted text-xs">{cat.desc} · {cat.count} records · {cat.size}</p>
              </div>
              {deletedCategories.has(cat.id) ? (
                <span className="font-orbitron text-xs text-em-rose">DELETED</span>
              ) : (
                <button
                  onClick={() => setShowDeleteModal(cat.id)}
                  className="font-orbitron text-xs text-em-rose hover:text-white transition-colors px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}
                  id={`delete-${cat.id}`}
                >
                  DELETE
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delete account */}
      <div className="glass-card rounded-2xl p-6" style={{ borderColor: 'rgba(244,63,94,0.2)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-em-rose mb-1">Delete everything & start fresh</h3>
            <p className="text-em-text-muted text-sm">This will permanently erase all your memories, insights, and persona data. You’ll be logged out. This cannot be undone.</p>
          </div>
          <button onClick={() => setShowAccountDelete(true)} className="btn-ghost border-em-rose text-em-rose" style={{ borderColor: 'rgba(244,63,94,0.4)', color: '#F43F5E' }} id="delete-account-btn">
            DELETE ALL DATA
          </button>
        </div>
      </div>

      {/* Delete category modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(2,8,23,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-orbitron text-lg font-bold text-em-text mb-2">Confirm Deletion</h3>
            <p className="text-em-text-muted mb-6">Are you sure you want to delete "{DATA_CATEGORIES.find(c => c.id === showDeleteModal)?.label}"? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="btn-ghost flex-1" id="cancel-delete">CANCEL</button>
              <button onClick={() => handleDeleteCategory(showDeleteModal!)} className="flex-1 py-2.5 rounded-lg font-orbitron text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #F43F5E, #DC2626)' }} id="confirm-delete">CONFIRM DELETE</button>
            </div>
          </div>
        </div>
      )}

      {/* Account delete modal */}
      {showAccountDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(2,8,23,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong rounded-2xl p-6 max-w-md w-full">
            <div className="text-4xl text-center mb-4">⚠️</div>
            <h3 className="font-orbitron text-lg font-bold text-em-rose text-center mb-2">Delete All Cognitive Data</h3>
            <p className="text-em-text-muted text-center mb-6">This will permanently erase your entire cognitive profile including all memories, personality analysis, and persona data. You will be logged out.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowAccountDelete(false)} className="btn-ghost flex-1" id="cancel-account-delete">CANCEL</button>
              <button onClick={handleDeleteAccount} className="flex-1 py-2.5 rounded-lg font-orbitron text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #F43F5E, #7F1D1D)' }} id="confirm-account-delete">DELETE EVERYTHING</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
