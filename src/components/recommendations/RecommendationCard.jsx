import { AlertTriangle, Info, ChevronRight } from 'lucide-react'

const SEVERITY_CONFIG = {
  danger: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    badge: 'bg-red-500',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    badge: 'bg-amber-500',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: Info,
    iconColor: 'text-blue-400',
    badge: 'bg-blue-500',
  },
}

export default function RecommendationCard({ recommendation, onRead }) {
  const config = SEVERITY_CONFIG[recommendation.severity] || SEVERITY_CONFIG.info
  const Icon = config.icon

  return (
    <button
      onClick={() => onRead?.(recommendation.id)}
      className={`w-full text-left p-4 rounded-2xl border transition-all ${config.bg} ${config.border} ${
        !recommendation.is_read ? 'ring-1 ring-brand-green/30' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-black/20 flex-shrink-0">
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-white font-semibold text-sm">{recommendation.title}</p>
            {!recommendation.is_read && (
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${config.badge}`} />
            )}
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">{recommendation.body}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
      </div>
    </button>
  )
}
