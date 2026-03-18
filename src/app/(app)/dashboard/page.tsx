import Link from 'next/link'
import { auth } from '@/auth'
import { getDb } from '@/lib/db'
import { ContactCard } from '@/components/contacts/ContactCard'
import { Button } from '@/components/ui/Button'
import type { ContactWithStatus } from '@/lib/types'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  const contacts = (await getDb()`
    SELECT * FROM contact_with_status
    WHERE user_id = ${userId}
    ORDER BY days_overdue DESC NULLS FIRST
  `) as ContactWithStatus[]

  const overdue = contacts.filter((c) => c.days_overdue === null || c.days_overdue > 0)
  const upcoming = contacts.filter((c) => c.days_overdue !== null && c.days_overdue >= -7 && c.days_overdue <= 0)
  const ok = contacts.filter((c) => c.days_overdue !== null && c.days_overdue < -7)

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 gap-4">
        <span className="text-5xl">👋</span>
        <h2 className="text-xl font-semibold text-gray-900">No contacts yet</h2>
        <p className="text-gray-500 max-w-xs">
          Add your friends and family to start tracking when you last reached out.
        </p>
        <Link href="/contacts/new">
          <Button>Add your first contact</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/contacts/new">
          <Button size="sm">+ Add contact</Button>
        </Link>
      </div>

      {overdue.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-3">
            Overdue · {overdue.length}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {overdue.map((c) => <ContactCard key={c.id} contact={c} />)}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-yellow-600 uppercase tracking-wide mb-3">
            Due soon · {upcoming.length}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcoming.map((c) => <ContactCard key={c.id} contact={c} />)}
          </div>
        </section>
      )}

      {ok.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-3">
            On track · {ok.length}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ok.map((c) => <ContactCard key={c.id} contact={c} />)}
          </div>
        </section>
      )}
    </div>
  )
}
