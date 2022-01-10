import type { FC } from 'react'
import { useState, useEffect } from 'react'

import type { TopTask } from 'src/store/data'

const Number: FC = ({ children }) => <div className="goal-number">{children}</div>

enum ChangeType {
  TEXT,
  STATUS,
}

type Props = {
  number: 1 | 2 | 3
  task?: TopTask
  updateWeekData: (task: TopTask) => void
}

const Goal: FC<Props> = ({ number, task, updateWeekData }) => {
  const [goalText, setGoalText] = useState<string>(task?.text || '')

  useEffect(() => {
    setGoalText(task?.text || '')
  }, [task])

  const submitChange = (type: ChangeType) => {
    if (goalText.trim().length) {
      const updatedTask = {
        position: number,
        status: type === ChangeType.STATUS ? !task?.status : !!task?.status,
        text: goalText.trim(),
      }
      updateWeekData(updatedTask)
    }
  }

  return (
    <div className={`flex items-end space-x-2${number < 3 ? ' mb-4' : ''}`}>
      <Number>{number}</Number>
      <input
        type="text"
        className="goal-input"
        onChange={({ target: { value } }) => setGoalText(value)}
        onBlur={() => submitChange(ChangeType.TEXT)}
        value={goalText}
      />
      <input
        type="checkbox"
        className="goal-checkbox"
        onChange={() => submitChange(ChangeType.STATUS)}
        checked={!!task?.status}
      />
    </div>
  )
}

export default Goal
