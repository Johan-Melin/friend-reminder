export type ContactCategory = 'friend' | 'family' | 'colleague' | 'other'
export type EventType = 'call' | 'text' | 'email' | 'in-person' | 'other'

export interface Contact {
  id: string
  user_id: string
  name: string
  category: ContactCategory
  target_frequency_days: number
  notes: string | null
  should_contact: boolean
  created_at: string
  updated_at: string
}

export interface ContactEvent {
  id: string
  contact_id: string
  user_id: string
  event_date: string
  type: EventType
  notes: string | null
  created_at: string
}

export interface ContactWithStatus extends Contact {
  last_contact_date: string | null
  days_since_contact: number | null
  days_overdue: number | null
  total_events: number
}
