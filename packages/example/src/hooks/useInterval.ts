import { useEffect, useRef } from 'react'

export default function useInterval(callback: () => void, delay = 1000): void {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    const timer = setInterval(() => {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }, delay)
    return () => {
      clearInterval(timer)
    }
  }, [])
}
