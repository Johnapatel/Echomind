'use client'
import { useEffect, useRef, useState } from 'react'
import { MOCK_RELATIONSHIPS } from '@/lib/mock-ai'

export default function RelationshipsPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<typeof MOCK_RELATIONSHIPS[0] | null>(null)
  const [cyInstance, setCyInstance] = useState<unknown>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Dynamically import cytoscape to avoid SSR issues
    import('cytoscape').then(({ default: cytoscape }) => {
      if (!containerRef.current) return

      const nodes = [
        // Center node — the user
        { data: { id: 'user', label: 'YOU', type: 'self', freq: 100 }, position: { x: 400, y: 300 } },
        // Relationship nodes
        ...MOCK_RELATIONSHIPS.map((r, i) => {
          const angle = (i / MOCK_RELATIONSHIPS.length) * 2 * Math.PI
          const radius = 150 + (100 - r.interactionFrequency) * 1.2
          return {
            data: { id: r.id, label: r.name, type: r.sentiment, freq: r.interactionFrequency, rel: r.relationship },
            position: { x: 400 + radius * Math.cos(angle), y: 300 + radius * Math.sin(angle) }
          }
        })
      ]

      const edges = MOCK_RELATIONSHIPS.map(r => ({
        data: {
          id: `e-${r.id}`,
          source: 'user',
          target: r.id,
          weight: r.interactionFrequency,
          sentiment: r.sentiment,
        }
      }))

      const cy = cytoscape({
        container: containerRef.current,
        elements: { nodes, edges },
        style: [
          {
            selector: 'node[type="self"]',
            style: {
              'background-color': '#00D4FF',
              'border-color': '#00D4FF',
              'border-width': 3,
              'width': 60, 'height': 60,
              'label': 'data(label)',
              'color': '#020817',
              'font-size': 10,
              'font-family': 'Orbitron',
              'font-weight': 'bold',
              'text-valign': 'center',
              'text-halign': 'center',
              'box-shadow': '0 0 20px #00D4FF',
            }
          },
          {
            selector: 'node[type="positive"]',
            style: {
              'background-color': 'rgba(16, 185, 129, 0.2)',
              'border-color': '#10B981',
              'border-width': 2,
              'width': (ele: { data: (key: string) => number }) => Math.max(30, ele.data('freq') * 0.5),
              'height': (ele: { data: (key: string) => number }) => Math.max(30, ele.data('freq') * 0.5),
              'label': 'data(label)',
              'color': '#E2E8F0',
              'font-size': 9,
              'font-family': 'Inter',
              'text-valign': 'bottom',
              'text-halign': 'center',
              'text-margin-y': 4,
            }
          },
          {
            selector: 'node[type="neutral"]',
            style: {
              'background-color': 'rgba(100, 116, 139, 0.2)',
              'border-color': '#64748B',
              'border-width': 2,
              'width': 35, 'height': 35,
              'label': 'data(label)',
              'color': '#E2E8F0',
              'font-size': 9,
              'font-family': 'Inter',
              'text-valign': 'bottom',
              'text-halign': 'center',
              'text-margin-y': 4,
            }
          },
          {
            selector: 'node:selected',
            style: { 'border-color': '#7C3AED', 'border-width': 3 }
          },
          {
            selector: 'edge[sentiment="positive"]',
            style: {
              'line-color': '#10B981',
              'opacity': 0.4,
              'width': (ele: { data: (key: string) => number }) => Math.max(1, ele.data('weight') * 0.04),
              'curve-style': 'bezier',
            }
          },
          {
            selector: 'edge[sentiment="neutral"]',
            style: {
              'line-color': '#64748B',
              'opacity': 0.3,
              'width': 1.5,
              'curve-style': 'bezier',
            }
          },
          {
            selector: 'edge:selected, edge:hover',
            style: { 'opacity': 0.8 }
          }
        ],
        layout: { name: 'preset' },
        userZoomingEnabled: true,
        userPanningEnabled: true,
        minZoom: 0.3,
        maxZoom: 3,
        wheelSensitivity: 0.2,
      })

      cy.on('tap', 'node', (evt: { target: { id: () => string } }) => {
        const id = evt.target.id()
        const rel = MOCK_RELATIONSHIPS.find(r => r.id === id)
        setSelectedNode(rel || null)
      })

      cy.on('tap', (evt: { target: { id?: () => string; isNode?: () => boolean } }) => {
        if (evt.target.isNode && !evt.target.isNode()) setSelectedNode(null)
      })

      setCyInstance(cy)
    })

    return () => {
      if (cyInstance && typeof (cyInstance as { destroy?: () => void }).destroy === 'function') {
        (cyInstance as { destroy: () => void }).destroy()
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
        <div className="flex gap-4 flex-wrap text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-em-cyan inline-block" /> You</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-em-emerald inline-block" /> Close Relationship</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-em-text-muted inline-block" /> Neutral</span>
          <span className="text-em-text-muted">Node size = interaction frequency</span>
        </div>
        <div className="ml-auto text-em-text-muted text-xs">Click a node to view details</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Graph */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden" style={{ height: '520px' }}>
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} id="relationship-graph" />
        </div>

        {/* Panel */}
        <div className="space-y-4">
          {selectedNode ? (
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-orbitron text-lg font-bold text-em-bg" style={{ background: 'linear-gradient(135deg, #10B981, #00D4FF)' }}>
                  {selectedNode.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-orbitron text-sm font-bold text-em-text">{selectedNode.name}</h3>
                  <p className="text-em-text-muted text-xs">{selectedNode.relationship}</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Interaction Frequency', val: selectedNode.interactionFrequency, color: '#00D4FF' },
                  { label: 'Emotional Intensity', val: selectedNode.emotionalIntensity, color: '#7C3AED' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-em-text-muted">{s.label}</span>
                      <span className="font-orbitron text-xs" style={{ color: s.color }}>{s.val}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${s.val}%`, background: s.color }} /></div>
                  </div>
                ))}

                <div className="pt-2 border-t border-em-border">
                  <p className="text-xs text-em-text-muted mb-2">SHARED TOPICS</p>
                  <div className="flex gap-1 flex-wrap">
                    {selectedNode.topicsShared.map(t => (
                      <span key={t} className="badge-cyan module-badge text-xs">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-em-border flex justify-between">
                  <div><p className="text-xs text-em-text-muted">Memories</p><p className="font-orbitron text-lg text-em-cyan">{selectedNode.memoryCount}</p></div>
                  <div><p className="text-xs text-em-text-muted">Bond</p><p className="font-orbitron text-lg text-em-emerald capitalize">{selectedNode.sentiment}</p></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-5 text-center">
              <div className="text-4xl mb-3">🕸️</div>
              <h3 className="font-orbitron text-sm font-bold text-em-text mb-2">Relationship Graph</h3>
              <p className="text-em-text-muted text-xs">Click any node in the graph to see detailed relationship analytics</p>
            </div>
          )}

          {/* Top relationships list */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-orbitron text-xs font-bold text-em-text mb-3">TOP CONNECTIONS</h3>
            <div className="space-y-2">
              {MOCK_RELATIONSHIPS.sort((a, b) => b.interactionFrequency - a.interactionFrequency).slice(0, 5).map(r => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-white/5"
                  onClick={() => setSelectedNode(r)}
                  id={`rel-node-${r.id}`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-orbitron text-xs font-bold text-em-bg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #10B981, #00D4FF)' }}>{r.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-em-text text-sm font-medium">{r.name}</p>
                    <p className="text-em-text-muted text-xs">{r.relationship} · {r.memoryCount} memories</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="font-orbitron text-xs text-em-cyan">{r.interactionFrequency}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
