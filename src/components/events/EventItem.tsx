'use client'

import { useState } from 'react'
import { updateEvent, deleteEvent } from '@/app/(app)/actions/events'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { formatDate } from '@/lib/utils'
import type { ContactEvent } from '@/lib/types'

const EVENT_TYPE_LABELS: Record<string, string> = {
  call: 'Phone call',
  text: 'Text / Message',
  email: 'Email',
  'in-person': 'In person',
  other: 'Other',
}

interface EventItemProps {
  event: ContactEvent
  contactId: string
}

export function EventItem({ event, contactId }: EventItemProps) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  async function handleSave(formData: FormData) {
    setError(null)
    setSaving(true)
    const result = await updateEvent(event.id, contactId, formData)
    if (result?.error) {
      setError(result.error)
      toast('Failed to save changes', 'error')
    } else {
      setEditing(false)
      toast('Entry updated')
    }
    setSaving(false)
  }

  async function handleDelete() {
    setHidden(true)
    const result = await deleteEvent(event.id, contactId)
    if (result?.error) {
      setHidden(false)
      toast('Failed to delete entry', 'error')
    } else {
      toast('Entry deleted')
    }
  }

  if (hidden) return null

  if (editing) {
    return (
      <li className="py-3">
        <form action={handleSave} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id={`date-${event.id}`}
              name="event_date"
              type="date"
              label="Date"
              defaultValue={event.event_date.split('T')[0]}
              required
            />
            <Select id={`type-${event.id}`} name="type" label="Type" defaultValue={event.type}>
              <option value="call">Phone call</option>
              <option value="text">Text / Message</option>
              <option value="email">Email</option>
              <option value="in-person">In person</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <Textarea
            id={`notes-${event.id}`}
            name="notes"
            label="Notes (optional)"
            defaultValue={event.notes ?? ''}
            rows={2}
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="py-3 flex items-start justify-between gap-3">
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {EVENT_TYPE_LABELS[event.type] ?? event.type}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(event.event_date)}</span>
        </div>
        {event.notes && <p className="text-sm text-gray-600 dark:text-gray-400">{event.notes}</p>}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-1"
          title="Edit"
        >
          ✎
        </button>
        <button
          onClick={handleDelete}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors px-1"
          title="Delete"
        >
          ×
        </button>
      </div>
    </li>
  )
}
