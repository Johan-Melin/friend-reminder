import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Friend Reminder',
  description: 'Stay in touch with the people who matter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
