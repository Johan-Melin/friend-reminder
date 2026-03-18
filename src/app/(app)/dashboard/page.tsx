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
    ORDER BY should_contact DESC, days_overdue DESC NULLS FIRST
  `) as ContactWithStatus[]

  const flagged  = contacts.filter((c) => c.should_contact)
  const rest     = contacts.filter((c) => !c.should_contact)
  const overdue  = rest.filter((c) => c.days_overdue === null || c.days_overdue > 0)
  const upcoming = rest.filter((c) => c.days_overdue !== null && c.days_overdue >= -7 && c.days_overdue <= 0)
  const ok       = rest.filter((c) => c.days_overdue !== null && c.days_overdue < -7)

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 gap-4">
        <span className="text-5xl">👋</span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">No contacts yet</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs">
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
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/contacts/new">
          <Button size="sm">+ Add contact</Button>
        </Link>
      </div>

      {flagged.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-yellow-500 dark:text-yellow-400 uppercase tracking-wide mb-3 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Should contact · {flagged.length}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {flagged.map((c) => <ContactCard key={c.id} contact={c} />)}
          </div>
        </section>
      )}

      {overdue.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-3">
            Overdue · {overdue.length}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {overdue.map((c) => <ContactCard key={c.id} contact={c} />)}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide mb-3">
            Due soon · {upcoming.length}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcoming.map((c) => <ContactCard key={c.id} contact={c} />)}
          </div>
        </section>
      )}

      {ok.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-3">
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
