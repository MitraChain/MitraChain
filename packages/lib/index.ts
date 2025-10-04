import { formatInTimeZone, toZonedTime } from 'date-fns-tz'
import { id } from 'date-fns/locale'

export * from './maskito'

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred.'
}

export function formatWIBTimeDate(date: string) {
  const timeZone = 'Asia/Jakarta'
  const utcDate = new Date(`${date}Z`)
  const zonedDate = toZonedTime(utcDate, timeZone)

  return formatInTimeZone(zonedDate, 'Asia/Jakarta', 'dd MMM yyyy HH:mm:ss', { locale: id })
}
