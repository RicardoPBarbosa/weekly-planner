import { useState } from 'react'

import dayjs from 'src/lib/dayjs'
import { auth } from 'src/lib/firebase'
import Modal from 'src/components/shared/Modal'
import { useAuthUser } from '@react-query-firebase/auth'
import useNetworkStatus from 'src/hooks/useNetworkStatus'
import useYearlyViewStore, { YearEntry } from 'src/store/year-view'

type Props = {
  close: () => void
}

const months = dayjs.months()
const currentYear = dayjs().year()

function isWeekend(date: dayjs.Dayjs) {
  return date.format('dddd') === 'Saturday' || date.format('dddd') === 'Sunday'
}

function getContent(month: string, day: number, entries?: YearEntry[]) {
  return entries?.find((e) => e.month === month && e.day === day)?.content || ''
}

const YearlyViewModal = ({ close }: Props) => {
  const { data: user, isLoading, isStale } = useAuthUser(['user'], auth)
  const isOffline = useNetworkStatus()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [editing, setEditing] = useState<[string, number] | undefined>()
  const { year, updateYear } = useYearlyViewStore((state) => ({
    year: state.years.find((y) => y.year === selectedYear),
    updateYear: state.updateYear,
  }))
  const loading = !isStale && isLoading

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
          >
            -&gt;
          </button>
        </div>
      }
      modalStyles="w-screen"
    >
      <div className="flex pb-2 overflow-x-auto">
        {months.map((month, idx) => {
          const monthDate = dayjs().utc().year(selectedYear).month(idx).startOf('month')
          const lastMonths = ['November', 'December'].includes(month)
          return (
            <div key={month} className="flex flex-col flex-1">
              <span
                className={`sticky z-10 top-0 bg-[#D0EEDF] tracking-wide font-display text-tertiary text-center py-1 border-primary${
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
                        className={`flex group items-center gap-1 h-9 hover:bg-gray-100 transition-all w-full px-2 ${
                          isWeekend(monthDate.date(i + 1))
                            ? 'bg-secondary/20 hover:bg-secondary/50'
                            : ''
                        } ${editing?.[0] === month && editing?.[1] === i + 1 ? '!bg-primary' : ''}`}
                        disabled={loading}
                        onClick={() => setEditing([month, i + 1])}
                        // onMouseEnter={() => {
                        //   const content = getContent(month, i + 1, year?.entries)
                        //   if (!editing && !!content) {
                        //     // setTimeout(() => {
                        //     setShowPopover({
                        //       date: [month, i + 1],
                        //       content,
                        //     })
                        //     // }, 1000)
                        //   }
                        // }}
                        // onMouseLeave={() => setShowPopover(undefined)}
                      >
                        <span className="text-xs font-medium transition-all opacity-20 group-hover:opacity-70">
                          {i + 1}
                        </span>
                        <p className="w-[117px] text-left whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                          {getContent(month, i + 1, year?.entries)}
                        </p>
                      </button>
                      {editing?.[0] === month && editing?.[1] === i + 1 && (
                        <div className={`absolute ${lastMonths ? 'right-1' : 'left-1'} z-50`}>
                          <textarea
                            autoFocus
                            defaultValue={getContent(month, i + 1, year?.entries)}
                            onBlur={({ target }) => {
                              if (
                                target.value.trim().length ||
                                !!getContent(month, i + 1, year?.entries)
                              ) {
                                updateYear(
                                  {
                                    date: {
                                      year: selectedYear,
                                      month: editing[0],
                                      day: editing[1],
                                    },
                                    content: target.value,
                                    ...(user?.uid && { userId: user.uid }),
                                  },
                                  !!user && !isOffline
                                )
                              }
                              setEditing(undefined)
                            }}
                            className={`${
                              lastMonths ? 'rounded-tl-lg' : 'rounded-tr-lg'
                            } rounded-br-lg h-16 flex-wrap text-sm rounded-bl-xl focus:ring-primary/50 focus:ring-2 !ring-offset-1 ring-offset-white border-2 !border-primary outline-none`}
                          />
                        </div>
                      )}
                      {/* {showPopover &&
                        JSON.stringify(showPopover.date) === JSON.stringify([month, i + 1]) && (
                          <div className="absolute z-50">
                            <div className="p-2 bg-white rounded-lg shadow-md">
                              {showPopover.content}
                            </div>
                          </div>
                        )} */}
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
