import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes
const WARNING_BEFORE = 60 * 1000 // Show warning 1 minute before logout

export default function useAutoLogout({ isLoggedIn, onLogout, isAdmin = false }) {
  const timeoutRef = useRef(null)
  const warningRef = useRef(null)
  const navigate = useNavigate()

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
  }, [])

  const resetTimer = useCallback(() => {
    clearTimers()

    if (!isLoggedIn) return

    // Set warning 1 minute before logout
    warningRef.current = setTimeout(() => {
      toast.error(
        `⚠️ You'll be logged out in 1 minute due to inactivity.`,
        { duration: 5000, icon: '⏰' }
      )
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE)

    // Set auto logout
    timeoutRef.current = setTimeout(() => {
      if (onLogout) {
        onLogout()
      }
      toast.error('Session expired due to inactivity. Please login again.', {
        duration: 5000,
        icon: '🔒'
      })
      
      if (isAdmin) {
        navigate('/admin/login')
      } else {
        navigate('/')
      }
    }, INACTIVITY_TIMEOUT)
  }, [isLoggedIn, onLogout, isAdmin, navigate, clearTimers])

  useEffect(() => {
    // Events that reset the timer
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown',
      'wheel'
    ]

    if (isLoggedIn) {
      // Start the timer
      resetTimer()

      // Add event listeners
      events.forEach(event => {
        document.addEventListener(event, resetTimer)
      })

      return () => {
        clearTimers()
        events.forEach(event => {
          document.removeEventListener(event, resetTimer)
        })
      }
    } else {
      clearTimers()
    }
  }, [isLoggedIn, resetTimer, clearTimers])

  return {
    resetTimer,
    clearTimers
  }
}

