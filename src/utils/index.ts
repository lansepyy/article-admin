import { subDays, subMonths, subWeeks, subYears } from 'date-fns'
import type { TimeRange } from '@/types/article.ts'

export function getDateRange(range: TimeRange) {
  const now = new Date()

  switch (range) {
    case '7d':
      return { from: formatDate(subDays(now, 7)), to: formatDate(now) }
    case '1w':
      return { from: formatDate(subWeeks(now, 1)), to: formatDate(now) }
    case '1m':
      return { from: formatDate(subMonths(now, 1)), to: formatDate(now) }
    case '1y':
      return { from: formatDate(subYears(now, 1)), to: formatDate(now) }
    default:
      return undefined
  }
}

export function formatDate(date?: Date) {
  if (!date) return ''
  return date.toISOString().slice(0, 10)
}
