import Goal from './partials/Goal'
import type { TopTask } from 'src/store/data'
import Title from 'src/components/shared/Title'
import { ReactComponent as ArrowLeftSvg } from 'src/assets/arrow-left.svg'

const LocalTitle = () => (
  <div className="relative w-min -z-10">
    <Title className="transform -rotate-2">TOP 3 GOALS for the week</Title>
    <ArrowLeftSvg className="absolute w-6 h-6 transform -rotate-45 top-3 -right-5" />
  </div>
)

type Props = {
  topThree: TopTask[]
  updateWeekData: (task: TopTask) => void
}

const Top3 = ({ topThree, updateWeekData }: Props) => (
  <div className="flex-1">
    <LocalTitle />
    <div className="mt-3">
      {[1, 2, 3].map((taskNumber) => (
        <Goal
          key={`toptask-${taskNumber}`}
          number={taskNumber as 1 | 2 | 3}
          task={topThree.find((task) => task.position === taskNumber)}
          updateWeekData={updateWeekData}
        />
      ))}
    </div>
  </div>
)

export default Top3
