import type { FC } from 'react'
import { useMemo, useState } from 'react'

import dayjs from 'src/lib/dayjs'
import { MoodType } from 'src/types'
import WeekPicker from './WeekPicker'
import useDataStore from 'src/store/data'
import type { Data } from 'src/store/data'
import type { Week } from 'src/store/week'
import { isSameWeek } from 'src/helpers/date'
import Modal from 'src/components/shared/Modal'
import useCurrentWeekStore from 'src/store/week'
import { HiOutlineCalendar } from 'react-icons/hi'

import { ReactComponent as Great } from 'public/assets/emojis/great.svg'
import { ReactComponent as Cool } from 'public/assets/emojis/cool.svg'
import { ReactComponent as Ok } from 'public/assets/emojis/ok.svg'
import { ReactComponent as Sad } from 'public/assets/emojis/sad.svg'
import { ReactComponent as Wasted } from 'public/assets/emojis/wasted.svg'

const moods = {
  [MoodType.GREAT]: <Great className="w-6 h-6" />,
  [MoodType.COOL]: <Cool className="w-6 h-6" />,
  [MoodType.OK]: <Ok className="w-6 h-6" />,
  [MoodType.SAD]: <Sad className="w-6 h-6" />,
  [MoodType.WASTED]: <Wasted className="w-6 h-6" />,
}

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
    <p className="font-display text-gray-500">
      Week <b className="font-body text-gray-800">{weekNumber}</b>
    </p>
    <p className="font-body text-lg tracking-wider flex-1">
      {weekStart} <span className="font-display text-lg text-secondary mx-2">-&gt;</span> {weekEnd}
    </p>
    {mood !== null && <span className="emoji-splash">{moods[mood]}</span>}
  </button>
)

type Props = {
  close: () => void
}

const History: FC<Props> = ({ close }) => {
  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const data = useDataStore(({ data }) => data)
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

  return (
    <Modal title={showCalendar ? 'Select week' : 'History'} onClick={close}>
      {showCalendar ? (
        <WeekPicker
          back={() => setShowCalendar(false)}
          existingWeeks={data.map((d) => d.week)}
          createWeekEntry={(week) => handleOpenWeek(week)}
        />
      ) : (
        <>
          <div className="bg-gradient-to-b from-white h-8 -mb-8 relative z-10" />
          <div className="max-h-72 overflow-y-auto no-scrollbar py-5">
            {formattedData.map(([year, items]) => (
              <div key={year}>
                <h2 className="font-display text-xl text-secondary">{year}</h2>
                <div className="flex flex-col space-y-3 mb-4">
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
              <p className="font-display text-xl text-gray-800">No entries found</p>
            )}
          </div>
          <div className="bg-gradient-to-t from-white h-8 -mt-8 relative z-10" />
          <div className="flex justify-center">
            <button className="create-btn" onClick={() => setShowCalendar(true)}>
              <HiOutlineCalendar size={20} />
              <span className="font-display">Create an entry on the past</span>
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}

export default History
