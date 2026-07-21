import { isPast, isNow } from '../utils/distance'

export default function FilmCard({ film, nearest, locationStatus }) {
  const showDistance = locationStatus === 'granted' && nearest

  const allTimes = nearest?.times ?? []
  const hasFutureShowings = allTimes.some((t) => !isPast(t) || isNow(t))

  return (
    <div className="flex gap-4 rounded-xl bg-gray-800 p-4 shadow-lg">
      {/* Poster placeholder */}
      <div
        className="flex-shrink-0 rounded-lg"
        style={{
          width: 80,
          height: 112,
          backgroundColor: film.posterColor,
          opacity: 0.9,
        }}
      />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Title + scores */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-bold leading-tight text-white">{film.title}</h2>
          <div className="flex flex-shrink-0 flex-col items-end gap-0.5 text-xs">
            <span className="text-yellow-400">★ {film.imdbScore}</span>
            <span className="text-red-400">🍅 {film.rtScore}%</span>
            {film.athinoramaScore != null && (
              <span className="text-blue-400">🇬🇷 {film.athinoramaScore}/5</span>
            )}
          </div>
        </div>

        {/* Genre */}
        <span className="w-fit rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
          {film.genre}
        </span>

        {/* Cinema + distance */}
        {nearest && (
          <div className="flex items-center gap-1.5 text-sm text-gray-300">
            {nearest.cinema.isSummer && <span title="Open-air cinema">☀️</span>}
            <span className="truncate">{nearest.cinema.name}</span>
            {showDistance && (
              <span className="flex-shrink-0 rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-400">
                {nearest.distanceKm.toFixed(1)} km
              </span>
            )}
          </div>
        )}

        {/* Showtime pills */}
        {!hasFutureShowings ? (
          <p className="text-xs text-gray-500 italic">No more showings tonight</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {allTimes.map((t) => {
              const past = isPast(t)
              const nowish = isNow(t)
              return (
                <span
                  key={t}
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                    nowish
                      ? 'bg-green-600 text-white'
                      : past
                      ? 'bg-gray-700 text-gray-500 line-through'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  {t}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
