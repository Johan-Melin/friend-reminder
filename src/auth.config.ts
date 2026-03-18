import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl
      const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')

      if (!isLoggedIn && !isAuthRoute) {
        return Response.redirect(new URL('/login', nextUrl))
      }
      if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
  providers: [],
}
