import { format, differenceInMinutes } from 'date-fns'
import { Check, X, SkipForward } from 'lucide-react'
import { motion } from 'framer-motion'

function StatusBadge({ status }) {
  const config = {
    taken:   { label: 'Pris',   bg: 'bg-brand-green/20', text: 'text-brand-green' },
    skipped: { label: 'Ignoré', bg: 'bg-amber-500/20',   text: 'text-amber-400' },
    missed:  { label: 'Manqué', bg: 'bg-red-500/20',     text: 'text-red-400' },
  }
  const c = config[status] || config.missed
  return (
    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}

export default function TodayTimeline({ logs, loading, onStatusChange }) {
  if (loading) {
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

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">Aucun médicament prévu aujourd'hui</p>
        <p className="text-gray-600 text-xs mt-1">Ajoutez des rappels pour commencer</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {logs.map((log, i) => {
        const med = log.medications
        const scheduledAt = new Date(log.scheduled_at)
        const time = format(scheduledAt, 'HH:mm')
        const isPast = scheduledAt < new Date()
        const isOverdue = log.status === 'pending' && isPast
        const minsLate = isOverdue ? Math.abs(differenceInMinutes(new Date(), scheduledAt)) : 0

        return (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-2xl p-4 border transition-all ${
              isOverdue
                ? 'bg-red-500/5 border-red-500/30'
                : 'bg-bg-card border-bg-hover'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Time column */}
              <div className="text-center min-w-[44px]">
                <p className="text-white font-bold text-sm">{time}</p>
                {isOverdue && (
                  <p className="text-red-400 text-xs font-medium">+{minsLate}m</p>
                )}
              </div>

              {/* Pill dot */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: (med?.color || '#F59E0B') + '25' }}
              >
                <div className="w-4 h-6 rounded-full" style={{ background: med?.color || '#F59E0B' }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{med?.name || 'Médicament'}</p>
                {med?.dosage && (
                  <p className="text-gray-400 text-xs">{med.dosage}</p>
                )}
              </div>

              {/* Actions */}
              {log.status === 'pending' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onStatusChange(log.id, 'taken')}
                    aria-label={`Marquer ${med?.name} comme pris`}
                    className="bg-brand-green/20 text-brand-green p-2 rounded-xl hover:bg-brand-green/30 transition"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onStatusChange(log.id, 'skipped')}
                    aria-label={`Ignorer ${med?.name}`}
                    className="bg-amber-500/20 text-amber-400 p-2 rounded-xl hover:bg-amber-500/30 transition"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onStatusChange(log.id, 'missed')}
                    aria-label={`Marquer ${med?.name} comme manqué`}
                    className="bg-red-500/20 text-red-400 p-2 rounded-xl hover:bg-red-500/30 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <StatusBadge status={log.status} />
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
