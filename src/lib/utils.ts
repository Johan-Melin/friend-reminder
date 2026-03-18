import { type ContactCategory } from './types'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDaysOverdue(daysOverdue: number | null): string {
  if (daysOverdue === null) return 'Never contacted'
  if (daysOverdue > 0) return `${daysOverdue}d overdue`
  if (daysOverdue === 0) return 'Due today'
  if (daysOverdue >= -7) return `Due in ${Math.abs(daysOverdue)}d`
  return `On track`
}

export function getOverdueStatus(daysOverdue: number | null): 'never' | 'overdue' | 'due-soon' | 'ok' {
  if (daysOverdue === null) return 'never'
  if (daysOverdue > 0) return 'overdue'
  if (daysOverdue >= -7) return 'due-soon'
  return 'ok'
}

export function getStatusColor(daysOverdue: number | null): string {
  const status = getOverdueStatus(daysOverdue)
  switch (status) {
    case 'never': return 'bg-red-100 text-red-700 border-red-200'
    case 'overdue': return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'due-soon': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'ok': return 'bg-green-100 text-green-700 border-green-200'
  }
}

export function getProgressBarColor(daysOverdue: number | null): string {
  const status = getOverdueStatus(daysOverdue)
  switch (status) {
    case 'never': return 'bg-red-500'
    case 'overdue': return 'bg-orange-500'
    case 'due-soon': return 'bg-yellow-500'
    case 'ok': return 'bg-green-500'
  }
}

export function getCategoryColor(category: ContactCategory): string {
  switch (category) {
    case 'friend': return 'bg-blue-100 text-blue-700'
    case 'family': return 'bg-purple-100 text-purple-700'
    case 'colleague': return 'bg-gray-100 text-gray-700'
    case 'other': return 'bg-teal-100 text-teal-700'
  }
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getProgressPercent(daysSince: number | null, targetDays: number): number {
  if (daysSince === null) return 100
  return Math.min(100, Math.round((daysSince / targetDays) * 100))
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
