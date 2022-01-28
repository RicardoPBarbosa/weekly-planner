import type { FC } from 'react'
import { useState } from 'react'

import type { TopTask } from 'src/store/data'
import Modal from 'src/components/shared/Modal'
import GoalNumber from 'src/components/shared/GoalNumber'

type GoalRowProps = {
  number: number
  text: string
  setText: (text: string) => void
}

const GoalRow: FC<GoalRowProps> = ({ number, text, setText }) => (
  <div className={`flex items-end space-x-2${number < 3 ? ' mb-4' : ''}`}>
    <GoalNumber>{number}</GoalNumber>
    <input
      type="text"
      className="goal-input"
      onChange={({ target: { value } }) => setText(value)}
      value={text}
    />
  </div>
)

type Props = {
  submit: (goals: TopTask[]) => void
  close: () => void
}

const PrepareNextWeekModal: FC<Props> = ({ submit, close }) => {
  const [goals, setGoals] = useState<TopTask[]>([])

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
          />
        ))}
      </div>
      <div className="w-full flex justify-between items-center pt-3">
        <button className="go-back-btn" onClick={close}>
          X Cancel
        </button>
        <button className="continue-btn" onClick={() => submit(goals)}>
          Submit -&gt;
        </button>
      </div>
    </Modal>
  )
}

export default PrepareNextWeekModal
