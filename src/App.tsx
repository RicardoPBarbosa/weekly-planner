import { useState, useEffect, useRef } from 'react'
import { useAuthUser } from '@react-query-firebase/auth'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

import dayjs from 'src/lib/dayjs'
import { auth } from 'src/lib/firebase'
import useDataStore from 'src/store/data'
import { isSameWeek } from 'src/helpers/date'
import Top3 from 'src/components/Header/Top3'
import Logo from 'src/components/Header/Logo'
import useCurrentWeekStore from 'src/store/week'
import WeekDay from 'src/components/Main/WeekDay'
import { syncData, syncYears } from 'src/database'
import Actions from 'src/components/Footer/Actions'
import type { Data, TopTask } from 'src/store/data'
import WeekMood from 'src/components/Footer/WeekMood'
import useNetworkStatus from 'src/hooks/useNetworkStatus'
import useYearlyViewStore, { Year } from './store/year-view'
import Notification from 'src/components/shared/Notification'
import HealthTracker from 'src/components/Header/HealthTracker'
import NavigationArrows from 'src/components/Main/NavigationArrows'
import CurrentWeekDate from 'src/components/Footer/CurrentWeekDate'
import PrepareNextWeekModal from 'src/components/Main/PrepareNextWeekModal'
import { buildTopThreeObject, buildTrackerObject, buildWeekDaysObject } from 'src/helpers/data'

const week = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const App = () => {
  const [syncing, setSyncing] = useState<boolean>(false)
  const [prepareNextWeek, setPrepareNextWeek] = useState(false)
  const [finishedSyncing, setFinishedSyncing] = useState<boolean>(false)
  const { data: user, isLoading, isStale } = useAuthUser(['user'], auth)
  const synced = useRef(false)
  const isOffline = useNetworkStatus()
  const currentWeek = useCurrentWeekStore(({ current }) => current)
  const { data, setData, updateWeek } = useDataStore((state) => state)
  const { years, setYears } = useYearlyViewStore((state) => state)
  const currentWeekData = useDataStore((state) =>
    state.data.find(({ week }) => isSameWeek(week, currentWeek))
  )

  const handleSyncData = async (): Promise<ReturnType<typeof setTimeout> | undefined> => {
    if (user) {
      setSyncing(true)
      const dataResponse = await syncData(data, user.uid)
      const yearsResponse = await syncYears(years, user.uid)
      if ((dataResponse as Data[]).length) {
        setData(dataResponse as Data[])
      }
      if ((yearsResponse as Year[]).length) {
        setYears(yearsResponse as Year[])
      }
      setSyncing(false)
      synced.current = true
      setFinishedSyncing(true)
      const timer = setTimeout(() => {
        setFinishedSyncing(false)
      }, 1500)

      return timer
    }
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    if (!isOffline && !synced.current && !!user) {
      ;(async () => {
        timer = await handleSyncData()
      })()
    }

    if (isOffline) {
      synced.current = false
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [isOffline, user])

  const getDayCurrentValue = (dayIndex: number) => {
    if (currentWeekData) {
      const weekDay = Object.entries(currentWeekData.weekTasks).find(
        ([key]) => Number(key) === dayIndex
      )
      if (weekDay) {
        return weekDay[1]
      }
    }
    return ''
  }

  const handleUpdateData = (updatedData: Partial<Data>) => {
    updateWeek(
      {
        week: currentWeek,
        ...(user?.uid && { userId: user.uid }),
        ...updatedData,
        updatedAt: dayjs(),
      },
      !!user && !isOffline
    )
  }

  const handlePrepareNextWeek = (goals: TopTask[]) => {
    updateWeek(
      {
        week: [currentWeek[0].add(1, 'week'), currentWeek[1].add(1, 'week')],
        topThree: goals,
        ...(user?.uid && { userId: user.uid }),
        updatedAt: dayjs(),
      },
      !!user && !isOffline
    )
    setPrepareNextWeek(false)
  }

  const notify = isOffline ? 'offline' : syncing ? 'syncing' : finishedSyncing ? 'synced' : null

  const actionsElement = (
    <Actions
      authenticated={!!user}
      signIn={() => signInWithPopup(auth, new GoogleAuthProvider())}
      signOut={() => signOut(auth)}
      loading={!isStale && isLoading}
    />
  )

  return (
    <>
      <Notification type={notify} />
      <div
        className={`min-h-screen max-w-screen-2xl mx-auto px-3 pb-10${isOffline ? ' pt-10' : ''}`}
      >
        <header className="header">
          <Logo />
          <div className="flex xs:hidden">{actionsElement}</div>
          <Top3
            topThree={currentWeekData?.topThree || []}
            updateWeekData={(task) => handleUpdateData(buildTopThreeObject(currentWeekData, task))}
          />
          <HealthTracker
            tracker={currentWeekData?.tracker}
            updateWeekData={(trackerName, trackerItem) =>
              handleUpdateData(buildTrackerObject(currentWeekData, trackerName, trackerItem))
            }
          />
        </header>
        <main className="main-container">
          <NavigationArrows />
          {week.map((day, index) => (
            <WeekDay
              key={day}
              day={day}
              value={getDayCurrentValue(index)}
              updateWeekData={(value: string) =>
                handleUpdateData(buildWeekDaysObject(currentWeekData, index, value))
              }
              prepareNextWeek={() => setPrepareNextWeek(true)}
            />
          ))}
          <WeekDay
            key="notes"
            day="Notes"
            value={getDayCurrentValue(week.length)}
            updateWeekData={(value: string) =>
              handleUpdateData({
                weekTasks: { ...currentWeekData?.weekTasks, [week.length]: value },
              })
            }
          />
          {prepareNextWeek && (
            <PrepareNextWeekModal
              currentWeek={currentWeek}
              submit={handlePrepareNextWeek}
              close={() => setPrepareNextWeek(false)}
            />
          )}
        </main>
        <footer className="flex flex-wrap items-center justify-between mb-5 mt-9 sm:gap-5 gap-7">
          <WeekMood weekData={currentWeekData} updateWeekData={handleUpdateData} />
          <CurrentWeekDate currentWeek={currentWeek} />
          <div className="flex-initial hidden xl:flex-1 xs:flex">{actionsElement}</div>
        </footer>
      </div>
    </>
  )
}

export default App
