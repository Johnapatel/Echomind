'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Hello there 👋', subtitle: 'Here’s your memory snapshot' },
  '/dashboard/memories': { title: 'My Memories', subtitle: 'Upload and explore your moments' },
  '/dashboard/personality': { title: 'Your Personality', subtitle: 'What your memories say about you' },
  '/dashboard/timeline': { title: 'Emotional Journey', subtitle: 'How you’ve felt over time' },
  '/dashboard/relationships': { title: 'People & Bonds', subtitle: 'The connections in your life' },
  '/dashboard/explorer': { title: 'Explore Memories', subtitle: 'Search through your story' },
  '/dashboard/persona': { title: 'Talk to Me', subtitle: 'Chat with your AI persona' },
  '/dashboard/legacy': { title: 'My Legacy', subtitle: 'Your personality report' },
  '/dashboard/ethics': { title: 'Privacy & Control', subtitle: 'Your data, your rules' },
}

interface Props {
  user: { name: string; email: string }
  onMenuToggle: () => void
}

export default function TopBar({ user, onMenuToggle }: Props) {
  const pathname = usePathname()
  const pageInfo = PAGE_TITLES[pathname] || { title: 'EchoMind', subtitle: 'memory journal' }
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="h-16 flex items-center px-6 border-b border-em-border" style={{ background: 'rgba(6, 15, 30, 0.8)', backdropFilter: 'blur(20px)' }}>
      <button onClick={onMenuToggle} className="mr-4 text-em-text-muted hover:text-em-cyan transition-colors" id="topbar-menu-toggle">
        ☰
      </button>

      <div>
        <h1 className="text-base font-semibold text-em-text">{pageInfo.title}</h1>
        <p className="text-em-text-muted text-xs">{pageInfo.subtitle}</p>
      </div>

      <div className="ml-auto flex items-center gap-6">
        {/* Live clock */}
        <div className="hidden md:flex items-center gap-2">
          <div className="status-dot status-online" />
          <span className="font-orbitron text-xs text-em-emerald tracking-widest">{time}</span>
        </div>

        {/* Removed AI badge */}

        {/* Notifications */}
        <button className="relative text-em-text-muted hover:text-em-cyan transition-colors" id="topbar-notifications">
          🔔
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-em-cyan text-em-bg text-xs rounded-full flex items-center justify-center font-bold">3</span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-orbitron text-sm font-bold text-em-bg" style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-em-text text-sm font-medium">{user.name}</p>
            <p className="text-em-text-muted text-xs">Welcome back ❤️</p>
          </div>
        </div>
      </div>
    </header>
  )
}
