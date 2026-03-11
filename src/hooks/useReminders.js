import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { startOfDay, endOfDay, format } from 'date-fns'

export function useReminders() {
  const { user } = useAuth()
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchReminders()
  }, [user])

  async function fetchReminders() {
    const { data } = await supabase
      .from('reminders')
      .select('*, medications(id, name, dosage, color, form)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('scheduled_time', { ascending: true })

    setReminders(data || [])
    setLoading(false)
  }

  async function addReminder(reminder) {
    const { data, error } = await supabase
      .from('reminders')
      .insert({ ...reminder, user_id: user.id })
      .select('*, medications(id, name, dosage, color, form)')
      .single()
    if (!error) setReminders(prev => [...prev, data].sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time)))
    return { data, error }
  }

  async function updateReminder(id, updates) {
    const { data, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', id)
      .select('*, medications(id, name, dosage, color, form)')
      .single()
    if (!error) setReminders(prev => prev.map(r => r.id === id ? data : r))
    return { data, error }
  }

  async function deleteReminder(id) {
    await supabase.from('reminders').update({ is_active: false }).eq('id', id)
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  return { reminders, loading, addReminder, updateReminder, deleteReminder, refetch: fetchReminders }
}

export function useTodayLogs() {
  const { user } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Generate today's medication logs from active reminders, then fetch them
  const initTodayLogs = useCallback(async () => {
    if (!user) return
    setLoading(true)

    try {
      const today = new Date()
      const dow = today.getDay() === 0 ? 7 : today.getDay()
      const todayStr = format(today, 'yyyy-MM-dd')

      // 1. Get all active reminders that apply today
      const { data: reminders } = await supabase
        .from('reminders')
        .select('id, medication_id, scheduled_time, start_date, end_date, days_of_week')
        .eq('user_id', user.id)
        .eq('is_active', true)

      // Filter: must be scheduled today (day of week + date range)
      const todayReminders = (reminders || []).filter(r => {
        if (!r.days_of_week?.includes(dow)) return false
        if (r.start_date && todayStr < r.start_date) return false
        if (r.end_date && todayStr > r.end_date) return false
        return true
      })

      // 2. Check which logs already exist for today
      const { data: existingLogs } = await supabase
        .from('medication_logs')
        .select('reminder_id')
        .eq('user_id', user.id)
        .gte('scheduled_at', startOfDay(today).toISOString())
        .lte('scheduled_at', endOfDay(today).toISOString())

      const existingReminderIds = new Set(
        (existingLogs || []).map(l => l.reminder_id).filter(Boolean)
      )

      // 3. Create missing logs
      const newLogs = todayReminders
        .filter(r => !existingReminderIds.has(r.id))
        .map(r => {
          const [hours, minutes] = (r.scheduled_time || '08:00').split(':')
          const scheduledAt = new Date(today)
          scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0)
          return {
            user_id: user.id,
            medication_id: r.medication_id,
            reminder_id: r.id,
            scheduled_at: scheduledAt.toISOString(),
            status: 'pending',
          }
        })

      if (newLogs.length > 0) {
        await supabase.from('medication_logs').insert(newLogs)
      }

      // 4. Now fetch all of today's logs with full data
      const { data: todayLogs } = await supabase
        .from('medication_logs')
        .select(`
          *,
          medications (id, name, dosage, color, form),
          reminders (scheduled_time, alert_minutes)
        `)
        .eq('user_id', user.id)
        .gte('scheduled_at', startOfDay(today).toISOString())
        .lte('scheduled_at', endOfDay(today).toISOString())
        .order('scheduled_at', { ascending: true })

      setLogs(todayLogs || [])
    } catch (err) {
      console.error('Error generating daily logs:', err)
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    initTodayLogs()
  }, [initTodayLogs])

  async function updateLogStatus(logId, status) {
    const takenAt = status === 'taken' ? new Date().toISOString() : null
    await supabase
      .from('medication_logs')
      .update({ status, taken_at: takenAt })
      .eq('id', logId)

    setLogs(prev => prev.map(l =>
      l.id === logId ? { ...l, status, taken_at: takenAt } : l
    ))
  }

  async function snoozeLog(logId, minutes = 15) {
    const log = logs.find(l => l.id === logId)
    if (!log) return

    const newTime = new Date(new Date(log.scheduled_at).getTime() + minutes * 60 * 1000)

    await supabase
      .from('medication_logs')
      .update({ scheduled_at: newTime.toISOString(), status: 'pending' })
      .eq('id', logId)

    setLogs(prev => prev.map(l =>
      l.id === logId ? { ...l, scheduled_at: newTime.toISOString(), status: 'pending' } : l
    ))
  }

  const nextMed = logs.find(l => l.status === 'pending')
  const completionRate = logs.length > 0
    ? Math.round((logs.filter(l => l.status === 'taken').length / logs.length) * 100)
    : 0

  return { logs, loading, updateLogStatus, snoozeLog, nextMed, completionRate, refetch: initTodayLogs }
}
