import { useState, useEffect } from 'react'

const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(!window.navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
    }
    const handleOffline = () => {
      setIsOffline(true)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOffline
}

export default useNetworkStatus
