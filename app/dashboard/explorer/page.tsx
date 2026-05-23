'use client'
import { useState, useMemo } from 'react'
import { MOCK_MEMORIES, MEMORY_CLUSTERS } from '@/lib/mock-ai'

const QUICK_TAGS = ['college', 'family', 'stress', 'travel', 'love', 'work', 'solo', 'friends', 'growth', 'achievement']

function highlightText(text: string, query: string) {
  if (!query) return text
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? `<mark style="background:rgba(0,212,255,0.25);color:#00D4FF;border-radius:2px;padding:0 2px">${part}</mark>`
      : part
  ).join('')
}

export default function ExplorerPage() {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeCluster, setActiveCluster] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const results = useMemo(() => {
    let memories = MOCK_MEMORIES
    if (activeCluster) memories = memories.filter(m => m.cluster === activeCluster)
    if (activeTag) memories = memories.filter(m => m.tags.includes(activeTag) || m.content.toLowerCase().includes(activeTag))
    if (query.trim()) {
      const q = query.toLowerCase()
      memories = memories.filter(m =>
        m.content.toLowerCase().includes(q) ||
        m.tags.some(t => t.includes(q)) ||
        m.cluster.toLowerCase().includes(q) ||
        m.detectedPeople.some(p => p.toLowerCase().includes(q))
      )
    }
    return memories
  }, [query, activeTag, activeCluster])

  const handleSearch = (val: string) => {
    setQuery(val)
    setIsSearching(true)
    setTimeout(() => setIsSearching(false), 400)
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-em-text">Search Your Memories 🔍</h2>
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-em-cyan text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search your memories... try 'college', 'family', 'Manali', 'stress'..."
            value={query}
            onChange={e => handleSearch(e.target.value)}
            className="em-input pl-12 text-base"
            style={{ paddingRight: '120px' }}
            id="memory-search-input"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isSearching && <div className="w-4 h-4 border-2 border-em-cyan border-t-transparent rounded-full animate-spin" />}
            <span className="font-orbitron text-xs text-em-text-muted">{results.length} results</span>
          </div>
        </div>

        {/* Quick tag chips */}
        <div className="flex gap-2 flex-wrap mt-4">
          <span className="text-xs text-em-text-muted self-center">Quick search:</span>
          {QUICK_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => { setActiveTag(activeTag === tag ? null : tag); setQuery('') }}
              className="module-badge cursor-pointer transition-all"
              style={{
                background: activeTag === tag ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeTag === tag ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                color: activeTag === tag ? '#00D4FF' : '#64748B',
              }}
              id={`tag-filter-${tag}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Cluster filters */}
      <div className="flex gap-2 flex-wrap">
        {MEMORY_CLUSTERS.map(c => (
          <button
            key={c.name}
            onClick={() => setActiveCluster(activeCluster === c.name ? null : c.name)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-orbitron cursor-pointer transition-all"
            style={{
              background: activeCluster === c.name ? `${c.color}18` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeCluster === c.name ? c.color + '50' : 'rgba(255,255,255,0.08)'}`,
              color: activeCluster === c.name ? c.color : '#64748B',
            }}
            id={`cluster-filter-${c.name.replace(/\s+/g,'-').toLowerCase()}`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🔮</div>
          <h3 className="font-orbitron text-lg font-bold text-em-text mb-2">No Memories Found</h3>
          <p className="text-em-text-muted">Try a different search term or clear the filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map(memory => {
            const cluster = MEMORY_CLUSTERS.find(c => c.name === memory.cluster)
            return (
              <div key={memory.id} className="glass-card rounded-xl p-5 hover-glow-cyan">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cluster?.icon || '📝'}</span>
                    <div>
                      <p className="font-orbitron text-xs text-em-text-muted">{memory.date}</p>
                      <p className="text-xs" style={{ color: cluster?.color || '#00D4FF' }}>{memory.cluster}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-orbitron text-lg font-bold" style={{ color: memory.sentimentScore > 70 ? '#10B981' : memory.sentimentScore > 40 ? '#F59E0B' : '#F43F5E' }}>
                      {memory.sentimentScore}
                    </span>
                    <p className="text-em-text-dim text-xs">score</p>
                  </div>
                </div>

                <p
                  className="text-em-text text-sm leading-relaxed mb-3"
                  dangerouslySetInnerHTML={{ __html: highlightText(memory.content, query || activeTag || '') }}
                />

                <div className="flex items-center gap-2 flex-wrap">
                  {memory.tags.slice(0, 4).map(tag => (
                    <button
                      key={tag}
                      onClick={() => { setActiveTag(tag); setQuery('') }}
                      className="text-xs cursor-pointer transition-all hover:text-em-cyan"
                      style={{ background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px', color: (activeTag === tag || (query && tag.includes(query.toLowerCase()))) ? '#00D4FF' : '#64748B' }}
                    >
                      #{tag}
                    </button>
                  ))}
                  {memory.detectedPeople.length > 0 && (
                    <span className="text-em-text-muted text-xs">· {memory.detectedPeople.join(', ')}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Bubble cluster visualization */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-em-text mb-4">Memory Cluster Map</h3>
        <div className="flex items-center justify-center flex-wrap gap-4 py-4">
          {MEMORY_CLUSTERS.map(c => {
            const size = 50 + (c.count / 10)
            return (
              <button
                key={c.name}
                onClick={() => setActiveCluster(activeCluster === c.name ? null : c.name)}
                className="rounded-full flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110"
                style={{
                  width: size, height: size,
                  background: `${c.color}15`,
                  border: `2px solid ${activeCluster === c.name ? c.color : c.color + '40'}`,
                  boxShadow: activeCluster === c.name ? `0 0 20px ${c.color}50` : 'none',
                }}
                id={`cluster-bubble-${c.name.replace(/\s+/g,'-').toLowerCase()}`}
              >
                <span style={{ fontSize: size * 0.25 }}>{c.icon}</span>
                <span className="font-orbitron font-bold" style={{ fontSize: size * 0.13, color: c.color }}>{c.count}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
