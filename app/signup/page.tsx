'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const user = { email, name: name || email.split('@')[0], id: Date.now().toString(), gender }
    localStorage.setItem('echomind_user', JSON.stringify(user))
    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        <div style={{ height: 4, background: 'linear-gradient(90deg, var(--terra), var(--sage), var(--accent))', borderRadius: 2, marginBottom: '2.25rem' }} />

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.25rem', marginBottom: '0.6rem' }}>✨</div>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: '1.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>
            EchoMind
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Start your memory journey</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: '1.2rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Create your space 🌱
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
            It only takes a moment
          </p>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Your name</label>
              <input type="text" className="input" placeholder="What should we call you?" value={name} onChange={e => setName(e.target.value)} id="signup-name" />
            </div>

            {/* Gender — affects avatar in chat */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                I identify as
                <span style={{ color: 'var(--text-dim)', fontWeight: 400, marginLeft: 4 }}>(shapes your echo's appearance)</span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['female', 'male', 'other'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    className={`gender-btn ${gender === g ? 'selected' : ''}`}
                    onClick={() => setGender(g)}
                    id={`gender-${g}`}
                  >
                    {g === 'female' ? '🌸 She/Her' : g === 'male' ? '🌿 He/Him' : '🌀 Other'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Email</label>
              <input type="email" className="input" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required id="signup-email" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Password</label>
              <input type="password" className="input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} id="signup-password" />
            </div>

            <button type="submit" className="btn" disabled={loading} id="signup-submit" style={{ width: '100%', marginTop: '0.25rem' }}>
              {loading ? 'Creating your space...' : 'Get Started →'}
            </button>
          </form>

          <hr className="divider" style={{ margin: '1.25rem 0' }} />
          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }} id="go-login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
