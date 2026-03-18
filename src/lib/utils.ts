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
    case 'never': return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
    case 'overdue': return 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
    case 'due-soon': return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
    case 'ok': return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
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
    case 'friend': return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
    case 'family': return 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400'
    case 'colleague': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    case 'other': return 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400'
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
