import { Tracker } from './data'

export enum TrackingName {
  EXERCISE = 'Exercise',
  HEALTHY_EATING = 'Healthy eating',
  LITERS_OF_WATER = 'Liters of water',
}

const DEFAULT_BOOLEAN_OBJECT = {
  0: false,
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
}

const DEFAULT_LITERS_OBJECT = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
}

export const DEFAULT_TRACKER: Tracker = {
  [TrackingName.EXERCISE]: DEFAULT_BOOLEAN_OBJECT,
  [TrackingName.HEALTHY_EATING]: DEFAULT_BOOLEAN_OBJECT,
  [TrackingName.LITERS_OF_WATER]: DEFAULT_LITERS_OBJECT,
}
