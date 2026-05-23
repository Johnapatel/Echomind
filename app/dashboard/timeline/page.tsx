'use client'
import { useEffect, useState } from 'react'
import { MOCK_TIMELINE, MOCK_MEMORIES } from '@/lib/mock-ai'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler)

const EMOTION_COLORS: Record<string, string> = {
  joy: '#10B981', sadness: '#3B82F6', anger: '#F43F5E', fear: '#F59E0B', surprise: '#7C3AED', neutral: '#64748B'
}

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<typeof MOCK_TIMELINE[0] | null>(null)

  const lineData = {
    labels: MOCK_TIMELINE.map(t => t.date),
    datasets: [{
      label: 'Emotional Score',
      data: MOCK_TIMELINE.map(t => t.emotionalScore),
      borderColor: '#00D4FF',
      backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D } }) => {
        const chart = ctx.chart
        const { ctx: c, chartArea } = chart
        if (!chartArea) return 'transparent'
        const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)')
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0.01)')
        return gradient
      },
      borderWidth: 2.5,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: MOCK_TIMELINE.map(t => t.emotionalScore > 80 ? '#10B981' : t.emotionalScore > 60 ? '#00D4FF' : t.emotionalScore > 40 ? '#F59E0B' : '#F43F5E'),
      pointBorderColor: '#020817',
      pointRadius: 6,
      pointHoverRadius: 9,
    }]
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          afterLabel: (ctx: { dataIndex: number }) => {
            const entry = MOCK_TIMELINE[ctx.dataIndex]
            return [`Mood: ${entry.mood}`, `Messages: ${entry.messageCount}`]
          }
        },
        backgroundColor: 'rgba(6, 15, 30, 0.95)',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        titleColor: '#00D4FF',
        bodyColor: '#94A3B8',
      }
    },
    scales: {
      x: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.04)' }, min: 0, max: 100 }
    },
    onClick: (_: unknown, elements: { index: number }[]) => {
      if (elements.length > 0) setSelectedMonth(MOCK_TIMELINE[elements[0].index])
    }
  }

  const messageData = {
    labels: MOCK_TIMELINE.map(t => t.date),
    datasets: [{
      label: 'Message Volume',
      data: MOCK_TIMELINE.map(t => t.messageCount),
      backgroundColor: MOCK_TIMELINE.map(t =>
        t.emotionalScore > 80 ? 'rgba(16,185,129,0.7)' :
        t.emotionalScore > 60 ? 'rgba(0,212,255,0.7)' :
        t.emotionalScore > 40 ? 'rgba(245,158,11,0.7)' : 'rgba(244,63,94,0.7)'
      ),
      borderRadius: 6,
    }]
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#64748B' }, grid: { display: false } },
      y: { ticks: { color: '#64748B' }, grid: { color: 'rgba(255,255,255,0.04)' } }
    }
  }

  // Filter memories by emotion
  const emotionCounts = ['joy', 'sadness', 'anger', 'fear', 'neutral'].map(e => ({
    emotion: e,
    count: MOCK_MEMORIES.filter(m => m.emotionType === e).length,
    color: EMOTION_COLORS[e]
  }))

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Peak Score', val: '98', sub: 'Graduation Day 2024', color: '#10B981' },
          { label: 'Lowest Point', val: '42', sub: 'April Work Crisis', color: '#F43F5E' },
          { label: 'Avg Score', val: '73', sub: 'Above population avg', color: '#00D4FF' },
          { label: 'Months Tracked', val: '12', sub: 'Full year coverage', color: '#7C3AED' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-4">
            <p className="text-em-text-muted text-xs mb-1">{s.label}</p>
            <p className="font-orbitron text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.val}</p>
            <p className="text-em-text-dim text-xs">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main timeline chart */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-em-text">Your emotional score over time</h3>
          <span className="text-em-text-muted text-xs">Click on a point to see what happened</span>
        </div>
        <div style={{ height: '280px' }}>
          <Line data={lineData} options={lineOptions as Parameters<typeof Line>[0]['options']} />
        </div>
      </div>

      {/* Selected month detail */}
      {selectedMonth && (
        <div className="glass-card rounded-2xl p-5 border-em-cyan" style={{ borderColor: 'rgba(0,212,255,0.3)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-orbitron text-sm font-bold text-em-cyan">{selectedMonth.date} — {selectedMonth.mood}</h3>
            <button onClick={() => setSelectedMonth(null)} className="text-em-text-muted hover:text-em-text text-sm">✕</button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center"><p className="font-orbitron text-2xl text-em-cyan">{selectedMonth.emotionalScore}</p><p className="text-xs text-em-text-muted">Score</p></div>
            <div className="text-center"><p className="font-orbitron text-2xl text-em-violet-light">{selectedMonth.messageCount}</p><p className="text-xs text-em-text-muted">Messages</p></div>
            <div className="text-center"><p className="font-orbitron text-2xl text-em-emerald">{selectedMonth.events.length}</p><p className="text-xs text-em-text-muted">Key Events</p></div>
          </div>
          <div className="space-y-1">
            {selectedMonth.events.map(ev => (
              <div key={ev} className="flex items-center gap-2 text-sm text-em-text">
                <span className="text-em-cyan">▸</span> {ev}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message volume */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-em-text mb-4">How often you were communicating</h3>
        <div style={{ height: '200px' }}>
          <Bar data={messageData} options={barOptions} />
        </div>
      </div>

      {/* Emotion breakdown */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-em-text mb-4">Emotions found in your memories</h3>
        <div className="space-y-3">
          {emotionCounts.map(({ emotion, count, color }) => (
            <div key={emotion} className="flex items-center gap-4">
              <span className="font-orbitron text-xs w-16 text-em-text capitalize">{emotion}</span>
              <div className="flex-1 progress-bar">
                <div className="progress-fill" style={{ width: `${(count / MOCK_MEMORIES.length) * 100}%`, background: color }} />
              </div>
              <span className="font-orbitron text-xs w-6 text-em-text-muted">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All events list */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-em-text mb-4">Your memorable moments, month by month</h3>
        <div className="relative">
          <div className="timeline-line" />
          <div className="space-y-4">
            {MOCK_TIMELINE.map((entry, i) => (
              <div key={entry.date} className={`flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-4`}>
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="inline-block glass-card rounded-xl p-3">
                    <p className="font-orbitron text-xs text-em-cyan mb-1">{entry.date}</p>
                    <p className="text-em-text text-sm font-medium">{entry.mood}</p>
                    {entry.events.slice(0, 1).map(e => <p key={e} className="text-em-text-muted text-xs mt-0.5">{e}</p>)}
                  </div>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-orbitron text-sm font-bold z-10"
                  style={{ background: entry.emotionalScore > 80 ? '#10B981' : entry.emotionalScore > 60 ? '#00D4FF' : entry.emotionalScore > 40 ? '#F59E0B' : '#F43F5E', boxShadow: `0 0 12px ${entry.emotionalScore > 80 ? '#10B981' : entry.emotionalScore > 60 ? '#00D4FF' : entry.emotionalScore > 40 ? '#F59E0B' : '#F43F5E'}60` }}>
                  {entry.emotionalScore}
                </div>
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
