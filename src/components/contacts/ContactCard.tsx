import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { ShouldContactButton } from './ShouldContactButton'
import {
  formatDaysOverdue,
  getStatusColor,
  getProgressBarColor,
  getCategoryColor,
  getProgressPercent,
  formatDate,
  capitalize,
} from '@/lib/utils'
import type { ContactWithStatus } from '@/lib/types'

interface ContactCardProps {
  contact: ContactWithStatus
}

export function ContactCard({ contact }: ContactCardProps) {
  const progress = getProgressPercent(contact.days_since_contact, contact.target_frequency_days)
  const statusLabel = formatDaysOverdue(contact.days_overdue)
  const statusColor = getStatusColor(contact.days_overdue)
  const barColor = getProgressBarColor(contact.days_overdue)
  const catColor = getCategoryColor(contact.category)

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm transition-all">
      {/* Full-card link underneath interactive elements */}
      <Link href={`/contacts/${contact.id}`} className="absolute inset-0 rounded-xl" aria-label={contact.name} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-semibold text-sm shrink-0">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{contact.name}</p>
              <Badge className={catColor}>{capitalize(contact.category)}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <ShouldContactButton id={contact.id} shouldContact={contact.should_contact} />
            <Badge className={statusColor}>{statusLabel}</Badge>
          </div>
        </div>

        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Last: {formatDate(contact.last_contact_date)}</span>
          <span>Every {contact.target_frequency_days}d</span>
        </div>
      </div>
    </div>
  )
}
