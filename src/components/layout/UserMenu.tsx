'use client'

import { logout } from '@/app/(app)/actions/auth'
import { Button } from '@/components/ui/Button'

export function UserMenu({ email }: { email: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden sm:block text-sm text-gray-500 truncate max-w-[180px]">{email}</span>
      <form action={logout}>
        <Button type="submit" variant="ghost" size="sm">Sign out</Button>
      </form>
    </div>
  )
}
