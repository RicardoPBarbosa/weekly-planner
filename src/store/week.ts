import { create } from 'zustand'
import type { Dayjs } from 'dayjs'

import dayjs from 'src/lib/dayjs'

export type Week = [Dayjs, Dayjs]

export const DEFAULT_WEEK: Week = [dayjs().startOf('week'), dayjs().endOf('week')]

export interface CurrentWeekState {
  current: Week
  setCurrentWeek: (week: Week) => void
}

const useCurrentWeekStore = create<CurrentWeekState>((set) => ({
  current: DEFAULT_WEEK,
  setCurrentWeek: (week: Week) => {
    set(() => ({ current: week }))
  },
}))

export default useCurrentWeekStore
