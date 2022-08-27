import dayjs from 'dayjs'
import { useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import { BsArrowReturnRight } from 'react-icons/bs'

import { MoodType } from 'src/types'
import { moods } from 'src/helpers/moods'
import useDataStore from 'src/store/data'

const NumberWrapper = ({ children }: { children: ReactNode }) => (
  <strong className="px-2 text-lg tracking-wider bg-gray-100 rounded-md">{children}</strong>
)

type Props = {
  back: () => void
  reviewYear: number
}

const YearReview: FC<Props> = ({ back, reviewYear }) => {
  const data = useDataStore(({ data }) =>
    data.filter((item) => dayjs(item.week[0]).subtract(1, 'day').year() === reviewYear)
  )

  const moodCounter = useMemo(() => {
    const moodsWithCount = {
      [MoodType.GREAT]: 0,
      [MoodType.COOL]: 0,
      [MoodType.OK]: 0,
      [MoodType.SAD]: 0,
      [MoodType.WASTED]: 0,
    }
    data.forEach((item) => {
      if (item.mood !== null) {
        moodsWithCount[item.mood] = (moodsWithCount[item.mood] || 0) + 1
      }
    })
    return moodsWithCount
  }, [data])

  const weekGoalsCounter = useMemo((): { achieved: number; total: number; percentage: number } => {
    const total = data.reduce((prev, curr) => prev + curr.topThree.length, 0)
    const achieved = data.reduce(
      (prev, curr) => prev + curr.topThree.filter((task) => !!task.status).length,
      0
    )
    const percentage = Number(((achieved / total) * 100).toFixed(1))

    return {
      achieved,
      total,
      percentage,
    }
  }, [data])

  const totalDaysTracked = data.length * 7

  const exerciseCounter = useMemo(() => {
    return data.reduce(
      (prev, curr) => prev + Object.values(curr.tracker.Exercise).filter((val) => !!val).length,
      0
    )
  }, [data])

  const healthyEatingCounter = useMemo(() => {
    return data.reduce(
      (prev, curr) =>
        prev + Object.values(curr.tracker['Healthy eating']).filter((val) => !!val).length,
      0
    )
  }, [data])

  const litersOfWaterCounter = useMemo(() => {
    return data.reduce(
      (prev, curr) =>
        prev + Object.values(curr.tracker['Liters of water']).reduce((p, c) => p + c, 0),
      0
    )
  }, [data])

  const oneLiterOrMoreCounter = useMemo(() => {
    return data.reduce(
      (prev, curr) =>
        prev + Object.values(curr.tracker['Liters of water']).filter((val) => val >= 1).length,
      0
    )
  }, [data])

  return (
    <>
      <div className="w-full mt-1 mb-3">
        <h2 className="mb-1 text-xl font-display text-tertiary">Moods</h2>
        <div className="flex flex-row flex-wrap gap-2 mb-4">
          {Object.entries(moodCounter).map(([mood, count]) => (
            <div
              key={mood}
              className="flex justify-between flex-1 w-full p-4 pr-2 rounded-tl-lg rounded-br-lg bg-opacity-10 rounded-bl-2xl rounded-tr-2xl bg-secondary"
            >
              <span className="emoji-splash">{moods()[mood as unknown as MoodType]}</span>
              <span className="ml-6 text-xl font-semibold font-body text-tertiary">{count}</span>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-display text-tertiary">Week Goals</h2>
        <div className="flex gap-2 mb-4">
          <div
            className="w-16 h-16 bg-gray-100 rounded-full"
            style={{
              // eslint-disable-next-line max-len
              background: `conic-gradient(#5AC596 0% ${weekGoalsCounter.percentage}%, #F3F4F6 ${weekGoalsCounter.percentage}% 100%)`,
            }}
          />
          <div className="flex flex-col justify-between py-1 font-body">
            <p>
              Achieved <NumberWrapper>{weekGoalsCounter.achieved}</NumberWrapper> of a total of{' '}
              <NumberWrapper>{weekGoalsCounter.total}</NumberWrapper> goals
            </p>
            <p className="text-tertiary">
              <NumberWrapper>{weekGoalsCounter.percentage}% success rate</NumberWrapper>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-display">
            Health Tracker Stats{' '}
            <small className="font-body">
              (for a total of <NumberWrapper>{totalDaysTracked}</NumberWrapper> days)
            </small>
          </h2>
          <p className="font-body">
            Exercised <NumberWrapper>{exerciseCounter}</NumberWrapper> times
          </p>
          <p className="font-body">
            Ate healthy <NumberWrapper>{healthyEatingCounter}</NumberWrapper> times
          </p>
          <p className="font-body">
            Drank <NumberWrapper>{Number(litersOfWaterCounter.toFixed(1))}</NumberWrapper> liters of
            water
            <br />
            <span className="flex flex-row flex-wrap items-center gap-1">
              <BsArrowReturnRight size="14" /> and reached the{' '}
              <b>
                <NumberWrapper>
                  1L<small>+</small> / day
                </NumberWrapper>
              </b>
              mark <NumberWrapper>{oneLiterOrMoreCounter}</NumberWrapper> times
            </span>
          </p>
        </div>
        <b></b>
      </div>
      <button className="go-back-btn" onClick={back}>
        &lt;- Go back
      </button>
    </>
  )
}

export default YearReview
