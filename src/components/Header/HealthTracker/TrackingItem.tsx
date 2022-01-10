import type { FC, FocusEvent } from 'react'

import { TrackingType } from '.'
import { TrackingName } from 'src/store/constants'

const Name: FC = ({ children }) => <div className="tracker-name">{children}</div>

const weekDaysLetter = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

type Props = {
  name: string
  week: { [key: number]: boolean | number }
  type: TrackingType
  onChange: (changes: { [key: number]: boolean | number }) => void
}

const TrackingItem: FC<Props> = ({ name, week, type, onChange }) => {
  const handleChange = (weekDay: number, value: string) => {
    const clone = { ...week }
    if (type === TrackingType.CHECKBOX) {
      clone[weekDay] = !clone[weekDay]
    } else {
      clone[weekDay] = Number(value)
    }
    onChange(clone)
  }

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => event.target.select()

  return (
    <div className="flex items-center">
      <div className="w-44">
        <Name>{name}</Name>
      </div>
      {Object.entries(week).map(([weekDay, value]) => (
        <div key={`${name}-${weekDay}`} className="mr-4">
          {name === TrackingName.EXERCISE && (
            <div
              className={`font-display text-xl -mt-7 mb-1 text-center ${
                Number(weekDay) > 4 ? 'text-secondary' : 'text-primary'
              }`}
            >
              {weekDaysLetter[Number(weekDay)]}
            </div>
          )}
          {type === TrackingType.CHECKBOX ? (
            <input
              type="checkbox"
              checked={Boolean(value)}
              className="w-6 h-6 text-secondary focus:ring-primary rounded-full border-2 border-tertiary"
              onChange={(event) => handleChange(Number(weekDay), event.target.value)}
            />
          ) : (
            <input
              type="number"
              step=".1"
              onFocus={handleFocus}
              value={value as number}
              className="drop-input"
              onChange={(event) => handleChange(Number(weekDay), event.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default TrackingItem
