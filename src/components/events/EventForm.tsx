'use client'

import { useState } from 'react'
import { createEvent } from '@/app/(app)/actions/events'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

interface EventFormProps {
  contactId: string
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function EventForm({ contactId }: EventFormProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = await createEvent(contactId, formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setOpen(false)
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        + Log contact
      </Button>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <h3 className="font-medium text-gray-900 mb-4">Log a contact</h3>
      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="event_date"
            name="event_date"
            type="date"
            label="Date"
            defaultValue={todayISO()}
            required
          />
          <Select id="type" name="type" label="Type">
            <option value="call">Phone call</option>
            <option value="text">Text / Message</option>
            <option value="email">Email</option>
            <option value="in-person">In person</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <Textarea
          id="notes"
          name="notes"
          label="Notes (optional)"
          placeholder="What did you talk about?"
          rows={2}
        />
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
