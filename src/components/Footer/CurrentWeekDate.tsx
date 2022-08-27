import type { FC } from 'react'

import dayjs from 'src/lib/dayjs'
import type { Week } from 'src/store/week'
import { ReactComponent as ArrowLeftSvg } from 'src/assets/arrow-left.svg'

const DateNumber: FC = ({ children }) => (
  <span className="px-2 text-xl leading-5 border-b-2 border-primary font-body">{children}</span>
)

const DateSlash: FC = () => <span className="text-xl leading-6 font-display text-tertiary">/</span>

type Props = {
  currentWeek: Week
}

const CurrentWeekDate: FC<Props> = ({ currentWeek }) => {
  const week = {
    start: dayjs(currentWeek[0]).format('DD MM').split(' '),
    end: dayjs(currentWeek[1]).format('DD MM').split(' '),
  }

  return (
    <div className="footer-date-container">
      <h2 className="text-lg font-display text-tertiary">Date</h2>
      <div className="flex">
        <DateNumber>{week.start[0]}</DateNumber>
        <DateSlash />
        <DateNumber>{week.start[1]}</DateNumber>
        <ArrowLeftSvg className="w-4 h-4 transform rotate-[215deg] self-start -mt-1 icon-primary" />
        <DateNumber>{week.end[0]}</DateNumber>
        <DateSlash />
        <DateNumber>{week.end[1]}</DateNumber>
      </div>
      <h2 className="text-lg font-display text-tertiary">Week nº</h2>
      <DateNumber>{dayjs(currentWeek[0]).subtract(1, 'day').week()}</DateNumber>
    </div>
  )
}

export default CurrentWeekDate
