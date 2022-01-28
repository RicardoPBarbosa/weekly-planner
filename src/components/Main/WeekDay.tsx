import type { FC } from 'react'
import { useState, useEffect } from 'react'

import { ReactComponent as ArrowLeftSvg } from 'public/assets/arrow-left.svg'

const WeekDayName: FC = ({ children }) => (
  <div className="relative w-min z-0">
    <div className="bg-secondary text-tertiary font-display w-max px-2 rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md -mt-4 -ml-2 tracking-wide text-lg">
      {children}
    </div>
  </div>
)

const NotesTitle: FC = ({ children }) => (
  <div className="relative w-min z-0">
    <div className="bg-primary text-white font-display w-max px-2 rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md -mt-3 -ml-2 tracking-wide transform -rotate-6">
      {children}
    </div>
    <ArrowLeftSvg className="w-5 h-5 absolute top-1 -right-5 transform -rotate-90" />
  </div>
)

type Props = {
  day: string
  value: string
  updateWeekData: (value: string) => void
  prepareNextWeek?: () => void
}

const WeekDay: FC<Props> = ({ day, value, updateWeekData, prepareNextWeek }) => {
  const [text, setText] = useState<string>(value)
  const isNotesBlock = day === 'Notes'

  useEffect(() => {
    setText(value)
  }, [value])

  const handleSubmitWeekDay = () => {
    if (text.trim().length) {
      updateWeekData(text.trim())
    }
  }

  return (
    <div
      className={`border-2 border-tertiary rounded-br-md h-52 ${
        isNotesBlock ? 'dot-bg' : 'flex flex-col line-bg'
      }`}
    >
      {isNotesBlock ? <NotesTitle>{day}</NotesTitle> : <WeekDayName>{day}</WeekDayName>}
      <textarea
        className="week-day-textarea"
        onChange={({ target: { value } }) => setText(value)}
        onBlur={handleSubmitWeekDay}
        value={text}
      />
      {day === 'SUNDAY' && (
        <button className="group prepare-next-week-btn" onClick={prepareNextWeek}>
          <p className="prepare-next-week">Prepare next week -&gt;</p>
        </button>
      )}
    </div>
  )
}

export default WeekDay
