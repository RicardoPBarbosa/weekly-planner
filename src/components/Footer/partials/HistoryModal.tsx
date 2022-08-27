import { useState } from 'react'
import type { FC, ReactElement } from 'react'

import History from './History'
import dayjs from 'src/lib/dayjs'
import WeekPicker from './WeekPicker'
import YearReview from './YearReview'
import { ModalViews } from 'src/types'
import useDataStore from 'src/store/data'
import type { Week } from 'src/store/week'
import Modal from 'src/components/shared/Modal'
import useCurrentWeekStore from 'src/store/week'

type Props = {
  close: () => void
}

const HistoryModal: FC<Props> = ({ close }) => {
  const [currentView, setCurrentView] = useState<ModalViews>(ModalViews.HISTORY)
  const [reviewYear, setReviewYear] = useState<number>(dayjs().year())
  const data = useDataStore(({ data }) => data)
  const { setCurrentWeek } = useCurrentWeekStore((state) => state)

  const handleOpenWeek = (week: Week) => {
    setCurrentWeek([dayjs(week[0]), dayjs(week[1])])
    close()
  }

  const render: { [key: number]: { title: string; content: ReactElement } } = {
    [ModalViews.HISTORY]: {
      title: 'History',
      content: (
        <History
          close={close}
          setCurrentView={(view, year) => {
            setCurrentView(view)
            if (year) {
              setReviewYear(year)
            }
          }}
          setReviewYear={setReviewYear}
        />
      ),
    },
    [ModalViews.WEEKPICKER]: {
      title: 'Select week',
      content: (
        <WeekPicker
          back={() => setCurrentView(ModalViews.HISTORY)}
          existingWeeks={data.map((d) => d.week)}
          createWeekEntry={(week) => handleOpenWeek(week)}
        />
      ),
    },
    [ModalViews.YEARREVIEW]: {
      title: `Your ${reviewYear} Year`,
      content: (
        <YearReview back={() => setCurrentView(ModalViews.HISTORY)} reviewYear={reviewYear} />
      ),
    },
  }

  return (
    <Modal
      title={render[currentView].title}
      onClick={close}
      modalStyles={currentView === ModalViews.YEARREVIEW ? undefined : 'max-w-md'}
    >
      {render[currentView].content}
    </Modal>
  )
}

export default HistoryModal
