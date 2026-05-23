'use client'
import { useEffect, useRef, useState } from 'react'
import { generatePersonalityProfile } from '@/lib/mock-ai'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { Radar, Bar } from 'react-chartjs-2'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

function GaugeMeter({ value, label, color, icon }: { value: number; label: string; color: string; icon: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width = 160
    const h = canvas.height = 100
    const cx = w / 2, cy = h - 10
    const r = 70

    ctx.clearRect(0, 0, w, h)

    // Background arc
    ctx.beginPath()
    ctx.arc(cx, cy, r, Math.PI, 0)
    ctx.lineWidth = 14
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineCap = 'round'
    ctx.stroke()

    // Value arc
    const angle = Math.PI + (value / 100) * Math.PI
    ctx.beginPath()
    ctx.arc(cx, cy, r, Math.PI, angle)
    ctx.strokeStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 12
    ctx.stroke()

    // Value text
    ctx.shadowBlur = 0
    ctx.fillStyle = color
    ctx.font = 'bold 24px Orbitron, monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`${value}`, cx, cy - 8)
    ctx.font = '10px Inter, sans-serif'
    ctx.fillStyle = '#64748B'
    ctx.fillText('%', cx + 20, cy - 18)
  }, [value, color])

  return (
    <div className="glass-card rounded-2xl p-4 text-center">
      <span className="text-2xl">{icon}</span>
      <canvas ref={canvasRef} className="mx-auto my-2" style={{ width: '100%', maxWidth: '160px', height: '100px' }} />
      <p className="font-orbitron text-xs text-em-text-muted tracking-wider">{label}</p>
    </div>
  )
}

export default function PersonalityPage() {
  const [userName, setUserName] = useState('User')
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('echomind_user')
    if (stored) setUserName(JSON.parse(stored).name)
    setAnimating(true)
  }, [])

  const profile = generatePersonalityProfile(userName)

  const radarData = {
    labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Emotional Stability'],
    datasets: [{
      label: `${userName}'s Big Five`,
      data: [profile.openness, profile.conscientiousness, profile.extraversion, profile.agreeableness, profile.emotionalStability],
      backgroundColor: 'rgba(0, 212, 255, 0.1)',
      borderColor: '#00D4FF',
      borderWidth: 2,
      pointBackgroundColor: '#00D4FF',
      pointBorderColor: '#020817',
      pointHoverBackgroundColor: '#7C3AED',
      pointRadius: 5,
    }, {
      label: 'Population Average',
      data: [60, 55, 50, 60, 55],
      backgroundColor: 'rgba(124, 58, 237, 0.05)',
      borderColor: 'rgba(124, 58, 237, 0.4)',
      borderWidth: 1,
      borderDash: [4, 4],
      pointRadius: 3,
      pointBackgroundColor: '#7C3AED',
    }]
  }

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#94A3B8', font: { family: 'Inter' }, padding: 20 }
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(0, 212, 255, 0.1)' },
        grid: { color: 'rgba(0, 212, 255, 0.08)' },
        pointLabels: { color: '#94A3B8', font: { family: 'Inter', size: 11 } },
        ticks: { color: '#475569', backdropColor: 'transparent', stepSize: 20 },
        min: 0, max: 100,
      }
    }
  }

  const commStyle = profile.communicationStyle
  const barData = {
    labels: ['Formal', 'Verbose', 'Empathetic', 'Analytical'],
    datasets: [{
      label: 'Communication Style',
      data: [commStyle.formal, commStyle.verbose, commStyle.empathetic, commStyle.analytical],
      backgroundColor: ['rgba(0, 212, 255, 0.7)', 'rgba(124, 58, 237, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)'],
      borderColor: ['#00D4FF', '#7C3AED', '#10B981', '#F59E0B'],
      borderWidth: 1,
      borderRadius: 6,
    }]
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.04)' }, min: 0, max: 100 }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-em-text mb-2">Your Personality Report 🧬</h2>
          <p className="text-em-text-muted text-sm max-w-xl">Based on {640} moments across {12} months. These are thoughtful patterns found in your memories — not a clinical diagnosis. Take them with love 💙</p>
        </div>
        <div className="text-right">
          <p className="text-em-text-muted text-xs mb-1">Confidence score</p>
          <p className="font-orbitron text-3xl font-bold text-em-cyan">87%</p>
        </div>
      </div>

      {/* Gauge meters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GaugeMeter value={profile.emotionalStability} label="EMOTIONAL STABILITY" color="#10B981" icon="🧘" />
        <GaugeMeter value={profile.positivityScore} label="POSITIVITY SCORE" color="#00D4FF" icon="☀️" />
        <GaugeMeter value={profile.humorScore} label="HUMOR QUOTIENT" color="#F59E0B" icon="😄" />
        <GaugeMeter value={profile.agreeableness} label="AGREEABLENESS" color="#7C3AED" icon="🤝" />
      </div>

      {/* Radar + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-em-text">The Big Five Personality (OCEAN)</h3>
            <span className="badge-cyan module-badge">RADAR</span>
          </div>
          <div style={{ height: '280px' }}>
            <Radar data={radarData} options={{ ...radarOptions, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-em-text">How you communicate</h3>
            <span className="badge-violet module-badge">STYLE</span>
          </div>
          <div style={{ height: '280px' }}>
            <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Dominant traits */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-em-text mb-4">Your Strongest Traits</h3>
        <div className="flex gap-3 flex-wrap mb-4">
          {profile.dominantTraits.map((t, i) => (
            <div key={t} className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: ['rgba(0,212,255,0.1)', 'rgba(124,58,237,0.1)', 'rgba(16,185,129,0.1)', 'rgba(245,158,11,0.1)', 'rgba(244,63,94,0.1)'][i], border: `1px solid ${['rgba(0,212,255,0.3)', 'rgba(124,58,237,0.3)', 'rgba(16,185,129,0.3)', 'rgba(245,158,11,0.3)', 'rgba(244,63,94,0.3)'][i]}` }}>
              <span className="text-lg">{'⭐🎨🔍💚🤔'[i]}</span>
              <span className="font-orbitron text-sm font-bold text-em-text">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI summary */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-em-text">What your memories say about you</h3>
        </div>
        <p className="text-em-text-muted leading-relaxed mb-4">{profile.personalitySummary}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {profile.aiInsights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
              <span className="text-em-cyan mt-0.5 flex-shrink-0">▸</span>
              <p className="text-em-text text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
