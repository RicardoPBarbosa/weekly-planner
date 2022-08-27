import type { FC } from 'react'
import { useState, useEffect } from 'react'

import { MoodType } from 'src/types'
import { moods } from 'src/helpers/moods'
import type { Data } from 'src/store/data'
import Title from 'src/components/shared/Title'

type MoodProps = {
  active: boolean
  onClick: () => void
}

const Mood: FC<MoodProps> = ({ children, onClick, active }) => (
  <button
    className={`transition-all ${active ? 'emoji-active' : 'hover:opacity-60'}`}
    onClick={onClick}
  >
    {children}
  </button>
)

type Props = {
  weekData?: Data
  updateWeekData: (data: Partial<Data>) => void
}

const WeekMood: FC<Props> = ({ weekData, updateWeekData }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null | undefined>(weekData?.mood)

  useEffect(() => {
    setSelectedMood(weekData?.mood)
  }, [weekData])

  const handleMoodSelection = (mood: MoodType) => {
    setSelectedMood(mood)
    updateWeekData({ mood })
  }

  return (
    <div className="flex flex-wrap items-center space-x-5 space-y-4 sm:space-y-0">
      <Title>This week was...</Title>
      <div className="flex space-x-6">
        {Object.entries(moods({ className: 'w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10' })).map(
          ([moodType, element]) => (
            <Mood
              key={moodType}
              onClick={() => handleMoodSelection(Number(moodType))}
              active={selectedMood === Number(moodType)}
            >
              {element}
            </Mood>
          )
        )}
      </div>
    </div>
  )
}

export default WeekMood
