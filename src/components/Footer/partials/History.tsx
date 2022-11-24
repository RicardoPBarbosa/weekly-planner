import type { FC } from 'react'
import { useMemo, useState } from 'react'

import dayjs from 'src/lib/dayjs'
import useDataStore from 'src/store/data'
import { moods } from 'src/helpers/moods'
import type { Data } from 'src/store/data'
import type { Week } from 'src/store/week'
import { isSameWeek } from 'src/helpers/date'
import useCurrentWeekStore from 'src/store/week'
import { ModalViews, MoodType } from 'src/types'
import { HiOutlineCalendar } from 'react-icons/hi'
import { auth } from 'src/lib/firebase'
import { useAuthUser } from '@react-query-firebase/auth'
import { removeDuplicatedData } from 'src/database'

type ItemProps = {
  weekNumber: number
  weekStart: string
  weekEnd: string
  openWeek: () => void
  isCurrentWeek: boolean
  mood: MoodType | null
}

const HistoryItem: FC<ItemProps> = ({
  weekNumber,
  weekStart,
  weekEnd,
  openWeek,
  isCurrentWeek,
  mood,
}) => (
  <button
    onClick={() => (!isCurrentWeek ? openWeek() : {})}
    className={`flex items-center justify-between bg-gray-100 py-3 px-4 rounded space-x-8 transition-all ring-inset ring-secondary ${
      isCurrentWeek ? 'opacity-50 grayscale cursor-default' : 'hover:ring-2 hover:bg-gray-50'
    }`}
  >
    <p className="text-gray-500 font-display">
      Week <b className="text-gray-800 font-body">{weekNumber}</b>
    </p>
    <p className="flex-1 text-lg tracking-wider font-body">
      {weekStart} <span className="mx-2 text-lg font-display text-secondary">-&gt;</span> {weekEnd}
    </p>
    {mood !== null && <span className="emoji-splash">{moods()[mood]}</span>}
  </button>
)

type Props = {
  close: () => void
  setCurrentView: (view: ModalViews, year?: number) => void
  setReviewYear: (year: number) => void
}

const History: FC<Props> = ({ close, setCurrentView }) => {
  const { data: user } = useAuthUser(['user'], auth)
  const [actionRunning, setActionRunning] = useState(false)
  const { data, setData } = useDataStore((state) => state)
  const { current: currentWeek, setCurrentWeek } = useCurrentWeekStore((state) => state)
  const formattedData = useMemo(() => {
    const weekNumberFix = dayjs(currentWeek[0]).subtract(1, 'day')
    let year = weekNumberFix.year()
    const result: { [key: number]: Data[] } = {}
    data.forEach((item) => {
      const itemYear = dayjs(item.week[0]).subtract(1, 'day').year()
      if (itemYear !== year) {
        year = itemYear
      }
      if (result[year]) {
        result[year].push(item)
      } else {
        result[year] = [item]
      }
    })
    return Object.entries(result).sort((a, b) => Number(b[0]) - Number(a[0]))
  }, [data, currentWeek])

  const handleOpenWeek = (week: Week) => {
    setCurrentWeek([dayjs(week[0]), dayjs(week[1])])
    close()
  }

  const handleRemoveDuplicates = async () => {
    if (user?.uid) {
      setActionRunning(true)
      const deduplicatedData = await removeDuplicatedData(user.uid)
      setData(deduplicatedData)
      setActionRunning(false)
    }
  }

  return (
    <>
      <div className="relative z-10 h-8 -mb-8 bg-gradient-to-b from-white" />
      <div className="py-8 overflow-y-auto max-h-72 no-scrollbar">
        {formattedData.map(([year, items]) => (
          <div key={year}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-display text-secondary">{year}</h2>
              <button
                onClick={() => setCurrentView(ModalViews.YEARREVIEW, Number(year))}
                className="px-2 pt-1 text-white transition-all rounded-tl-lg rounded-br-lg hover:bg-secondary rounded-tr-md rounded-bl-md font-body bg-primary"
              >
                Review year
              </button>
            </div>
            <div className="flex flex-col mb-4 space-y-3">
              {items
                .sort((a, b) => dayjs(b.week[0]).diff(dayjs(a.week[0])))
                .map((item) => (
                  <HistoryItem
                    key={dayjs(item.week[0]).format('YYYY-MM-DD')}
                    weekNumber={dayjs(item.week[0]).subtract(1, 'day').week()}
                    weekStart={dayjs(item.week[0]).format('DD/MM')}
                    weekEnd={dayjs(item.week[1]).format('DD/MM')}
                    mood={item.mood}
                    openWeek={() => handleOpenWeek(item.week)}
                    isCurrentWeek={isSameWeek(item.week, currentWeek)}
                  />
                ))}
            </div>
          </div>
        ))}
        {!Object.keys(formattedData).length && (
          <p className="text-xl text-gray-800 font-display">No entries found</p>
        )}
        <button
          className="w-full mt-2 go-back-btn disabled:opacity-30"
          onClick={handleRemoveDuplicates}
          disabled={actionRunning}
        >
          <span className="font-display">Remove duplicates</span>
        </button>
      </div>
      <div className="relative z-10 h-8 -mt-8 bg-gradient-to-t from-white" />
      <div className="flex justify-center">
        <button className="create-btn" onClick={() => setCurrentView(ModalViews.WEEKPICKER)}>
          <HiOutlineCalendar size={20} />
          <span className="font-display">Create an entry on the past</span>
        </button>
      </div>
    </>
  )
}

export default History
