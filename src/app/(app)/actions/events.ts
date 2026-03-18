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

export async function updateEvent(eventId: string, contactId: string, formData: FormData) {
  const userId = await getUserId()

  try {
    await getDb()`
      UPDATE contact_events
      SET event_date = ${formData.get('event_date') as string},
          type       = ${formData.get('type') as string},
          notes      = ${(formData.get('notes') as string) || null}
      WHERE id = ${eventId} AND user_id = ${userId}
    `
  } catch {
    return { error: 'Failed to update entry' }
  }

  revalidatePath(`/contacts/${contactId}`)
  revalidatePath('/dashboard')
}

export async function deleteEvent(eventId: string, contactId: string) {
  const userId = await getUserId()

  try {
    await getDb()`DELETE FROM contact_events WHERE id = ${eventId} AND user_id = ${userId}`
  } catch {
    return { error: 'Failed to delete entry' }
  }

  revalidatePath(`/contacts/${contactId}`)
  revalidatePath('/dashboard')
}
