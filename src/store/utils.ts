import { Data } from './data'
import dayjs from 'src/lib/dayjs'
import { DEFAULT_WEEK } from './week'
import { isSameWeek } from 'src/helpers/date'
import { upsertData, upsertYearData } from 'src/database'
import { UpdatedEntry, Year, YearEntry } from './year-view'
import { DEFAULT_TRACKER, TrackingName } from './constants'

const createWeekEntry = (newWeekData: Partial<Data>): Data => {
  return {
    week: newWeekData.week || DEFAULT_WEEK,
    topThree: newWeekData.topThree || [],
    tracker: {
      [TrackingName.EXERCISE]: newWeekData.tracker?.Exercise || DEFAULT_TRACKER.Exercise,
      [TrackingName.HEALTHY_EATING]:
        newWeekData.tracker?.['Healthy eating'] || DEFAULT_TRACKER['Healthy eating'],
      [TrackingName.LITERS_OF_WATER]:
        newWeekData.tracker?.['Liters of water'] || DEFAULT_TRACKER['Liters of water'],
    },
    mood: null,
    weekTasks: newWeekData.weekTasks || {},
    userId: newWeekData.userId || '',
    updatedAt: dayjs(),
  }
}

const addNewEntry = (data: Data[], entry: Data): Data[] => {
  let insertionIndex = -1
  for (const [index, value] of data.entries()) {
    if (dayjs(value.week[0]).isBefore(dayjs(entry.week[0]))) {
      insertionIndex = index
      break
    }
  }

  if (insertionIndex > -1) {
    data.splice(insertionIndex, 0, entry)
  } else {
    data.push(entry)
  }

  return data
}

const manageWeekEntry = (data: Data[], weekData: Partial<Data>, withAuth: boolean) => {
  if (weekData.week && weekData.week.length === 2) {
    const [startOfWeek, endOfWeek] = weekData.week
    const weekToEditIndex = data.findIndex(({ week }) => isSameWeek([startOfWeek, endOfWeek], week))
    if (weekToEditIndex > -1) {
      const updatedWeek = { ...data[weekToEditIndex], ...weekData }
      data[weekToEditIndex] = updatedWeek
      if (withAuth && updatedWeek.userId) {
        upsertData([data[weekToEditIndex]], updatedWeek.userId)
      }
    } else {
      const newWeekEntry = createWeekEntry(weekData)
      data = addNewEntry(data, newWeekEntry)
      if (withAuth && weekData.userId) {
        upsertData([newWeekEntry], weekData.userId)
      }
    }
  }

  return data
}

const addOrUpdateEntry = (entries: YearEntry[], entry: UpdatedEntry) => {
  const existingEntry = entries.find(
    (e) => e.month === entry.date.month && e.day === entry.date.day
  )
  if (existingEntry) {
    if (entry.content.trim().length) {
      return entries.map((e) => {
        if (e.month === entry.date.month && e.day === entry.date.day) {
          return {
            ...e,
            content: entry.content,
          }
        }
        return e
      })
    } else {
      return entries.filter((e) => !(e.month === entry.date.month && e.day === entry.date.day))
    }
  }

  return [...entries, { month: entry.date.month, day: entry.date.day, content: entry.content }]
}

const manageYearUpdate = (data: Year[], entry: UpdatedEntry, withAuth: boolean) => {
  const newEntry = {
    month: entry.date.month,
    day: entry.date.day,
    content: entry.content,
  }
  const currentYearIndex = data.findIndex(({ year }) => year === entry.date.year)
  if (currentYearIndex > -1) {
    const updatedYearEntries = addOrUpdateEntry(data[currentYearIndex].entries, entry)
    data[currentYearIndex] = {
      ...data[currentYearIndex],
      entries: updatedYearEntries,
    }
    if (withAuth && entry.userId) {
      upsertYearData(entry.date.year, updatedYearEntries, entry.userId)
    }
  } else {
    data.push({
      year: entry.date.year,
      entries: [newEntry],
      updatedAt: dayjs(),
      userId: entry.userId || '',
    })
    if (withAuth && entry.userId) {
      upsertYearData(entry.date.year, [newEntry], entry.userId)
    }
  }

  return data
}

export { manageWeekEntry, manageYearUpdate }
