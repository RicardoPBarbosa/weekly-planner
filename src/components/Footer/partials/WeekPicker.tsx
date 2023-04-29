import { useState } from 'react'
import 'react-day-picker/dist/style.css'
import { DayModifiers, DayPicker } from 'react-day-picker'

import dayjs from 'src/lib/dayjs'
import { Week } from 'src/store/week'
import { isDuringWeek, WeekRange, getWeekDays, getWeekRange } from 'src/helpers/date'

const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Props = {
  back: () => void
  existingWeeks: Week[]
  createWeekEntry: (week: Week) => void
}

const WeekPicker = ({ back, existingWeeks, createWeekEntry }: Props) => {
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

  const modifiers: DayModifiers = {
    ...(hoverRange && { hoverRange }),
    selectedRange: {
      from: selectedWeek[0],
      to: selectedWeek[6],
    },
    ...(hoverRange && { hoverRangeStart: hoverRange.from }),
    ...(hoverRange && { hoverRangeEnd: hoverRange.to }),
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
    <div className="flex flex-col items-start mt-1">
      <DayPicker
        components={{
          DayContent: ({ date }) => <div className="text-lg font-body">{date.getDate()}</div>,
        }}
        className="!m-0"
        classNames={{
          head_cell: 'tracking-wide font-display text-sm text-gray-500',
        }}
        formatters={{
          formatWeekdayName: (weekday) => week[weekday.getDay()].slice(0, 3),
        }}
        weekStartsOn={1}
        showOutsideDays
        modifiers={modifiers}
        onDayClick={handleWeekClick}
        onDayMouseEnter={handleDayEnter}
        onDayMouseLeave={handleDayLeave}
        toMonth={new Date()}
        selected={getWeekDays(selectedWeek[0])}
        disabled={[
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
