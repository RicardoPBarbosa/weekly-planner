import { create } from 'zustand'
import type { Dayjs } from 'dayjs'
import { persist } from 'zustand/middleware'

import { Week } from './week'
import { MoodType } from 'src/types'
import { manageWeekEntry } from './utils'
import { TrackingName } from './constants'

export type Tracker = {
  [TrackingName.EXERCISE]: { [key: number]: boolean }
  [TrackingName.HEALTHY_EATING]: { [key: number]: boolean }
  [TrackingName.LITERS_OF_WATER]: { [key: number]: number }
}

export type TopTask = {
  status: boolean
  text: string
  position: 1 | 2 | 3
}

export interface Data {
  id?: string
  week: Week
  topThree: TopTask[]
  tracker: Tracker
  weekTasks: { [key: number]: string }
  mood: MoodType | null
  userId?: string
  updatedAt: Dayjs
}

export interface DataState {
  data: Data[]
  setData: (data: Data[]) => void
  updateWeek: (weekData: Partial<Data>, withAuth: boolean) => void
}

const useDataStore = create<DataState, [['zustand/persist', DataState]]>(
  persist(
    (set, get) => ({
      data: [],
      setData: (data: Data[]) => {
        set({ data })
      },
      updateWeek: (weekData: Partial<Data>, withAuth: boolean) => {
        const updatedWeeks = manageWeekEntry(get().data, weekData, withAuth)
        set({ data: updatedWeeks })
      },
    }),
    {
      name: 'weekly-planner-data',
      version: Number(import.meta.env.npm_package_version) || 1,
    }
  )
)

export default useDataStore
