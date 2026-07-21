export default function LocationBanner({ status }) {
  if (status === 'granted') return null

  if (status === 'pending') {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300">
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
        Detecting your location…
      </div>
    )
  }

  // denied
  return (
    <div className="flex items-center gap-2 rounded-lg bg-amber-950/60 px-4 py-2 text-sm text-amber-300">
      <span>📍</span>
      <span>Location unavailable — showing all Athens cinemas</span>
    </div>
  )
}
