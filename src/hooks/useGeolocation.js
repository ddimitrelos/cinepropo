import { useState, useEffect } from 'react'
import { SYNTAGMA } from '../constants'

export function useGeolocation() {
  const [state, setState] = useState({ lat: null, lng: null, status: 'pending' })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ ...SYNTAGMA, status: 'denied' })
      return
    }
    let cancelled = false
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          status: 'granted',
        })
      },
      () => {
        if (cancelled) return
        setState({ ...SYNTAGMA, status: 'denied' })
      },
      { timeout: 8000, maximumAge: 60000 }
    )
    return () => { cancelled = true }
  }, [])

  return state
}
