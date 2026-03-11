import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Check, X, SkipForward } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isToday,
  isBefore,
  addMonths,
  subMonths,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export default function CalendarView() {
  const { user } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [reminders, setReminders] = useState([])
  const [monthLogs, setMonthLogs] = useState([])
  const [selectedDay, setSelectedDay] = useState(new Date())

  // Fetch active reminders with date range info
  const fetchReminders = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('reminders')
      .select('*, medications(id, name, dosage, color, form)')
      .eq('user_id', user.id)
      .eq('is_active', true)
    setReminders(data || [])
  }, [user])

  // Fetch logs for the displayed month
  const fetchMonthLogs = useCallback(async () => {
    if (!user) return
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const { data } = await supabase
      .from('medication_logs')
      .select('*, medications(id, name, dosage, color, form)')
      .eq('user_id', user.id)
      .gte('scheduled_at', start.toISOString())
      .lte('scheduled_at', end.toISOString())
    setMonthLogs(data || [])
  }, [user, currentMonth])

  useEffect(() => { fetchReminders() }, [fetchReminders])
  useEffect(() => { fetchMonthLogs() }, [fetchMonthLogs])

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const firstDayOffset = (getDay(startOfMonth(currentMonth)) + 6) % 7

  // Get reminders active on a specific day (respects start_date/end_date)
  function getRemindersForDay(day) {
    const dow = getDay(day) === 0 ? 7 : getDay(day)
    const dayStr = format(day, 'yyyy-MM-dd')

    return reminders.filter(r => {
      if (!r.days_of_week?.includes(dow)) return false
      if (r.start_date && dayStr < r.start_date) return false
      if (r.end_date && dayStr > r.end_date) return false
      return true
    })
  }

  function getLogsForDay(day) {
    return monthLogs.filter(log => isSameDay(new Date(log.scheduled_at), day))
  }

  function getDayStatus(day) {
    const isPastOrToday = isBefore(startOfDay(day), startOfDay(new Date())) || isToday(day)
    if (!isPastOrToday) return null
    const logs = getLogsForDay(day)
    if (logs.length === 0) return null
    const allTaken = logs.every(l => l.status === 'taken')
    const someMissed = logs.some(l => l.status === 'missed')
    if (allTaken) return 'complete'
    if (someMissed) return 'missed'
    if (isBefore(startOfDay(day), startOfDay(new Date())) && logs.some(l => l.status === 'pending')) return 'missed'
    return 'pending'
  }

  // Update a medication log status (taken/missed/skipped)
  async function handleUpdateLog(logId, status) {
    const takenAt = status === 'taken' ? new Date().toISOString() : null
    await supabase
      .from('medication_logs')
      .update({ status, taken_at: takenAt })
      .eq('id', logId)

    setMonthLogs(prev => prev.map(l =>
      l.id === logId ? { ...l, status, taken_at: takenAt } : l
    ))
  }

  // Create a log on the fly and mark it (for days without pre-generated logs)
  async function handleCreateAndMarkLog(reminder, day, status) {
    const [hours, minutes] = (reminder.scheduled_time || '08:00').split(':')
    const scheduledAt = new Date(day)
    scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    const { data: newLog } = await supabase
      .from('medication_logs')
      .insert({
        user_id: user.id,
        medication_id: reminder.medication_id,
        reminder_id: reminder.id,
        scheduled_at: scheduledAt.toISOString(),
        status,
        taken_at: status === 'taken' ? new Date().toISOString() : null,
      })
      .select('*, medications(id, name, dosage, color, form)')
      .single()

    if (newLog) {
      setMonthLogs(prev => [...prev, newLog])
    }
  }

  const selectedReminders = getRemindersForDay(selectedDay)
  const selectedLogs = getLogsForDay(selectedDay)
  const isPastOrToday = isBefore(startOfDay(selectedDay), startOfDay(new Date())) || isToday(selectedDay)

  return (
    <div data-tour-id="calendar" className="bg-bg-card rounded-2xl p-4 mb-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-bg-hover transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-white font-semibold text-sm capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h3>
        <button
          onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-bg-hover transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center text-gray-500 text-[10px] font-semibold py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`e-${i}`} className="aspect-square" />
        ))}

        {days.map(day => {
          const dayReminders = getRemindersForDay(day)
          const status = getDayStatus(day)
          const isSelected = isSameDay(day, selectedDay)
          const today = isToday(day)
          const hasMeds = dayReminders.length > 0

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDay(day)}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-lg transition-all ${
                isSelected
                  ? 'bg-brand-green/20 ring-2 ring-brand-green'
                  : today
                  ? 'bg-brand-green/10 ring-1 ring-brand-green/40'
                  : hasMeds
                  ? 'hover:bg-bg-hover'
                  : 'opacity-30'
              }`}
            >
              <span
                className={`text-xs leading-none ${
                  today ? 'text-brand-green font-bold'
                    : isSelected ? 'text-white font-semibold'
                    : 'text-gray-300'
                }`}
              >
                {format(day, 'd')}
              </span>

              {hasMeds && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayReminders.slice(0, 3).map((r, idx) => (
                    <div
                      key={idx}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: r.medications?.color || '#10B981' }}
                    />
                  ))}
                  {dayReminders.length > 3 && (
                    <div className="w-1 h-1 rounded-full bg-gray-500" />
                  )}
                </div>
              )}

              {status === 'complete' && (
                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-brand-green rounded-full flex items-center justify-center shadow-sm">
                  <Check className="w-2 h-2 text-white" />
                </div>
              )}
              {status === 'missed' && (
                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                  <X className="w-2 h-2 text-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 px-1">
        {reminders
          .filter((r, i, arr) => arr.findIndex(x => x.medications?.name === r.medications?.name) === i)
          .slice(0, 5)
          .map(r => (
            <div key={r.id} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: r.medications?.color || '#10B981' }} />
              <span className="text-gray-500 text-[10px]">{r.medications?.name}</span>
            </div>
          ))}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
          <span className="text-gray-500 text-[10px]">Tout pris</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-gray-500 text-[10px]">Manqué</span>
        </div>
      </div>

      {/* Selected day details with action buttons */}
      {selectedReminders.length > 0 && (
        <div className="mt-3 pt-3 border-t border-bg-hover">
          <p className="text-gray-400 text-xs mb-2 capitalize font-medium">
            {isToday(selectedDay) ? "Aujourd'hui" : format(selectedDay, 'EEEE d MMMM', { locale: fr })}
          </p>
          <div className="space-y-2">
            {selectedReminders.map((r, i) => {
              const log = selectedLogs.find(l => l.reminder_id === r.id)

              return (
                <div key={i} className="flex items-center gap-2 bg-bg-primary rounded-xl p-2.5">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: r.medications?.color || '#10B981' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{r.medications?.name}</p>
                    <p className="text-gray-500 text-[10px]">
                      {r.medications?.dosage} · {r.scheduled_time?.slice(0, 5)}
                    </p>
                  </div>

                  {/* Status / Action buttons */}
                  {log ? (
                    log.status === 'pending' && isPastOrToday ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleUpdateLog(log.id, 'taken')}
                          className="bg-brand-green/20 text-brand-green p-1.5 rounded-lg hover:bg-brand-green/30 transition"
                          title="Pris"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateLog(log.id, 'skipped')}
                          className="bg-amber-500/20 text-amber-400 p-1.5 rounded-lg hover:bg-amber-500/30 transition"
                          title="Ignorer"
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateLog(log.id, 'missed')}
                          className="bg-red-500/20 text-red-400 p-1.5 rounded-lg hover:bg-red-500/30 transition"
                          title="Raté"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${
                        log.status === 'taken' ? 'text-brand-green bg-brand-green/10' :
                        log.status === 'missed' ? 'text-red-400 bg-red-400/10' :
                        log.status === 'skipped' ? 'text-amber-400 bg-amber-400/10' :
                        'text-gray-500 bg-gray-500/10'
                      }`}>
                        {log.status === 'taken' ? 'Pris' :
                         log.status === 'missed' ? 'Raté' :
                         log.status === 'skipped' ? 'Ignoré' : 'En attente'}
                      </span>
                    )
                  ) : isPastOrToday ? (
                    // No log exists yet - create on the fly
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCreateAndMarkLog(r, selectedDay, 'taken')}
                        className="bg-brand-green/20 text-brand-green p-1.5 rounded-lg hover:bg-brand-green/30 transition"
                        title="Pris"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCreateAndMarkLog(r, selectedDay, 'missed')}
                        className="bg-red-500/20 text-red-400 p-1.5 rounded-lg hover:bg-red-500/30 transition"
                        title="Raté"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-[10px] font-medium">Prévu</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
