import type { FC } from 'react'
import { useState, useEffect } from 'react'

import { MoodType } from 'src/types'
import type { Data } from 'src/store/data'
import Title from 'src/components/shared/Title'
import { ReactComponent as Great } from 'public/assets/emojis/great.svg'
import { ReactComponent as Cool } from 'public/assets/emojis/cool.svg'
import { ReactComponent as Ok } from 'public/assets/emojis/ok.svg'
import { ReactComponent as Sad } from 'public/assets/emojis/sad.svg'
import { ReactComponent as Wasted } from 'public/assets/emojis/wasted.svg'

const moods = {
  [MoodType.GREAT]: <Great className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10" />,
  [MoodType.COOL]: <Cool className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10" />,
  [MoodType.OK]: <Ok className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10" />,
  [MoodType.SAD]: <Sad className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10" />,
  [MoodType.WASTED]: <Wasted className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10" />,
}

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
    <div className="flex items-center space-x-5 flex-wrap space-y-4 sm:space-y-0">
      <Title>This week was...</Title>
      <div className="flex space-x-6">
        {Object.entries(moods).map(([moodType, element]) => (
          <Mood
            key={moodType}
            onClick={() => handleMoodSelection(Number(moodType))}
            active={selectedMood === Number(moodType)}
          >
            {element}
          </Mood>
        ))}
      </div>
    </div>
  )
}

export default WeekMood
