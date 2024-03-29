import { useState, useEffect } from 'react'

import TrackingItem from './TrackingItem'
import { Tracker } from 'src/store/data'
import Title from 'src/components/shared/Title'
import { DEFAULT_TRACKER, TrackingName } from 'src/store/constants'
import { ReactComponent as ArrowRightSvg } from 'src/assets/arrow-right.svg'

export enum TrackingType {
  CHECKBOX,
  NUMBER,
}

const LocalTitle = () => (
  <div className="relative w-min -z-10">
    <Title className="transform -rotate-2">Health tracker</Title>
    <ArrowRightSvg className="absolute w-6 h-6 -bottom-6 -right-6" />
  </div>
)

type Props = {
  tracker?: Tracker
  updateWeekData: (
    trackName: TrackingName,
    trackerItem: { [key: number]: number | boolean }
  ) => void
}

const HealthTracker = ({ tracker, updateWeekData }: Props) => {
  const [trackingInfo, setTrackingInfo] = useState<Tracker>(tracker || DEFAULT_TRACKER)

  useEffect(() => {
    setTrackingInfo((prev) => tracker || prev)
  }, [tracker])

  const handleTrackerChange = (
    trackName: TrackingName,
    changes: { [key: number]: number | boolean }
  ) => {
    updateWeekData(trackName, changes)
    const clone = Object.assign({}, trackingInfo)
    clone[trackName] = changes as any
    setTrackingInfo(clone)
  }

  return (
    <div className="health-tracker-container">
      <div className="pb-4 space-y-2 sm:pb-0">
        <LocalTitle />
        <TrackingItem
          name={TrackingName.EXERCISE}
          week={trackingInfo[TrackingName.EXERCISE]}
          onChange={(changes) => handleTrackerChange(TrackingName.EXERCISE, changes)}
          type={TrackingType.CHECKBOX}
        />
        <TrackingItem
          name={TrackingName.HEALTHY_EATING}
          week={trackingInfo[TrackingName.HEALTHY_EATING]}
          onChange={(changes) => handleTrackerChange(TrackingName.HEALTHY_EATING, changes)}
          type={TrackingType.CHECKBOX}
        />
        <TrackingItem
          name={TrackingName.LITERS_OF_WATER}
          week={trackingInfo[TrackingName.LITERS_OF_WATER]}
          onChange={(changes) => handleTrackerChange(TrackingName.LITERS_OF_WATER, changes)}
          type={TrackingType.NUMBER}
        />
      </div>
    </div>
  )
}

export default HealthTracker
