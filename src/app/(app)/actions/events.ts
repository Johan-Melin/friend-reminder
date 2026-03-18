'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getDb } from '@/lib/db'

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  return session.user.id
}

export async function createEvent(contactId: string, formData: FormData) {
  const userId = await getUserId()

  try {
    await getDb()`
      INSERT INTO contact_events (contact_id, user_id, event_date, type, notes)
      VALUES (
        ${contactId},
        ${userId},
        ${formData.get('event_date') as string},
        ${formData.get('type') as string},
        ${(formData.get('notes') as string) || null}
      )
    `
  } catch {
    return { error: 'Failed to log contact' }
  }

  revalidatePath(`/contacts/${contactId}`)
  revalidatePath('/dashboard')
}

export async function deleteEvent(eventId: string, contactId: string) {
  const userId = await getUserId()

  await getDb()`DELETE FROM contact_events WHERE id = ${eventId} AND user_id = ${userId}`

  revalidatePath(`/contacts/${contactId}`)
  revalidatePath('/dashboard')
}
