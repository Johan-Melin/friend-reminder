import Link from 'next/link'
import { ContactForm } from '@/components/contacts/ContactForm'

export default function NewContactPage() {
  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm">
          ← Back
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Add contact</h1>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <ContactForm />
      </div>
    </div>
  )
}
