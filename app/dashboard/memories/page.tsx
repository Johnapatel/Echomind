'use client'
import { useState, useRef } from 'react'

interface MemoryFile {
  name: string
  content: string
  size: string
  type: string
  uploadedAt: string
}

function getFileType(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  return { 'txt': 'Text / Chat', 'pdf': 'PDF', 'json': 'JSON', 'md': 'Notes' }[ext] || 'File'
}
function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export default function MemoriesPage() {
  const [files, setFiles] = useState<MemoryFile[]>(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('echomind_memories')
      return s ? JSON.parse(s) : []
    }
    return []
  })
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    setProcessing(file.name)
    const text = await file.text().catch(() => '[Binary file — content preview not available]')
    await new Promise(r => setTimeout(r, 900))
    const mem: MemoryFile = {
      name: file.name, content: text.slice(0, 800),
      size: formatSize(file.size), type: getFileType(file.name),
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    }
    setFiles(prev => {
      const next = [mem, ...prev]
      localStorage.setItem('echomind_memories', JSON.stringify(next))
      return next
    })
    setProcessing(null)
  }

  const handleFiles = (list: FileList) => Array.from(list).forEach(processFile)
  const removeFile = (idx: number) => {
    setFiles(prev => {
      const next = prev.filter((_, i) => i !== idx)
      localStorage.setItem('echomind_memories', JSON.stringify(next))
      return next
    })
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: '1.6rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>
          My Memories 📂
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Upload your chats, notes, or diary entries. Safe and private, always.
        </p>
      </div>

      {/* Upload zone */}
      <div
        className={`upload-area ${dragging ? 'drag-over' : ''}`}
        style={{ padding: '2.5rem 1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        id="upload-zone"
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{dragging ? '📂' : '🗂️'}</div>
        <p style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '0.35rem' }}>
          Drop your files here
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
          or click to browse — .txt, .pdf, .md, .json
        </p>
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['.txt', '.pdf', '.md', '.json', 'WhatsApp export'].map(t => (
            <span key={t} className="pill">{t}</span>
          ))}
        </div>
        <input ref={inputRef} type="file" multiple accept=".txt,.pdf,.md,.json" style={{ display: 'none' }}
          onChange={e => e.target.files && handleFiles(e.target.files)} id="file-input" />
      </div>

      {/* Processing */}
      {processing && (
        <div className="card-soft" style={{ padding: '0.875rem 1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <span style={{ fontSize: '1.1rem' }}>📖</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500 }}>Reading {processing}...</p>
            <div className="progress" style={{ marginTop: '0.4rem' }}>
              <div className="progress-bar" style={{ width: '65%', animation: 'grow 0.9s ease' }} />
            </div>
          </div>
        </div>
      )}

      {/* Files */}
      {files.length === 0 && !processing ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-dim)', fontSize: '0.875rem', background: 'var(--surface)', borderRadius: 14, border: '1px dashed var(--border)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌱</div>
          No memories yet — add your first one above
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{files.length} file{files.length !== 1 ? 's' : ''} saved</p>
          {files.map((f, i) => (
            <div key={i} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
              <div style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: 2 }}>
                {f.type === 'PDF' ? '📄' : f.type === 'JSON' ? '🗃️' : '📝'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
                  <span className="pill">{f.type}</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{f.size} · {f.uploadedAt}</p>
                {f.content && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.55, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {f.content.slice(0, 130)}...
                  </p>
                )}
              </div>
              <button onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0, padding: '0 0.25rem', lineHeight: 1, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--terra)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
                id={`remove-${i}`}>✕</button>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes grow { from{width:0} to{width:65%} }`}</style>
    </div>
  )
}
