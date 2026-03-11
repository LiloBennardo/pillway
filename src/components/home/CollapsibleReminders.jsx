import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { format, differenceInMinutes } from 'date-fns'
import SwipeableReminderRow from './SwipeableReminderRow'

export default function CollapsibleReminders({ logs, onStatusChange, loading }) {
  const [expanded, setExpanded] = useState(false)

  // Separate: pending vs done
  const pending = logs.filter(l => l.status === 'pending')
  const done = logs.filter(l => l.status !== 'pending')

  // Show first 3 pending
  const preview = pending.slice(0, 3)
  // Everything else
  const hidden = [...pending.slice(3), ...done]

  const totalCount = logs.length
  const takenCount = done.filter(l => l.status === 'taken').length
  const hiddenCount = hidden.length

  if (loading) return <RemindersSkeleton />

  if (logs.length === 0) {
    return (
      <div className="bg-bg-card rounded-2xl p-5 text-center mb-4">
        <p className="text-3xl mb-2">🎉</p>
        <p className="text-white font-semibold text-sm">Tout est à jour !</p>
        <p className="text-gray-500 text-xs mt-1">Aucune prise prévue pour aujourd&apos;hui.</p>
      </div>
    )
  }

  return (
    <div data-tour-id="tour-timeline" className="mb-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-base">Aujourd&apos;hui</h2>
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-1.5 bg-bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-green rounded-full transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (takenCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <span className="text-brand-green text-xs font-semibold">
            {takenCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* First 3 pending (always visible) — swipeable */}
      <div className="space-y-2">
        {preview.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <SwipeableReminderRow log={log} onStatusChange={onStatusChange}>
              <ReminderRow log={log} onStatusChange={onStatusChange} />
            </SwipeableReminderRow>
          </motion.div>
        ))}
      </div>

      {/* Expandable section */}
      <AnimatePresence initial={false}>
        {expanded && hidden.length > 0 && (
          <motion.div
            key="hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="space-y-2 mt-2">
              {hidden.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <SwipeableReminderRow log={log} onStatusChange={onStatusChange}>
                    <ReminderRow log={log} onStatusChange={onStatusChange} dimmed={log.status !== 'pending'} />
                  </SwipeableReminderRow>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* See all / Collapse button */}
      {hiddenCount > 0 && (
        <motion.button
          onClick={() => setExpanded(e => !e)}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 mt-3 py-2.5 rounded-xl border border-bg-hover bg-bg-card/50 text-gray-400 hover:text-white hover:border-brand-green/40 transition-all text-sm font-medium"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Réduire
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Voir tout
              <span className="bg-bg-hover text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full">
                +{hiddenCount}
              </span>
            </>
          )}
        </motion.button>
      )}
    </div>
  )
}

// ── Reminder Row ──
function ReminderRow({ log, onStatusChange, dimmed = false }) {
  const scheduledAt = new Date(log.scheduled_at)
  const minsLeft = differenceInMinutes(scheduledAt, new Date())
  const isOverdue = log.status === 'pending' && minsLeft < 0
  const isSoon = log.status === 'pending' && minsLeft <= 15 && minsLeft >= 0
  const pillColor = log.medications?.color || '#F59E0B'

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
        isOverdue
          ? 'bg-red-500/10 border-red-500/25'
          : 'bg-bg-card border-bg-hover'
      } ${dimmed ? 'opacity-55' : ''}`}
    >
      {/* Time */}
      <div className="min-w-[38px] text-center flex-shrink-0">
        <p className="text-white font-bold text-xs leading-tight">
          {format(scheduledAt, 'HH:mm')}
        </p>
        {isOverdue && (
          <p className="text-red-400 text-[10px] leading-tight">
            +{Math.abs(minsLeft)}m
          </p>
        )}
        {isSoon && (
          <p className="text-amber-400 text-[10px] leading-tight">bientôt</p>
        )}
      </div>

      {/* Color separator */}
      <div
        className="w-0.5 h-8 rounded-full flex-shrink-0"
        style={{ background: pillColor }}
      />

      {/* Name + dosage */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">
          {log.medications?.name || '—'}
        </p>
        {log.medications?.dosage && (
          <p className="text-gray-500 text-xs">{log.medications.dosage}</p>
        )}
      </div>

      {/* Action or status badge */}
      {log.status === 'pending' ? (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onStatusChange(log.id, 'taken')}
            className="bg-brand-green text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-brand-green-dark active:scale-95 transition-all"
          >
            Pris
          </button>
          <button
            onClick={() => onStatusChange(log.id, 'skipped')}
            className="text-gray-500 hover:text-gray-300 p-1.5 rounded-xl hover:bg-bg-hover transition"
            title="Ignorer"
          >
            <span className="text-sm">⏭</span>
          </button>
        </div>
      ) : (
        <StatusChip status={log.status} />
      )}
    </div>
  )
}

function StatusChip({ status }) {
  const map = {
    taken: { label: '✓ Pris', cls: 'text-green-400 bg-green-500/15' },
    skipped: { label: '⏭ Ignoré', cls: 'text-gray-400 bg-gray-500/15' },
    missed: { label: '✕ Manqué', cls: 'text-red-400 bg-red-500/15' },
  }
  const c = map[status] || map.missed
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${c.cls}`}>
      {c.label}
    </span>
  )
}

function RemindersSkeleton() {
  return (
    <div className="space-y-2 mb-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-bg-card rounded-2xl h-14 animate-pulse border border-bg-hover" />
      ))}
    </div>
  )
}
