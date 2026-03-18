'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createContact, updateContact } from '@/app/(app)/actions/contacts'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import type { Contact } from '@/lib/types'

interface ContactFormProps {
  contact?: Contact
}

const FREQUENCY_PRESETS = [
  { label: 'Every week', days: 7 },
  { label: 'Every 2 weeks', days: 14 },
  { label: 'Every month', days: 30 },
  { label: 'Every 2 months', days: 60 },
  { label: 'Every 3 months', days: 90 },
  { label: 'Every 6 months', days: 180 },
  { label: 'Every year', days: 365 },
]

export function ContactForm({ contact }: ContactFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = contact
      ? await updateContact(contact.id, formData)
      : await createContact(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="name"
        name="name"
        label="Name"
        placeholder="Jane Smith"
        defaultValue={contact?.name}
        required
      />

      <Select
        id="category"
        name="category"
        label="Category"
        defaultValue={contact?.category ?? 'friend'}
      >
        <option value="friend">Friend</option>
        <option value="family">Family</option>
        <option value="colleague">Colleague</option>
        <option value="other">Other</option>
      </Select>

      <div className="flex flex-col gap-1">
        <label htmlFor="target_frequency_days" className="text-sm font-medium text-gray-700">
          Contact frequency
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {FREQUENCY_PRESETS.map((p) => (
            <button
              key={p.days}
              type="button"
              className="text-xs px-2.5 py-1 rounded-full border border-gray-300 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              onClick={() => {
                const el = document.getElementById('target_frequency_days') as HTMLInputElement
                if (el) el.value = String(p.days)
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <Input
          id="target_frequency_days"
          name="target_frequency_days"
          type="number"
          min={1}
          max={3650}
          placeholder="30"
          defaultValue={contact?.target_frequency_days ?? 30}
          required
        />
        <p className="text-xs text-gray-500">Days between contacts</p>
      </div>

      <Textarea
        id="notes"
        name="notes"
        label="Notes (optional)"
        placeholder="Interests, reminders, things to ask about…"
        defaultValue={contact?.notes ?? ''}
        rows={3}
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : contact ? 'Save changes' : 'Add contact'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
