import { useState, useEffect, useRef } from 'react'

export function useNow(intervalMs = 30_000) {
  const mountDate = useRef(new Date().toDateString())
  const [state, setState] = useState({ tick: 0, dayExpired: false })

  useEffect(() => {
    let cancelled = false
    const id = setInterval(() => {
      if (cancelled) return
      const dayExpired = new Date().toDateString() !== mountDate.current
      setState((s) => ({ tick: s.tick + 1, dayExpired }))
    }, intervalMs)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [intervalMs])

  return state
}
