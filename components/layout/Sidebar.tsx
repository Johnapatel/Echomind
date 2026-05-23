'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/dashboard', icon: '🏠', label: 'Home' },
  { href: '/dashboard/memories', icon: '📂', label: 'Memories' },
  { href: '/dashboard/chat', icon: '💬', label: 'Chat' },
  { href: '/dashboard/insights', icon: '✨', label: 'Insights' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; gender?: string } | null>(null)

  useEffect(() => {
    const u = localStorage.getItem('echomind_user')
    if (u) setUser(JSON.parse(u))
  }, [])

  const logout = () => {
    localStorage.removeItem('echomind_user')
    router.push('/login')
  }

  const avatarEmoji = user?.gender === 'female' ? '🌸' : user?.gender === 'male' ? '🌿' : '🌀'

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Accent top stripe */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--accent), var(--sage))', borderRadius: 2, marginBottom: '1.5rem', margin: '-1.5rem -1rem 1.5rem -1rem' }} />

      {/* Logo */}
      <div style={{ marginBottom: '1.75rem', paddingLeft: '4px' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          EchoMind
        </h1>
        <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>memory journal</p>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${active ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase()}`}
            >
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
              {active && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', padding: '0.5rem 0.6rem', background: 'var(--surface2)', borderRadius: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(110,143,163,0.25), rgba(168,184,160,0.25))',
            border: '1.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.95rem', flexShrink: 0,
          }}>
            {avatarEmoji}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'You'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div className="dot" style={{ width: 5, height: 5 }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>active</span>
            </div>
          </div>
        </div>
        <button onClick={logout} className="btn-outline" style={{ width: '100%', padding: '0.4rem', fontSize: '0.78rem' }} id="logout-btn">
          Sign out
        </button>
      </div>
    </aside>
  )
}
