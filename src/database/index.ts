import dayjs from 'dayjs'
import {
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
  query,
  setDoc,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore'

import type { Data } from 'src/store/data'
import { Year, YearEntry } from 'src/store/year-view'
import { converter, db, yearConverter } from 'src/lib/firebase'
import { isBeforeOrSameDate, isSameWeek } from 'src/helpers/date'
import {
  assignUserToData,
  convertFirebaseDataToLocal,
  convertFirebaseYearToLocal,
} from 'src/helpers/data'

const collections = {
  years: 'years',
  planners: 'planners',
} as const

const dumpDBData = async (userId: string) => {
  return await Promise.all(
    Object.keys(collections).map(async (collectionName) => {
      const q = query(collection(db, collectionName), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        return {
          collection: collectionName,
          data: querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }
      }
    })
  )
}

const fetchData = async (
  userId: string,
  upsert: boolean = false,
  collectionName: keyof typeof collections = collections.planners
): Promise<Data[] | Year[] | null | QuerySnapshot<DocumentData>> => {
  const q = query(collection(db, collectionName), where('userId', '==', userId))
  const querySnapshot = await getDocs(q)
  if (upsert) {
    return querySnapshot
  }
  if (!querySnapshot.empty) {
    if (collectionName === 'planners') {
      return querySnapshot.docs.map((doc) => convertFirebaseDataToLocal(doc.id, doc.data()))
    } else {
      return querySnapshot.docs.map((doc) => convertFirebaseYearToLocal(doc.id, doc.data()))
    }
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
      const ref = doc(collection(db, collections.planners)).withConverter(converter)
      setDoc(ref, dataRow)
    }
  })
}

const syncData = async (data: Data[], userId: string): Promise<Data[] | Error> => {
  const dbData = (await fetchData(userId)) as Data[] | null
  const newDataObject = assignUserToData<Data>(data, userId)
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

const removeDuplicateFromDb = async (entryId?: string) => {
  if (entryId) {
    await deleteDoc(doc(db, collections.planners, entryId))
  }
}

const removeDuplicatedData = async (userId: string): Promise<Data[]> => {
  const dbData = (await fetchData(userId)) as Data[] | null
  const promises: Promise<void>[] = []
  const deduplicated: Data[] = []
  if (dbData) {
    dbData.forEach((entry) => {
      if (
        deduplicated.some((val) =>
          dayjs(val.week[0], 'YYYY-MM-DDTHH:mm:ss').isSame(
            dayjs(entry.week[0], 'YYYY-MM-DDTHH:mm:ss'),
            'day'
          )
        )
      ) {
        promises.push(removeDuplicateFromDb(entry?.id))
      } else {
        deduplicated.push(entry)
      }
    })
    await Promise.all(promises)
    // eslint-disable-next-line no-console
    console.info('Deduplication done', {
      initialCount: dbData.length,
      removed: promises.length,
      remaining: deduplicated.length,
    })
  }

  return deduplicated
}

const syncYears = async (years: Year[], userId: string): Promise<Year[] | Error> => {
  const dbData = (await fetchData(userId, false, 'years')) as Year[] | null
  const newDataObject = assignUserToData<Year>(years, userId)
  if (!dbData || !dbData.length) {
    if (newDataObject.length) {
      newDataObject.forEach(async (row) => {
        await upsertYearData(row.year, row.entries, userId)
      })
    }
    return newDataObject
  }
  if (newDataObject.length) {
    const newOrUpdatedEntries: Year[] = []
    const existingDbRows: number[] = []
    newDataObject.forEach((dataRow, index) => {
      const rowIndex = dbData?.findIndex((row) => row.year, dataRow.year)
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
      newOrUpdatedEntries.forEach(async (row) => {
        await upsertYearData(row.year, row.entries, userId)
      })
    }

    if (existingDbRows.length !== dbData.length) {
      const newLocalEntries = dbData.filter((_, index) => !existingDbRows.includes(index))
      newDataObject.push(...newLocalEntries)
    }

    return newDataObject
  }

  return dbData
}

const upsertYearData = async (year: number, entries: YearEntry[], userId: string) => {
  const yearData: Year = {
    year,
    entries,
    userId,
    updatedAt: dayjs(),
  }
  const querySnapshot = (await fetchData(userId, true, 'years')) as QuerySnapshot<DocumentData>
  const existingData = querySnapshot.docs.find((doc) => doc.data().year === year)
  if (existingData) {
    setDoc(existingData.ref.withConverter(yearConverter), yearData, { merge: true })
  } else {
    const ref = doc(collection(db, collections.years)).withConverter(yearConverter)
    setDoc(ref, yearData)
  }
}

export { upsertData, syncData, removeDuplicatedData, upsertYearData, syncYears, dumpDBData }
