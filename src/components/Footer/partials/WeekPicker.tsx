import type { FC } from 'react'
import 'react-day-picker/lib/style.css'
import DayPicker from 'react-day-picker'
import { useState, useEffect } from 'react'

import dayjs from 'src/lib/dayjs'
import { Week } from 'src/store/week'
import type { WeekRange } from 'src/helpers/date'
import { getWeekDays, getWeekRange } from 'src/helpers/date'

const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Props = {
  back: () => void
  currentWeek: Week
  createWeekEntry: (week: Week) => void
}

const WeekPicker: FC<Props> = ({ back, currentWeek, createWeekEntry }) => {
  const [hoverRange, setHoverRange] = useState<WeekRange>()
  const [selectedWeek, setSelectedWeek] = useState<Date[]>([
    dayjs().subtract(1, 'week').startOf('week').toDate(),
    dayjs().subtract(1, 'week').endOf('week').toDate(),
  ])

  useEffect(() => {
    setSelectedWeek([
      dayjs(currentWeek[0]).subtract(1, 'week').startOf('week').toDate(),
      dayjs(currentWeek[0]).subtract(1, 'week').endOf('week').toDate(),
    ])
  }, [currentWeek])

  const handleDayEnter = (date: Date) => {
    setHoverRange(getWeekRange(date))
  }

  const handleDayLeave = () => {
    setHoverRange(undefined)
  }

  const handleWeekClick = (date: Date) => {
    if (dayjs(date).isBefore(dayjs().startOf('week'))) {
      setSelectedWeek([dayjs(date).startOf('week').toDate(), dayjs(date).endOf('week').toDate()])
    }
  }

  const modifiers = {
    hoverRange,
    selectedRange: {
      from: selectedWeek[0],
      to: selectedWeek[6],
    },
    hoverRangeStart: hoverRange && hoverRange.from,
    hoverRangeEnd: hoverRange && hoverRange.to,
    selectedRangeStart: selectedWeek[0],
    selectedRangeEnd: selectedWeek[6],
  }

  const submit = () => {
    createWeekEntry([dayjs(selectedWeek[0]), dayjs(selectedWeek[1])])
  }

  return (
    <div className="flex flex-col items-start">
      <DayPicker
        weekdayElement={({ weekday }) => (
          <span className="DayPicker-Weekday font-display tracking-wide">
            {week[weekday].slice(0, 3)}
          </span>
        )}
        renderDay={(date) => <div className="font-body text-lg">{date.getDate()}</div>}
        renderWeek={(weekNumber) => (
          <div className="font-display text-lg tracking-wider">{weekNumber}</div>
        )}
        firstDayOfWeek={1}
        showOutsideDays
        modifiers={modifiers}
        onDayClick={handleWeekClick}
        onDayMouseEnter={handleDayEnter}
        onDayMouseLeave={handleDayLeave}
        toMonth={new Date()}
        selectedDays={getWeekDays(selectedWeek[0])}
        disabledDays={[
          {
            after: dayjs().subtract(1, 'week').endOf('week').toDate(),
          },
        ]}
      />
      <div className="w-full flex justify-center">
        <p className="selected-week">
          {dayjs(selectedWeek[0]).format('DD/MM/YYYY')}{' '}
          <span className="font-display text-secondary">-&gt;</span>{' '}
          {dayjs(selectedWeek[1]).format('DD/MM/YYYY')}
        </p>
      </div>
      <div className="w-full flex justify-between items-center pt-4">
        <button className="go-back-btn" onClick={back}>
          &lt;- Go back
        </button>
        <button className="continue-btn" onClick={submit}>
          Continue -&gt;
        </button>
      </div>
    </div>
  )
}

export default WeekPicker
