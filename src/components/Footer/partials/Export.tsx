import { useState } from 'react'
import { useAuthUser } from '@react-query-firebase/auth'

import { auth } from 'src/lib/firebase'
import { dumpDBData } from 'src/database'

export const Export = () => {
  const { data: user } = useAuthUser(['user'], auth)
  const [loading, setLoading] = useState(false)

  const exportData = async () => {
    if (user) {
      setLoading(true)
      const data = await dumpDBData(user?.uid)
      setLoading(false)
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`
      const link = document.createElement('a')
      link.href = jsonString
      link.download = 'weekly-planner.json'

      link.click()
    }
  }

  if (!user) {
    return null
  }

  return (
    <button
      className="px-3 pt-1 pb-0.5 text-sm text-tertiary font-semibold transition-all rounded-tl-lg rounded-br-lg hover:bg-tertiary/30 rounded-tr-md rounded-bl-md font-body bg-tertiary/20 disabled:opacity-50"
      onClick={exportData}
      disabled={loading}
    >
      Export
    </button>
  )
}
