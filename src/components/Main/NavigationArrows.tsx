import dayjs from 'dayjs'
import React, { FC, ReactElement, useMemo } from 'react'

import useCurrentWeekStore, { Week } from 'src/store/week'
import { ReactComponent as ArrowLeftSvg } from 'src/assets/arrow-left.svg'
import { ReactComponent as ArrowRightSvg } from 'src/assets/arrow-right.svg'

type ArrowProps = {
  icon: ReactElement
  onClick: () => void
  disabled?: boolean
  direction: 'left' | 'right'
}

const ArrowElement = ({ icon, onClick, disabled, direction }: ArrowProps) => {
  return (
    <button
      className="flex items-center justify-center w-12 h-12 transition-all bg-gray-100 rounded-full hover:bg-gray-200 group disabled:opacity-20"
      onClick={onClick}
      disabled={disabled}
    >
      {React.cloneElement(icon, {
        className: `w-5 h-5 transform ${
          direction === 'left' ? 'rotate-[140deg]' : '-rotate-[140deg]'
        } opacity-60 group-hover:opacity-100`,
      })}
    </button>
  )
}

const NavigationArrows: FC = () => {
  const { current, setCurrentWeek } = useCurrentWeekStore((state) => state)
  const previousWeek: Week = useMemo(() => {
    const prevWeekDay = dayjs(current[0]).subtract(1, 'day')
    return [prevWeekDay.startOf('week'), prevWeekDay.endOf('week')]
  }, [current])
  const nextWeek: Week = useMemo(() => {
    const nextWeekDay = dayjs(current[1]).add(1, 'day')
    return [nextWeekDay.startOf('week'), nextWeekDay.endOf('week')]
  }, [current])

  return (
    <>
      <div className="hidden -translate-y-1/2 lg:block lg:absolute -left-16 top-1/2">
        <ArrowElement
          icon={<ArrowRightSvg />}
          direction="left"
          onClick={() => setCurrentWeek(previousWeek)}
        />
      </div>
      <div className="hidden -translate-y-1/2 lg:block lg:absolute -right-16 top-1/2">
        <ArrowElement
          icon={<ArrowLeftSvg />}
          direction="right"
          onClick={() => setCurrentWeek(nextWeek)}
          disabled={dayjs(nextWeek[1]).isAfter(dayjs().endOf('week'))}
        />
      </div>
    </>
  )
}

export default NavigationArrows
