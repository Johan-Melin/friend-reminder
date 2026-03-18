import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Nav } from '@/components/layout/Nav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav email={session.user.email} />
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
