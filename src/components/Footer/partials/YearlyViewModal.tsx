import dayjs from 'dayjs'
import { useState } from 'react'

// import useDataStore from 'src/store/data'
import Modal from 'src/components/shared/Modal'

type Props = {
  close: () => void
}

const months = dayjs.months()
const currentYear = dayjs().year()

function isWeekend(date: dayjs.Dayjs) {
  return date.format('dddd') === 'Saturday' || date.format('dddd') === 'Sunday'
}

const YearlyViewModal = ({ close }: Props) => {
  // const data = useDataStore(({ data }) => data)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [editing, setEditing] = useState<[string, number] | undefined>()

  function goTo(number: number) {
    setSelectedYear((prev) => prev + number)
  }

  return (
    <Modal
      title="Yearly View"
      onClick={close}
      additionalEl={
        <div className="flex items-center gap-3 text-2xl font-display">
          <span className="w-12 pt-1 text-secondary">{selectedYear}</span>
          <button
            className="px-3 pt-2 pb-1 leading-none transition-all bg-gray-100 rounded-xl text-tertiary hover:bg-gray-200"
            onClick={() => goTo(-1)}
          >
            &lt;-
          </button>
          <button
            className="px-3 pt-2 pb-1 leading-none transition-all bg-gray-100 rounded-xl text-tertiary hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100"
            onClick={() => goTo(1)}
            disabled={selectedYear === currentYear}
          >
            -&gt;
          </button>
        </div>
      }
      modalStyles="w-screen"
    >
      <div className="flex pb-2 overflow-x-auto xl:justify-around">
        {months.map((month, idx) => {
          const monthDate = dayjs().utc().year(selectedYear).month(idx).startOf('month')
          const lastMonths = ['November', 'December'].includes(month)
          return (
            <div key={month} className="flex flex-col flex-1">
              <span
                className={`sticky z-10 top-0 bg-[#D0EEDF] tracking-wide font-display !min-w-[100px] text-tertiary text-center py-1 border-primary${
                  idx === 11 ? '' : ' border-r'
                }`}
              >
                {monthDate.format('MMMM')}
              </span>
              <div className="max-h-[calc(100vh-150px)]">
                <div
                  className={`divide-y border-b border-gray-300${idx === 11 ? '' : ' border-r'}`}
                >
                  {Array.from(Array(monthDate.daysInMonth())).map((_, i) => (
                    <div key={`${month}-${i}`} className="relative">
                      <button
                        className={`flex py-1 hover:bg-gray-100 transition-all w-full px-2 ${
                          isWeekend(monthDate.date(i + 1))
                            ? 'bg-secondary/20 hover:bg-secondary/50'
                            : ''
                        } ${editing?.[0] === month && editing?.[1] === i + 1 ? '!bg-primary' : ''}`}
                        onClick={() => setEditing([month, i + 1])}
                      >
                        <span className="text-sm font-medium opacity-40 font-body">{i + 1}</span>
                      </button>
                      {editing?.[0] === month && editing?.[1] === i + 1 && (
                        <div className={`absolute ${lastMonths ? 'right-1' : 'left-1'} z-50`}>
                          <input
                            type="text"
                            autoFocus
                            className={`${
                              lastMonths ? 'rounded-tl-lg' : 'rounded-tr-lg'
                            } rounded-br-lg rounded-bl-xl focus:ring-primary/50 focus:ring-2 !ring-offset-1 ring-offset-white border-2 !border-primary outline-none`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

export default YearlyViewModal
