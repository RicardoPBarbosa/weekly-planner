import dayjs from 'dayjs'
import { useState, useEffect } from 'react'

import useDataStore from 'src/store/data'
import { isSameWeek } from 'src/helpers/date'
import type { TopTask } from 'src/store/data'
import Modal from 'src/components/shared/Modal'
import GoalNumber from 'src/components/shared/GoalNumber'
import { Week } from 'src/store/week'

type GoalRowProps = {
  number: number
  text: string
  disabled: boolean
  setText: (text: string) => void
}

const GoalRow = ({ number, text, disabled, setText }: GoalRowProps) => (
  <div className={`flex items-end space-x-2${number < 3 ? ' mb-4' : ''}`}>
    <GoalNumber>{number}</GoalNumber>
    <input
      type="text"
      disabled={disabled}
      className="goal-input"
      onChange={({ target: { value } }) => setText(value)}
      value={text}
    />
  </div>
)

type Props = {
  currentWeek: Week
  submit: (goals: TopTask[]) => void
  close: () => void
}

const PrepareNextWeekModal = ({ currentWeek, submit, close }: Props) => {
  const [goals, setGoals] = useState<TopTask[]>([])
  const [invalidNextWeek, setInvalidNextWeek] = useState(false)
  const week = useDataStore((state) =>
    state.data.find(({ week }) =>
      isSameWeek(week, [dayjs(currentWeek[0]).add(1, 'week'), dayjs(currentWeek[1]).add(1, 'week')])
    )
  )

  useEffect(() => {
    if (week) {
      setInvalidNextWeek(dayjs(week.week[0]).isBefore(dayjs().add(1, 'week').startOf('week')))
      setGoals(week.topThree)
    }
  }, [week])

  const handleTextChange = (taskNumber: 1 | 2 | 3, text: string) => {
    const goalIndex = goals.findIndex((g) => g.position === taskNumber)
    const clone = [...goals]

    if (goalIndex > -1) {
      clone[goalIndex].text = text
    } else {
      clone.push({ position: taskNumber, text, status: false })
    }
    return setGoals(clone)
  }

  return (
    <Modal title="Choose next weeks' goals" onClick={close}>
      <div className="my-5">
        {[1, 2, 3].map((taskNumber) => (
          <GoalRow
            key={`toptask-${taskNumber}`}
            number={taskNumber as 1 | 2 | 3}
            text={goals.find((g) => g.position === taskNumber)?.text || ''}
            setText={(text) => handleTextChange(taskNumber as 1 | 2 | 3, text)}
            disabled={invalidNextWeek}
          />
        ))}
      </div>
      {!invalidNextWeek && (
        <div className="flex items-center justify-between w-full pt-3">
          <button className="go-back-btn" onClick={close}>
            X Cancel
          </button>
          <button className="continue-btn" onClick={() => submit(goals)}>
            Submit -&gt;
          </button>
        </div>
      )}
    </Modal>
  )
}

export default PrepareNextWeekModal
