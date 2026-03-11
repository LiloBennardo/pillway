export function SkeletonCard({ lines = 2 }) {
  return (
    <div className="bg-bg-card rounded-2xl p-4 animate-pulse">
      <div className="h-4 bg-bg-hover rounded-lg w-3/4 mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-bg-hover rounded-lg mb-2" style={{ width: `${60 + i * 20}%` }} />
      ))}
    </div>
  )
}

export function SkeletonTimeline() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-bg-card rounded-2xl p-4 flex items-center gap-3 animate-pulse">
          <div className="w-10 h-12 bg-bg-hover rounded-xl" />
          <div className="flex-1">
            <div className="h-4 bg-bg-hover rounded w-1/2 mb-2" />
            <div className="h-3 bg-bg-hover rounded w-1/3" />
          </div>
          <div className="w-16 h-9 bg-bg-hover rounded-xl" />
        </div>
      ))}
    </div>
  )
}
