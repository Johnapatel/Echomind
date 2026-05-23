'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    if (email && password.length >= 6) {
      const user = { email, name: email.split('@')[0], id: Date.now().toString() }
      localStorage.setItem('echomind_user', JSON.stringify(user))
      router.push('/dashboard')
    } else {
      setError('Please use a valid email and a password of at least 6 characters.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Decorative top band */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, var(--accent), var(--sage), var(--terra))', borderRadius: 2, marginBottom: '2.25rem' }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.25rem', marginBottom: '0.6rem' }}>🧠</div>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: '1.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>
            EchoMind
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Your personal memory & personality journal</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: '1.2rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Welcome back 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
            Sign in to continue your memory journey
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Email</label>
              <input type="email" className="input" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required id="login-email" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Password</label>
              <input type="password" className="input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required id="login-password" />
            </div>

            {error && (
              <p style={{ color: '#A0522D', fontSize: '0.8rem', background: 'rgba(201,139,115,0.1)', padding: '0.6rem 0.875rem', borderRadius: '8px', border: '1px solid rgba(201,139,115,0.25)' }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn" disabled={loading} id="login-submit" style={{ width: '100%', marginTop: '0.25rem' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <hr className="divider" style={{ margin: '1.25rem 0' }} />

          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            New here?{' '}
            <Link href="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }} id="go-signup">
              Create your space
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
          Demo: any email + 6+ character password
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
