import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { subDays, format } from 'date-fns'

export default function StreakWidget() {
  const { user } = useAuth()
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  useEffect(() => {
    if (!user) return
    calculateStreak()
  }, [user])

  async function calculateStreak() {
    const since = subDays(new Date(), 60).toISOString()
    const { data } = await supabase
      .from('medication_logs')
      .select('scheduled_at, status')
      .eq('user_id', user.id)
      .gte('scheduled_at', since)
      .order('scheduled_at', { ascending: false })

    if (!data?.length) return

    // Group by day
    const byDay = {}
    data.forEach(log => {
      const day = format(new Date(log.scheduled_at), 'yyyy-MM-dd')
      if (!byDay[day]) byDay[day] = { total: 0, taken: 0 }
      byDay[day].total++
      if (log.status === 'taken') byDay[day].taken++
    })

    // Calculate current streak (consecutive days with 100%)
    let currentStreak = 0
    let best = 0
    let tempStreak = 0

    const sortedDays = Object.entries(byDay).sort(([a], [b]) => b.localeCompare(a))

    for (const [, stats] of sortedDays) {
      const isComplete = stats.total > 0 && stats.taken === stats.total
      if (isComplete) {
        tempStreak++
        if (currentStreak === 0 || currentStreak === tempStreak - 1) {
          currentStreak = tempStreak
        }
      } else {
        best = Math.max(best, tempStreak)
        if (currentStreak > 0) break
        tempStreak = 0
      }
    }

    best = Math.max(best, tempStreak)
    setStreak(currentStreak)
    setBestStreak(best)
  }

  if (streak === 0) return null

  return (
    <div className="bg-bg-card rounded-2xl p-4 mb-4 flex items-center gap-4 border border-bg-hover">
      <div className="text-3xl">🔥</div>
      <div className="flex-1">
        <p className="text-white font-bold text-base">
          {streak} jour{streak > 1 ? 's' : ''} de suite !
        </p>
        <p className="text-gray-400 text-xs">
          Record : {bestStreak} jour{bestStreak > 1 ? 's' : ''}
        </p>
      </div>
      <div
        className="text-2xl font-black"
        style={{ color: streak >= 7 ? '#F59E0B' : '#10B981' }}
      >
        {streak}
      </div>
    </div>
  )
}
