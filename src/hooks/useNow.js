import { useState, useEffect, useRef } from 'react'
import { CINEMA_CUTOFF_HOUR } from '../constants'

// Returns the date string for the current cinema day. Between midnight and CINEMA_CUTOFF_HOUR
// the cinema day is still "yesterday", so we subtract one day before stringifying.
function cinemaDayStart(d) {
  const copy = new Date(d)
  if (copy.getHours() < CINEMA_CUTOFF_HOUR) copy.setDate(copy.getDate() - 1)
  return copy.toDateString()
}

export function useNow(intervalMs = 30_000) {
  const mountDate = useRef(cinemaDayStart(new Date()))
  const [state, setState] = useState({ tick: 0, dayExpired: false })

  useEffect(() => {
    let cancelled = false
    const id = setInterval(() => {
      if (cancelled) return
      const dayExpired = cinemaDayStart(new Date()) !== mountDate.current
      setState((s) => ({ tick: s.tick + 1, dayExpired }))
    }, intervalMs)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [intervalMs])

  return state
}
