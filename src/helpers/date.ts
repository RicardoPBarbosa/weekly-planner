import dayjs from 'src/lib/dayjs'
import type { Dayjs } from 'dayjs'
import type { Week } from 'src/store/week'

export type WeekRange = { from: Date; to: Date }

const getWeekRange = (date: Date): WeekRange => ({
  from: dayjs(date).startOf('week').toDate(),
  to: dayjs(date).endOf('week').toDate(),
})

const getWeekDays = (weekStart: Date): Date[] => {
  const start = getWeekRange(weekStart).from
  const days = [start]
  for (let i = 1; i < 7; i += 1) {
    days.push(dayjs(start).add(i, 'days').toDate())
  }
  return days
}

const isSameWeek = ([itemStart, itemEnd]: Week, [currentStart, currentEnd]: Week) =>
  dayjs(itemStart, 'YYYY-MM-DDTHH:mm:ss').isSame(dayjs(currentStart), 'day') &&
  dayjs(itemEnd, 'YYYY-MM-DDTHH:mm:ss').isSame(dayjs(currentEnd), 'day')

const isBeforeOrSameDate = (date1: string | Dayjs, date2: string | Dayjs) =>
  dayjs(date1, 'YYYY-MM-DDTHH:mm:ss').isBefore(dayjs(date2, 'YYYY-MM-DDTHH:mm:ss')) ||
  dayjs(date1, 'YYYY-MM-DDTHH:mm:ss').isSame(dayjs(date2, 'YYYY-MM-DDTHH:mm:ss'))

const isDuringWeek = (date: Dayjs, week: Week) =>
  date.isAfter(dayjs(week[0])) && date.isBefore(dayjs(week[1]))

export { getWeekRange, getWeekDays, isSameWeek, isBeforeOrSameDate, isDuringWeek }
