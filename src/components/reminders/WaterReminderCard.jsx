import { useState, useEffect } from 'react'
import { Droplets, Plus, Minus, Bell, BellOff } from 'lucide-react'

const GLASS_ML = 250
const DAILY_GOAL = 2000 // 2L

export default function WaterReminderCard() {
  const [glasses, setGlasses] = useState(() => {
    const today = new Date().toDateString()
    const saved = localStorage.getItem('pillway_water')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.date === today) return parsed.glasses
    }
    return 0
  })
  const [reminderEnabled, setReminderEnabled] = useState(() => {
    return localStorage.getItem('pillway_water_reminder') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('pillway_water', JSON.stringify({
      date: new Date().toDateString(),
      glasses,
    }))
  }, [glasses])

  useEffect(() => {
    localStorage.setItem('pillway_water_reminder', String(reminderEnabled))

    if (!reminderEnabled) return

    // Set up hourly water reminder (9h-21h)
    const interval = setInterval(() => {
      const hour = new Date().getHours()
      if (hour >= 9 && hour <= 21 && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('💧 Hydratation', {
          body: 'Pensez à boire un verre d\'eau !',
          tag: 'water-reminder',
          icon: '/icons/icon-192.png',
        })
      }
    }, 60 * 60 * 1000) // every hour

    return () => clearInterval(interval)
  }, [reminderEnabled])

  const totalMl = glasses * GLASS_ML
  const progress = Math.min(totalMl / DAILY_GOAL, 1)
  const percentage = Math.round(progress * 100)

  return (
    <div className="bg-bg-card rounded-2xl border border-bg-hover p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold text-sm">Hydratation</h3>
        </div>
        <button
          onClick={() => setReminderEnabled(!reminderEnabled)}
          className={`p-1.5 rounded-lg transition ${reminderEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-bg-hover text-gray-500'}`}
          title={reminderEnabled ? 'Désactiver rappel eau' : 'Activer rappel eau (1x/h)'}
        >
          {reminderEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-bg-hover rounded-full mb-2 overflow-hidden">
        <div
          className="h-full bg-blue-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-400 text-[11px]">{totalMl} ml / {DAILY_GOAL} ml</p>
        <p className="text-blue-400 text-xs font-bold">{percentage}%</p>
      </div>

      {/* Glass buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setGlasses(Math.max(0, glasses - 1))}
          disabled={glasses === 0}
          className="bg-bg-hover text-gray-300 p-2 rounded-xl transition hover:bg-bg-primary disabled:opacity-30"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-6 rounded-sm transition-all ${
                i < glasses ? 'bg-blue-400' : 'bg-bg-hover'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setGlasses(glasses + 1)}
          className="bg-blue-500/20 text-blue-400 p-2 rounded-xl transition hover:bg-blue-500/30"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-gray-500 text-[10px] mt-2">
        {glasses} verre{glasses !== 1 ? 's' : ''} ({GLASS_ML}ml chacun)
      </p>
    </div>
  )
}
