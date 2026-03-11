import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameDay, isSameMonth,
  isToday, isPast, addMonths, subMonths,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'

export default function MiniCalendar({ logs = [] }) {
  const [expanded, setExpanded] = useState(false)
  const [viewMonth, setViewMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  // Index logs by date (yyyy-MM-dd → [logs])
  const logsByDay = useMemo(() => {
    const map = {}
    logs.forEach(log => {
      const key = format(new Date(log.scheduled_at), 'yyyy-MM-dd')
      if (!map[key]) map[key] = []
      map[key].push(log)
    })
    return map
  }, [logs])

  // Next 7 days (compact view)
  const next7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() + i)
      d.setHours(0, 0, 0, 0)
      return d
    })
  }, [])

  // Full month days (expanded view)
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [viewMonth])

  function getDayStatus(date) {
    const key = format(date, 'yyyy-MM-dd')
    const dayLogs = logsByDay[key] || []
    if (dayLogs.length === 0) return 'empty'
    if (dayLogs.every(l => l.status === 'taken')) return 'all-taken'
    if (dayLogs.some(l => l.status === 'missed')) return 'missed'
    if (dayLogs.some(l => l.status === 'pending')) return 'pending'
    return 'partial'
  }

  function getDayDots(date) {
    const key = format(date, 'yyyy-MM-dd')
    const dayLogs = logsByDay[key] || []
    return [...new Set(dayLogs.map(l => l.medications?.color || '#10B981'))].slice(0, 3)
  }

  return (
    <div data-tour-id="calendar" className="mb-6">

      {/* ── COMPACT VIEW — 7 days strip ── */}
      <AnimatePresence initial={false}>
        {!expanded && (
          <motion.div
            key="compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setExpanded(true)}
              className="w-full"
              aria-label="Afficher le calendrier complet"
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                  {format(new Date(), 'MMMM yyyy', { locale: fr })}
                </span>
                <span className="flex items-center gap-1 text-gray-500 text-xs hover:text-gray-300 transition">
                  Calendrier <ChevronDown className="w-3 h-3" />
                </span>
              </div>

              {/* 7-day strip */}
              <div className="flex gap-1.5">
                {next7Days.map((date, i) => {
                  const status = getDayStatus(date)
                  const dots = getDayDots(date)
                  const today = isToday(date)

                  return (
                    <div
                      key={i}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                        today
                          ? 'bg-brand-green/12 border border-brand-green/30'
                          : 'bg-bg-card/60 border border-transparent'
                      }`}
                    >
                      <span className="text-gray-500 text-[10px] uppercase">
                        {format(date, 'EEEEE', { locale: fr })}
                      </span>
                      <span
                        className={`text-sm font-bold leading-none ${
                          today ? 'text-brand-green' : 'text-white'
                        }`}
                      >
                        {format(date, 'd')}
                      </span>
                      <div className="flex gap-0.5 h-2 items-center">
                        {dots.length > 0 ? (
                          dots.map((color, j) => (
                            <div
                              key={j}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: status === 'all-taken' ? '#10B981'
                                  : status === 'missed' ? '#EF4444'
                                  : color,
                                opacity: isPast(date) && !isToday(date) && status === 'pending' ? 0.4 : 1,
                              }}
                            />
                          ))
                        ) : (
                          <div className="w-1.5 h-1.5" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EXPANDED VIEW — Full month ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="bg-bg-card rounded-2xl p-4 border border-bg-hover">

              {/* Month header + navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setViewMonth(m => subMonths(m, 1))}
                  className="w-8 h-8 rounded-xl bg-bg-hover flex items-center justify-center text-gray-400 hover:text-white transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-white font-semibold text-sm capitalize">
                  {format(viewMonth, 'MMMM yyyy', { locale: fr })}
                </span>
                <button
                  onClick={() => setViewMonth(m => addMonths(m, 1))}
                  className="w-8 h-8 rounded-xl bg-bg-hover flex items-center justify-center text-gray-400 hover:text-white transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <div key={i} className="text-center text-gray-500 text-[10px] font-semibold uppercase py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-y-1">
                {monthDays.map((date, i) => {
                  const inMonth = isSameMonth(date, viewMonth)
                  const today = isToday(date)
                  const selected = selectedDay && isSameDay(date, selectedDay)
                  const status = getDayStatus(date)
                  const dots = getDayDots(date)

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(selected ? null : date)}
                      className={`flex flex-col items-center py-1 rounded-xl transition-all ${
                        selected
                          ? 'bg-brand-green/15 border border-brand-green/40'
                          : today
                          ? 'bg-brand-green/8 border border-brand-green/20'
                          : 'border border-transparent'
                      } ${!inMonth ? 'opacity-25' : ''}`}
                    >
                      <span
                        className={`text-xs font-semibold leading-tight ${
                          today ? 'text-brand-green' : 'text-gray-200'
                        }`}
                      >
                        {format(date, 'd')}
                      </span>

                      <div className="flex gap-0.5 mt-0.5 h-2 items-center">
                        {status === 'all-taken' ? (
                          <div className="w-2 h-2 rounded-full bg-brand-green" />
                        ) : status === 'missed' ? (
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                        ) : dots.length > 0 ? (
                          dots.slice(0, 2).map((color, j) => (
                            <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                          ))
                        ) : null}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Selected day detail */}
              <AnimatePresence>
                {selectedDay && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pt-4 border-t border-bg-hover"
                  >
                    <p className="text-gray-400 text-xs font-medium mb-3 capitalize">
                      {format(selectedDay, 'EEEE d MMMM', { locale: fr })}
                    </p>
                    <DayDetail date={selectedDay} logsByDay={logsByDay} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-bg-hover">
                <LegendItem color="#10B981" label="Tout pris" />
                <LegendItem color="#EF4444" label="Manqué" />
                <LegendItem color="#F59E0B" label="Médicament" />
              </div>
            </div>

            {/* Collapse button */}
            <button
              onClick={() => { setExpanded(false); setSelectedDay(null) }}
              className="w-full flex items-center justify-center gap-1.5 mt-2 py-2 text-gray-500 hover:text-gray-300 text-xs transition"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              Réduire le calendrier
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Day detail (inside expanded calendar)
function DayDetail({ date, logsByDay }) {
  const key = format(date, 'yyyy-MM-dd')
  const dayLogs = logsByDay[key] || []

  if (dayLogs.length === 0) {
    return <p className="text-gray-500 text-xs text-center py-2">Aucune prise ce jour</p>
  }

  return (
    <div className="space-y-2">
      {dayLogs.map(log => (
        <div key={log.id} className="flex items-center gap-3">
          <span className="text-gray-400 text-xs w-10 text-right flex-shrink-0">
            {format(new Date(log.scheduled_at), 'HH:mm')}
          </span>
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: log.medications?.color || '#F59E0B' }}
          />
          <span className="text-white text-xs font-medium flex-1 truncate">
            {log.medications?.name}
          </span>
          {log.medications?.dosage && (
            <span className="text-gray-500 text-xs">{log.medications.dosage}</span>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
            log.status === 'taken' ? 'text-green-400 bg-green-500/15' :
            log.status === 'missed' ? 'text-red-400 bg-red-500/15' :
            log.status === 'skipped' ? 'text-gray-400 bg-gray-500/15' :
            'text-amber-400 bg-amber-500/15'
          }`}>
            {log.status === 'taken' ? '✓' :
             log.status === 'missed' ? '✕' :
             log.status === 'skipped' ? '⏭' : '⏳'}
          </span>
        </div>
      ))}
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-gray-500 text-[10px]">{label}</span>
    </div>
  )
}
