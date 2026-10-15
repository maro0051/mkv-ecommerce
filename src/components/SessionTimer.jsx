import { useState, useEffect, useRef } from 'react'
import { FiClock } from 'react-icons/fi'

const TOTAL_TIME = 15 * 60 // 15 minutes in seconds

export default function SessionTimer({ isLoggedIn, onExtend }) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [isWarning, setIsWarning] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!isLoggedIn) {
      setTimeLeft(TOTAL_TIME)
      setIsVisible(false)
      return
    }

    setIsVisible(true)
    setTimeLeft(TOTAL_TIME)
    
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          return 0
        }
        if (prev <= 60) {
          setIsWarning(true)
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isLoggedIn])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleExtend = () => {
    setTimeLeft(TOTAL_TIME)
    setIsWarning(false)
    if (onExtend) onExtend()
  }

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 left-4 z-50 transition-all ${
      isWarning ? 'animate-pulse' : ''
    }`}>
      <div className={`flex items-center space-x-3 px-4 py-2.5 rounded-full shadow-lg text-sm ${
        isWarning 
          ? 'bg-red-500 text-white' 
          : 'bg-white dark:bg-gray-800 text-navy dark:text-white border border-gray-200 dark:border-gray-700'
      }`}>
        <FiClock className={`w-4 h-4 ${isWarning ? 'text-white' : 'text-gold'}`} />
        <span className="font-medium">
          Session: {formatTime(timeLeft)}
        </span>
        <button
          onClick={handleExtend}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isWarning
              ? 'bg-white text-red-500 hover:bg-red-50'
              : 'bg-gold/10 text-gold hover:bg-gold/20'
          }`}
        >
          Extend
        </button>
      </div>
    </div>
  )
}

