import type { FC } from 'react'
import { useState } from 'react'
import 'react-day-picker/lib/style.css'
import DayPicker from 'react-day-picker'

import dayjs from 'src/lib/dayjs'
import { Week } from 'src/store/week'
import { isDuringWeek, WeekRange, getWeekDays, getWeekRange } from 'src/helpers/date'

const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Props = {
  back: () => void
  existingWeeks: Week[]
  createWeekEntry: (week: Week) => void
}

const WeekPicker: FC<Props> = ({ back, existingWeeks, createWeekEntry }) => {
  const [hoverRange, setHoverRange] = useState<WeekRange>()
  const [selectedWeek, setSelectedWeek] = useState<Date[]>([
    dayjs().subtract(1, 'week').startOf('week').toDate(),
    dayjs().subtract(1, 'week').endOf('week').toDate(),
  ])

  const handleDayEnter = (date: Date) => {
    setHoverRange(getWeekRange(date))
  }

  const handleDayLeave = () => {
    setHoverRange(undefined)
  }

  const handleWeekClick = (date: Date) => {
    if (existingWeeks.some((week) => isDuringWeek(dayjs(date), week))) {
      return
    }
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

  const buildDisabledWeeks = () =>
    existingWeeks.map((week) => ({
      from: dayjs(week[0]).toDate(),
      to: dayjs(week[1]).toDate(),
    }))

  return (
    <div className="flex flex-col items-start">
      <DayPicker
        weekdayElement={({ weekday }) => (
          <span className="tracking-wide DayPicker-Weekday font-display">
            {week[weekday].slice(0, 3)}
          </span>
        )}
        renderDay={(date) => <div className="text-lg font-body">{date.getDate()}</div>}
        renderWeek={(weekNumber) => (
          <div className="text-lg tracking-wider font-display">{weekNumber}</div>
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
          ...buildDisabledWeeks(),
        ]}
      />
      {/* <div className="flex justify-center w-full">
        <p className="selected-week">
          {dayjs(selectedWeek[0]).format('DD/MM/YYYY')}{' '}
          <span className="font-display text-secondary">-&gt;</span>{' '}
          {dayjs(selectedWeek[1]).format('DD/MM/YYYY')}
        </p>
      </div> */}
      <div className="flex items-center justify-between w-full pt-4">
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
