import type { FC } from 'react'
import type { User } from 'firebase/auth'
import { useState, useEffect, useRef } from 'react'
import { useAuthUser } from '@react-query-firebase/auth'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

import dayjs from 'src/lib/dayjs'
import { syncData } from 'src/database'
import { auth } from 'src/lib/firebase'
import useDataStore from 'src/store/data'
import { isSameWeek } from 'src/helpers/date'
import Top3 from 'src/components/Header/Top3'
import Logo from 'src/components/Header/Logo'
import useCurrentWeekStore from 'src/store/week'
import WeekDay from 'src/components/Main/WeekDay'
import Actions from 'src/components/Footer/Actions'
import type { Data, TopTask } from 'src/store/data'
import WeekMood from 'src/components/Footer/WeekMood'
import useNetworkStatus from 'src/hooks/useNetworkStatus'
import Notification from 'src/components/shared/Notification'
import HealthTracker from 'src/components/Header/HealthTracker'
import CurrentWeekDate from 'src/components/Footer/CurrentWeekDate'
import PrepareNextWeekModal from 'src/components/Main/PrepareNextWeekModal'
import { buildTopThreeObject, buildTrackerObject, buildWeekDaysObject } from 'src/helpers/data'

const week = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const App: FC = () => {
  const [syncing, setSyncing] = useState<boolean>(false)
  const [prepareNextWeek, setPrepareNextWeek] = useState(false)
  const [finishedSyncing, setFinishedSyncing] = useState<boolean>(false)
  const { data: user, isLoading } = useAuthUser(['user'], auth)
  const synced = useRef(false)
  const isOffline = useNetworkStatus()
  const currentWeek = useCurrentWeekStore(({ current }) => current)
  const { data, setData, updateWeek } = useDataStore((state) => state)
  const currentWeekData = useDataStore((state) =>
    state.data.find(({ week }) => isSameWeek(week, currentWeek))
  )

  const handleSyncData = async (d: Data[], user: User): Promise<ReturnType<typeof setTimeout>> => {
    setSyncing(true)
    const response = await syncData(d, user.uid)
    if ((response as Data[]).length) {
      setData(response as Data[])
    }
    setSyncing(false)
    synced.current = true
    setFinishedSyncing(true)
    const timer = setTimeout(() => {
      setFinishedSyncing(false)
    }, 1500)

    return timer
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (!isOffline && !synced.current && !!user) {
      ;(async () => {
        timer = await handleSyncData(data, user)
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
  }

  const notify = isOffline ? 'offline' : syncing ? 'syncing' : finishedSyncing ? 'synced' : null

  return (
    <>
      <Notification type={notify} />
      <div
        className={`min-h-screen max-w-screen-2xl mx-auto px-3 pb-10${isOffline ? ' pt-10' : ''}`}
      >
        <header className="header">
          <Logo />
          <div className="flex flex-1 xs:hidden">
            <Actions
              authenticated={!!user}
              signIn={() => signInWithPopup(auth, new GoogleAuthProvider())}
              signOut={() => signOut(auth)}
              loading={isLoading}
            />
          </div>
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
              submit={handlePrepareNextWeek}
              close={() => setPrepareNextWeek(false)}
            />
          )}
        </main>
        <footer className="footer">
          <WeekMood weekData={currentWeekData} updateWeekData={handleUpdateData} />
          <CurrentWeekDate currentWeek={currentWeek} />
          <div className="hidden xs:flex flex-1">
            <Actions
              authenticated={!!user}
              signIn={() => signInWithPopup(auth, new GoogleAuthProvider())}
              signOut={() => signOut(auth)}
              loading={isLoading}
            />
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
