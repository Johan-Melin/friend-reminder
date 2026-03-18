'use client'

import { useState, useTransition } from 'react'
import { toggleShouldContact } from '@/app/(app)/actions/contacts'
import { useToast } from '@/components/ui/Toast'

interface ShouldContactButtonProps {
  id: string
  shouldContact: boolean
}

export function ShouldContactButton({ id, shouldContact }: ShouldContactButtonProps) {
  const [active, setActive] = useState(shouldContact)
  const [pending, startTransition] = useTransition()
  const { toast } = useToast()

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const next = !active
    setActive(next)
    startTransition(async () => {
      const result = await toggleShouldContact(id, active)
      if (result?.error) {
        setActive(active)
        toast('Failed to update priority', 'error')
      } else {
        toast(next ? 'Marked as should contact' : 'Removed from priority')
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      title={active ? 'Remove priority' : 'Mark as should contact'}
      className="relative z-10 p-1 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  )
}
