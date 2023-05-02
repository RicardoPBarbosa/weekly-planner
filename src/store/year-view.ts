import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { manageYearUpdate } from './utils'
import { Dayjs } from 'dayjs'

export type YearEntry = {
  month: string
  day: number
  content: string
}
export type Year = {
  id?: string
  year: number
  entries: YearEntry[]
  userId?: string
  updatedAt: Dayjs
}
export type YearDate = { year: number; month: string; day: number }
export type UpdatedEntry = { date: YearDate; content: string; userId?: string }

export interface YearlyView {
  years: Year[]
  setYears: (years: Year[]) => void
  updateYear: (updatedEntry: UpdatedEntry, withAuth: boolean) => void
}

const useYearlyViewStore = create<YearlyView, [['zustand/persist', YearlyView]]>(
  persist(
    (set, get) => ({
      years: [],
      setYears: (years: Year[]) => {
        set({ years })
      },
      updateYear: (updatedEntry: UpdatedEntry, withAuth: boolean) => {
        const updatedData = manageYearUpdate(get().years, updatedEntry, withAuth)
        set({ years: updatedData })
      },
    }),
    {
      name: 'weekly-planner-yearly-data',
      version: Number(import.meta.env.npm_package_version) || 1,
    }
  )
)

export default useYearlyViewStore
