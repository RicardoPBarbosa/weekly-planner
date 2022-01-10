import type { DocumentData } from 'firebase/firestore'

import dayjs from 'src/lib/dayjs'
import { DEFAULT_TRACKER } from 'src/store/constants'
import type { TrackingName } from 'src/store/constants'
import type { Data, TopTask, Tracker } from 'src/store/data'

const buildWeekDaysObject = (data: Data | undefined, index: number, value: string) => {
  let weekTasks: { [key: number]: string } = {}
  if (data && data.weekTasks) {
    weekTasks = JSON.parse(JSON.stringify(data.weekTasks))
  }
  weekTasks[index] = value

  return { weekTasks }
}

const buildTopThreeObject = (data: Data | undefined, task: TopTask) => {
  let topThree: TopTask[] = []
  if (data && data.topThree) {
    topThree = JSON.parse(JSON.stringify(data.topThree))
    const taskIndex = topThree.findIndex((top) => top.position === task.position)
    if (taskIndex > -1) {
      if (topThree[taskIndex].text !== task.text || topThree[taskIndex].status !== task.status) {
        topThree[taskIndex] = task
      }
    } else {
      topThree.push(task)
    }
  } else {
    topThree.push(task)
  }

  return { topThree }
}

const buildTrackerObject = (
  data: Data | undefined,
  trackName: TrackingName,
  trackerItem: { [key: number]: number | boolean }
) => {
  let tracker: Tracker = DEFAULT_TRACKER
  if (data && data.tracker) {
    tracker = JSON.parse(JSON.stringify(data.tracker))
  }
  tracker[trackName] = trackerItem as any

  return { tracker }
}

const assignUserToData = (data: Data[], userId: string) =>
  data.map((row) => {
    if (!row.userId?.length) {
      row.userId = userId
    }
    return row
  })

const convertFirebaseDataToLocal = (data: DocumentData): Data => ({
  ...(data as Data),
  week: [dayjs(data.week[0]), dayjs(data.week[1])],
  updatedAt: dayjs(data.updatedAt),
})

export {
  buildWeekDaysObject,
  buildTopThreeObject,
  buildTrackerObject,
  assignUserToData,
  convertFirebaseDataToLocal,
}
