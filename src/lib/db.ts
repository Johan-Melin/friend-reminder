import { neon } from '@neondatabase/serverless'

// Return a new neon client each call — neon() is stateless/lightweight
export function getDb() {
  return neon(process.env.DATABASE_URL!)
}
