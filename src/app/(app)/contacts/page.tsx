import Link from 'next/link'
import { auth } from '@/auth'
import { getDb } from '@/lib/db'
import { ContactCard } from '@/components/contacts/ContactCard'
import { Button } from '@/components/ui/Button'
import type { ContactWithStatus } from '@/lib/types'

export default async function ContactsPage() {
  const session = await auth()
  const userId = session!.user.id

  const contacts = (await getDb()`
    SELECT * FROM contact_with_status
    WHERE user_id = ${userId}
    ORDER BY name ASC
  `) as ContactWithStatus[]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">All contacts</h1>
        <Link href="/contacts/new">
          <Button size="sm">+ Add contact</Button>
        </Link>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p>No contacts yet.</p>
          <Link href="/contacts/new" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm mt-2 inline-block">
            Add one →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {contacts.map((c) => <ContactCard key={c.id} contact={c} />)}
        </div>
      )}
    </div>
  )
}
