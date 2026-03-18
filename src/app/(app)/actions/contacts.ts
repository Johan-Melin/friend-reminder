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

export async function createContact(formData: FormData) {
  const userId = await getUserId()

  try {
    await getDb()`
      INSERT INTO contacts (user_id, name, category, target_frequency_days, notes)
      VALUES (
        ${userId},
        ${formData.get('name') as string},
        ${formData.get('category') as string},
        ${Number(formData.get('target_frequency_days'))},
        ${(formData.get('notes') as string) || null}
      )
    `
  } catch {
    return { error: 'Failed to create contact' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/contacts')
  redirect('/dashboard')
}

export async function updateContact(id: string, formData: FormData) {
  const userId = await getUserId()

  try {
    await getDb()`
      UPDATE contacts SET
        name = ${formData.get('name') as string},
        category = ${formData.get('category') as string},
        target_frequency_days = ${Number(formData.get('target_frequency_days'))},
        notes = ${(formData.get('notes') as string) || null}
      WHERE id = ${id} AND user_id = ${userId}
    `
  } catch {
    return { error: 'Failed to update contact' }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/contacts/${id}`)
  redirect(`/contacts/${id}`)
}

export async function toggleShouldContact(id: string, current: boolean) {
  const userId = await getUserId()

  try {
    await getDb()`
      UPDATE contacts SET should_contact = ${!current} WHERE id = ${id} AND user_id = ${userId}
    `
  } catch {
    return { error: 'Failed to update' }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/contacts/${id}`)
}

export async function deleteContact(id: string) {
  const userId = await getUserId()

  await getDb()`DELETE FROM contacts WHERE id = ${id} AND user_id = ${userId}`

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
