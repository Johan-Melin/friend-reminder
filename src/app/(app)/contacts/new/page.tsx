import Link from 'next/link'
import { ContactForm } from '@/components/contacts/ContactForm'

export default function NewContactPage() {
  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Add contact</h1>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <ContactForm />
      </div>
    </div>
  )
}
