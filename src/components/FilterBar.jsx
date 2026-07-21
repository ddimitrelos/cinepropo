const TIME_OPTIONS = [
  { value: 'all',     label: 'All' },
  { value: 'tonight', label: 'Tonight' },
  { value: 'now',     label: 'Now' },
]

export default function FilterBar({ timeFilter, onTimeFilter, summerOnly, onSummerToggle }) {
  return (
    <div className="flex items-center justify-between gap-3">
      {/* Time toggle */}
      <div className="flex rounded-lg bg-gray-800 p-1">
        {TIME_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onTimeFilter(opt.value)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              timeFilter === opt.value
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Summer toggle */}
      <button
        onClick={onSummerToggle}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          summerOnly
            ? 'bg-amber-400 text-gray-900'
            : 'bg-gray-800 text-gray-400 hover:text-white'
        }`}
      >
        ☀️ Summer
      </button>
    </div>
  )
}
