'use client'
import { useState, useRef, useEffect } from 'react'
import { getPersonaResponse, generatePersonalityProfile } from '@/lib/mock-ai'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: string
}

const GREETING = "Hey! I'm a reflection of you — built from your memories and how you write and express yourself. Think of me as your journal, come to life. Ask me anything, or just talk. I'll respond the way you would. 💙"

export default function PersonaPage() {
  const [userName, setUserName] = useState('User')
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'ai', content: GREETING, timestamp: new Date().toLocaleTimeString() }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [personaMode, setPersonaMode] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('echomind_user')
    if (stored) setUserName(JSON.parse(stored).name)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const profile = generatePersonalityProfile(userName)

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date().toLocaleTimeString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    const delay = 1000 + Math.random() * 1500
    await new Promise(r => setTimeout(r, delay))

    const response = getPersonaResponse(input)
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: response, timestamp: new Date().toLocaleTimeString() }
    setMessages(prev => [...prev, aiMsg])
    setIsTyping(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Chat panel */}
      <div className="lg:col-span-2 glass-card rounded-2xl flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
        {/* Chat header */}
        <div className="flex items-center gap-4 p-4 border-b border-em-border">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(0,212,255,0.3)' }}>
            🧠
          </div>
          <div>
            <p className="text-sm font-semibold text-em-text">{userName} — your AI reflection</p>
            <div className="flex items-center gap-2">
              <div className="status-dot status-online" />
              <span className="text-em-emerald text-xs">Here for you</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setPersonaMode(!personaMode)}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${personaMode ? 'bg-em-cyan/20 text-em-cyan border border-em-cyan/30' : 'bg-white/5 text-em-text-muted'}`}
              id="persona-mode-toggle"
            >
              {personaMode ? 'Persona On' : 'Persona Off'}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.3), rgba(124,58,237,0.3))', border: '1px solid rgba(0,212,255,0.3)' }}>
                  🧠
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} p-4`}>
                <p className="text-em-text text-sm leading-relaxed">{msg.content}</p>
                <p className="text-em-text-dim text-xs mt-1">{msg.timestamp}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-orbitron text-xs font-bold text-em-bg flex-shrink-0 mt-1" style={{ background: 'linear-gradient(135deg, #7C3AED, #00D4FF)' }}>
                  {userName.charAt(0)}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.3), rgba(124,58,237,0.3))', border: '1px solid rgba(0,212,255,0.3)' }}>🧠</div>
              <div className="chat-bubble-ai p-4">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-em-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-em-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-em-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-em-text-muted text-xs ml-2">Thinking about how to respond...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-em-border">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask your persona anything..."
              className="em-input flex-1"
              id="persona-chat-input"
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
              className="btn-primary px-6 disabled:opacity-50"
              id="persona-chat-send"
            >
              <span>SEND</span>
            </button>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {['Tell me about your travels', 'How do you handle stress?', 'Talk about your family', 'What makes you laugh?'].map(prompt => (
              <button key={prompt} onClick={() => { setInput(prompt); }} className="text-xs text-em-text-muted hover:text-em-cyan transition-colors" style={{ background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '6px' }} id={`persona-prompt-${prompt.replace(/\s+/g,'-').toLowerCase().slice(0,20)}`}>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Personality context panel */}
      <div className="space-y-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-em-text mb-3">Active personality traits</h3>
          <div className="space-y-2">
            {profile.dominantTraits.map((t, i) => (
              <div key={t} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)' }}>
                <div className="w-2 h-2 rounded-full bg-em-cyan animate-pulse" />
                <span className="text-em-text text-sm">{t}</span>
                <span className="ml-auto font-orbitron text-xs text-em-cyan">{90 - i * 5}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-em-text mb-3">How I tend to respond</h3>
          <div className="space-y-2">
            {[
              { label: 'Warmth', val: profile.agreeableness },
              { label: 'Humor', val: profile.humorScore },
              { label: 'Depth', val: profile.openness },
              { label: 'Empathy', val: profile.communicationStyle.empathetic },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-xs text-em-text-muted">{s.label}</span>
                  <span className="font-orbitron text-xs text-em-violet-light">{s.val}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${s.val}%`, background: 'linear-gradient(90deg, #7C3AED, #00D4FF)' }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-em-text mb-3">Memories I can talk about</h3>
          <div className="space-y-1">
            {['Family bonds · 142 records', 'Travel memories · 87 records', 'Work experiences · 96 records', 'Relationships · 213 records'].map(ctx => (
              <div key={ctx} className="flex items-center gap-2 text-xs text-em-text-muted">
                <span className="text-em-emerald">✓</span> {ctx}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4" style={{ background: 'rgba(100, 116, 139, 0.06)', border: '1px solid rgba(100,116,139,0.15)' }}>
          <p className="text-em-text-muted text-xs">💬 This is a thoughtful AI reflection based on your memories. It’s meant to feel like you — but it’s not a perfect copy. Responses may be incomplete or imperfect. That’s okay. 💙</p>
        </div>
      </div>
    </div>
  )
}
