import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import type { DocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

import dayjs from 'src/lib/dayjs'
import type { Data } from 'src/store/data'
import { convertFirebaseDataToLocal } from 'src/helpers/data'

const {
  VITE_CLIENT_FB_API_KEY,
  VITE_CLIENT_FB_AUTH_DOMAIN,
  VITE_CLIENT_FB_DB_URL,
  VITE_CLIENT_FB_PROJECT_ID,
  VITE_CLIENT_FB_STORAGE_BUCKET,
  VITE_CLIENT_FB_MESSAGING_SENDER_ID,
  VITE_CLIENT_FB_APP_ID,
} = import.meta.env

const firebaseConfig = {
  apiKey: `${VITE_CLIENT_FB_API_KEY}`,
  authDomain: `${VITE_CLIENT_FB_AUTH_DOMAIN}`,
  databaseURL: `${VITE_CLIENT_FB_DB_URL}`,
  projectId: `${VITE_CLIENT_FB_PROJECT_ID}`,
  storageBucket: `${VITE_CLIENT_FB_STORAGE_BUCKET}`,
  messagingSenderId: `${VITE_CLIENT_FB_MESSAGING_SENDER_ID}`,
  appId: `${VITE_CLIENT_FB_APP_ID}`,
}

const firebase = initializeApp(firebaseConfig)

export const auth = getAuth(firebase)
export const db = getFirestore(firebase)

export const converter = {
  toFirestore: (plannerRow: Data) => {
    return {
      ...plannerRow,
      week: [dayjs(plannerRow.week[0]).toString(), dayjs(plannerRow.week[1]).toString()],
      updatedAt: dayjs(plannerRow.updatedAt).toString(),
    }
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions): Data => {
    const plannerRow = snapshot.data(options) as Data
    return convertFirebaseDataToLocal(plannerRow)
  },
}
