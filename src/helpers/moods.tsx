import { MoodType } from 'src/types'

import { ReactComponent as Great } from 'src/assets/emojis/great.svg'
import { ReactComponent as Cool } from 'src/assets/emojis/cool.svg'
import { ReactComponent as Ok } from 'src/assets/emojis/ok.svg'
import { ReactComponent as Sad } from 'src/assets/emojis/sad.svg'
import { ReactComponent as Wasted } from 'src/assets/emojis/wasted.svg'

type Props = {
  className?: string
}

export const moods = (props?: Props) => ({
  [MoodType.GREAT]: <Great className={props?.className || 'w-6 h-6 inline'} />,
  [MoodType.COOL]: <Cool className={props?.className || 'w-6 h-6 inline'} />,
  [MoodType.OK]: <Ok className={props?.className || 'w-6 h-6 inline'} />,
  [MoodType.SAD]: <Sad className={props?.className || 'w-6 h-6 inline'} />,
  [MoodType.WASTED]: <Wasted className={props?.className || 'w-6 h-6 inline'} />,
})
