import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { neon } from '@neondatabase/serverless'
import { authConfig } from './auth.config'

declare module 'next-auth' {
  interface Session {
    user: { id: string; email: string }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const db = neon(process.env.DATABASE_URL!)
          const rows = await db`
            SELECT id, email, password_hash FROM users
            WHERE email = ${credentials.email as string}
            LIMIT 1
          `
          const user = rows[0]
          if (!user) return null
          const valid = await bcrypt.compare(credentials.password as string, user.password_hash as string)
          if (!valid) return null
          return { id: user.id as string, email: user.email as string }
        } catch {
          return null
        }
      },
    }),
  ],
})
