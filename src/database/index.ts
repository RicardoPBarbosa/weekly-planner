import type { DocumentData, QuerySnapshot } from 'firebase/firestore'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'

import type { Data } from 'src/store/data'
import { converter, db } from 'src/lib/firebase'
import { isBeforeOrSameDate, isSameWeek } from 'src/helpers/date'
import { assignUserToData, convertFirebaseDataToLocal } from 'src/helpers/data'

const COLLECTION_NAME = 'planners'

const fetchData = async (
  userId: string,
  upsert: boolean = false
): Promise<Data[] | null | QuerySnapshot<DocumentData>> => {
  const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId))
  const querySnapshot = await getDocs(q)
  if (upsert) {
    return querySnapshot
  }
  if (!querySnapshot.empty) {
    return querySnapshot.docs.map((doc) => convertFirebaseDataToLocal(doc.data()))
  }

  return null
}

const upsertData = async (data: Data[], userId: string) => {
  const querySnapshot = (await fetchData(userId, true)) as QuerySnapshot<DocumentData>
  data.forEach((dataRow) => {
    const existingData = querySnapshot.docs.find((doc) => isSameWeek(doc.data().week, dataRow.week))
    if (existingData) {
      setDoc(existingData.ref.withConverter(converter), dataRow, { merge: true })
    } else {
      const ref = doc(collection(db, COLLECTION_NAME)).withConverter(converter)
      setDoc(ref, dataRow)
    }
  })
}

const syncData = async (data: Data[], userId: string): Promise<Data[] | Error> => {
  const dbData = (await fetchData(userId)) as Data[] | null
  const newDataObject = assignUserToData(data, userId)
  if (!dbData || !dbData.length) {
    if (newDataObject.length) {
      await upsertData(newDataObject, userId)
    }
    return newDataObject
  }
  if (newDataObject.length) {
    const newOrUpdatedEntries: Data[] = []
    const existingDbRows: number[] = []
    newDataObject.forEach((dataRow, index) => {
      const rowIndex = dbData?.findIndex((row) => isSameWeek(row.week, dataRow.week))
      existingDbRows.push(rowIndex)
      const dbRow = dbData[rowIndex]
      if (dbRow && isBeforeOrSameDate(dataRow.updatedAt, dbRow.updatedAt)) {
        // Update local data
        newDataObject[index] = dbRow
      } else {
        // Will update remote data
        newOrUpdatedEntries.push(dataRow)
      }
    })
    if (newOrUpdatedEntries.length) {
      await upsertData(newOrUpdatedEntries, userId)
    }

    if (existingDbRows.length !== dbData.length) {
      const newLocalEntries = dbData.filter((_, index) => !existingDbRows.includes(index))
      newDataObject.push(...newLocalEntries)
    }

    return newDataObject
  }

  return dbData
}

export { upsertData, syncData }
