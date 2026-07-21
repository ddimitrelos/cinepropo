import { useMemo, useState } from 'react'
import { films, cinemas } from './data/films'
import { useGeolocation } from './hooks/useGeolocation'
import { nearestCinema, isPast, isNow } from './utils/distance'
import { SYNTAGMA } from './constants'
import LocationBanner from './components/LocationBanner'
import FilterBar from './components/FilterBar'
import FilmCard from './components/FilmCard'

export default function App() {
  const { lat, lng, status } = useGeolocation()
  const [timeFilter, setTimeFilter] = useState('all')
  const [summerOnly, setSummerOnly] = useState(false)

  const userLat = lat ?? SYNTAGMA.lat
  const userLng = lng ?? SYNTAGMA.lng

  const processedFilms = useMemo(() => {
    return films
      .map((film) => {
        // 1. Optionally restrict to summer-cinema showtimes
        const showtimes = summerOnly
          ? film.showtimes.filter((st) =>
              cinemas.find((c) => c.id === st.cinemaId)?.isSummer
            )
          : film.showtimes

        if (showtimes.length === 0) return null

        // 2. Apply time filter to decide film visibility
        if (timeFilter === 'tonight') {
          const hasUpcoming = showtimes.some((st) => st.times.some((t) => !isPast(t)))
          if (!hasUpcoming) return null
        }
        if (timeFilter === 'now') {
          const hasNow = showtimes.some((st) => st.times.some((t) => isNow(t)))
          if (!hasNow) return null
        }

        // 3. Find nearest cinema that still has upcoming shows (fall back to pure distance)
        const futureSt = showtimes.filter((st) => st.times.some((t) => !isPast(t) || isNow(t)))
        const nearest = nearestCinema(futureSt.length > 0 ? futureSt : showtimes, cinemas, userLat, userLng)

        return { film, nearest }
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (status !== 'granted') return 0
        return (a.nearest?.distanceKm ?? Infinity) - (b.nearest?.distanceKm ?? Infinity)
      })
  }, [summerOnly, timeFilter, userLat, userLng, status])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/95 backdrop-blur">
        <div className="mx-auto max-w-lg px-4 py-3">
          <h1 className="text-xl font-bold tracking-tight text-white">
            🎬 CinePropo
          </h1>
          <p className="text-xs text-gray-500">What's playing near you tonight</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-4">
        {/* Location banner */}
        <LocationBanner status={status} />

        {/* Filters */}
        <FilterBar
          timeFilter={timeFilter}
          onTimeFilter={setTimeFilter}
          summerOnly={summerOnly}
          onSummerToggle={() => setSummerOnly((v) => !v)}
        />

        {/* Film list */}
        {processedFilms.length === 0 ? (
          <div className="rounded-xl bg-gray-800 px-6 py-12 text-center text-gray-400">
            {summerOnly
              ? '☀️ No summer cinema showings'
              : 'No films match the current filters'}
          </div>
        ) : (
          <div className="space-y-3">
            {processedFilms.map(({ film, nearest }) => (
              <FilmCard
                key={film.id}
                film={film}
                nearest={nearest}
                locationStatus={status}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
