export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Returns { cinema, distanceKm, times } for the nearest cinema among the given showtimes,
// or null if showtimes is empty.
export function nearestCinema(showtimes, cinemas, userLat, userLng) {
  let best = null
  let minDist = Infinity
  for (const st of showtimes) {
    const cinema = cinemas.find((c) => c.id === st.cinemaId)
    if (!cinema) continue
    const dist = haversineKm(userLat, userLng, cinema.lat, cinema.lng)
    if (dist < minDist) {
      minDist = dist
      best = { cinema, distanceKm: dist, times: st.times }
    }
  }
  return best
}

// Parse "HH:MM" into minutes since midnight.
export function parseMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

// Current time in minutes since midnight.
export function nowMinutes() {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

export function isPast(timeStr) {
  return parseMinutes(timeStr) < nowMinutes()
}

export function isNow(timeStr) {
  const diff = parseMinutes(timeStr) - nowMinutes()
  return diff >= -30 && diff <= 30
}
