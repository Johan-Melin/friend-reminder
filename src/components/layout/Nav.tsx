import Link from 'next/link'
import { UserMenu } from './UserMenu'

interface NavProps {
  email: string
}

export function Nav({ email }: NavProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-gray-900">
          <span className="text-lg">💌</span>
          <span>Friend Reminder</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
            Dashboard
          </Link>
          <Link href="/contacts" className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
            Contacts
          </Link>
        </nav>
        <UserMenu email={email} />
      </div>
    </header>
  )
}
