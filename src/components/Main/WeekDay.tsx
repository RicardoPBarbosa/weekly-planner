import { useState, useEffect, PropsWithChildren } from 'react'

import { ReactComponent as ArrowLeftSvg } from 'src/assets/arrow-left.svg'

const WeekDayName = ({ children }: PropsWithChildren) => (
  <div className="relative z-0 w-min">
    <div className="px-2 -mt-4 -ml-2 text-lg tracking-wide bg-secondary text-tertiary font-display w-max rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md">
      {children}
    </div>
  </div>
)

const NotesTitle = ({ children }: PropsWithChildren) => (
  <div className="relative z-0 w-min">
    <div className="px-2 -mt-3 -ml-2 tracking-wide text-white transform bg-primary font-display w-max rounded-tl-md rounded-tr-xl rounded-bl-xl rounded-br-md -rotate-6">
      {children}
    </div>
    <ArrowLeftSvg className="absolute w-5 h-5 transform -rotate-90 top-1 -right-5" />
  </div>
)

type Props = {
  day: string
  value: string
  updateWeekData: (value: string) => void
  prepareNextWeek?: () => void
}

const WeekDay = ({ day, value, updateWeekData, prepareNextWeek }: Props) => {
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
