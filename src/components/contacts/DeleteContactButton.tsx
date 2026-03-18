'use client'

import { useState } from 'react'
import { deleteContact } from '@/app/(app)/actions/contacts'
import { Button } from '@/components/ui/Button'

export function DeleteContactButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await deleteContact(id)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Are you sure?</span>
        <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting…' : 'Delete'}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => setConfirming(true)} className="text-red-600 hover:bg-red-50">
      Delete contact
    </Button>
  )
}
