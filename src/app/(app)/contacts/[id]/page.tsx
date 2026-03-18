import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getDb } from '@/lib/db'
import { EventForm } from '@/components/events/EventForm'
import { DeleteEventButton } from '@/components/events/DeleteEventButton'
import { DeleteContactButton } from '@/components/contacts/DeleteContactButton'
import { Badge } from '@/components/ui/Badge'
import {
  formatDaysOverdue,
  getStatusColor,
  getCategoryColor,
  formatDate,
  capitalize,
  getProgressPercent,
  getProgressBarColor,
} from '@/lib/utils'
import type { ContactWithStatus, ContactEvent } from '@/lib/types'

const EVENT_TYPE_LABELS: Record<string, string> = {
  call: 'Phone call',
  text: 'Text / Message',
  email: 'Email',
  'in-person': 'In person',
  other: 'Other',
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const userId = session!.user.id

  const db = getDb()
  const [contacts, events] = await Promise.all([
    db`SELECT * FROM contact_with_status WHERE id = ${id} AND user_id = ${userId} LIMIT 1`,
    db`
      SELECT * FROM contact_events
      WHERE contact_id = ${id} AND user_id = ${userId}
      ORDER BY event_date DESC
    `,
  ])

  const contact = contacts[0] as ContactWithStatus | undefined
  if (!contact) notFound()

  const eventList = events as ContactEvent[]
  const progress = getProgressPercent(contact.days_since_contact, contact.target_frequency_days)

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm">
          ← Back
        </Link>
      </div>

      {/* Contact card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-lg shrink-0">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{contact.name}</h1>
              <Badge className={getCategoryColor(contact.category)}>{capitalize(contact.category)}</Badge>
            </div>
          </div>
          <Link
            href={`/contacts/${contact.id}/edit`}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium shrink-0"
          >
            Edit
          </Link>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-gray-500 dark:text-gray-400">Every {contact.target_frequency_days} days</span>
            <Badge className={getStatusColor(contact.days_overdue)}>
              {formatDaysOverdue(contact.days_overdue)}
            </Badge>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getProgressBarColor(contact.days_overdue)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Last contact</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatDate(contact.last_contact_date)}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Total interactions</p>
            <p className="font-medium text-gray-900 dark:text-white">{contact.total_events}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Added</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatDate(contact.created_at)}</p>
          </div>
        </div>

        {contact.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{contact.notes}</p>
          </div>
        )}
      </div>

      <EventForm contactId={contact.id} />

      {eventList.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Contact history</h2>
          <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
            {eventList.map((event) => (
              <li key={event.id} className="py-3 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {EVENT_TYPE_LABELS[event.type] ?? event.type}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(event.event_date)}</span>
                  </div>
                  {event.notes && <p className="text-sm text-gray-600 dark:text-gray-400">{event.notes}</p>}
                </div>
                <DeleteEventButton eventId={event.id} contactId={contact.id} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border border-red-200 dark:border-red-900 rounded-xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Delete contact</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Permanently removes this contact and all history.</p>
        </div>
        <DeleteContactButton id={contact.id} />
      </div>
    </div>
  )
}
