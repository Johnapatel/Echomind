import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EchoMind — Your Memory Journal',
  description: 'Upload your memories, discover your personality, and chat with your AI self.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
