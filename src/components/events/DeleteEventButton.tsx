'use client'

import { useState } from 'react'
import { deleteEvent } from '@/app/(app)/actions/events'

interface DeleteEventButtonProps {
  eventId: string
  contactId: string
}

export function DeleteEventButton({ eventId, contactId }: DeleteEventButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await deleteEvent(eventId, contactId)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Delete this entry"
    >
      {loading ? '…' : '×'}
    </button>
  )
}
