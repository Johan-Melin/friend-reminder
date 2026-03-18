'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '@/app/(app)/actions/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" required autoComplete="email" />
      <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" required autoComplete="current-password" />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} size="lg" className="mt-1">
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Sign up</Link>
      </p>
    </form>
  )
}
