'use server'

import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { signIn, signOut } from '@/auth'
import { getDb } from '@/lib/db'

export async function login(formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password' }
    }
    throw error
  }
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const hash = await bcrypt.hash(password, 10)

  try {
    await getDb()`INSERT INTO users (email, password_hash) VALUES (${email}, ${hash})`
  } catch {
    return { error: 'An account with this email already exists' }
  }

  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' })
  } catch (error) {
    if (error instanceof AuthError) {
      redirect('/login')
    }
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: '/login' })
}
