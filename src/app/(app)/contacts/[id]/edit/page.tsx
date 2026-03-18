import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getDb } from '@/lib/db'
import { ContactForm } from '@/components/contacts/ContactForm'
import type { Contact } from '@/lib/types'

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const userId = session!.user.id

  const rows = await getDb()`
    SELECT * FROM contacts WHERE id = ${id} AND user_id = ${userId} LIMIT 1
  `
  const contact = rows[0] as Contact | undefined
  if (!contact) notFound()

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/contacts/${id}`} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm">
          ← Back
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit contact</h1>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <ContactForm contact={contact} />
      </div>
    </div>
  )
}
