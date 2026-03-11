import { useRef, useState } from 'react'

export default function SwipeableReminderRow({ log, onStatusChange, children }) {
  const startX = useRef(0)
  const [offset, setOffset] = useState(0)
  const [swiped, setSwiped] = useState(false)

  const THRESHOLD = 80

  function onTouchStart(e) {
    startX.current = e.touches[0].clientX
  }

  function onTouchMove(e) {
    if (swiped) return
    const diff = e.touches[0].clientX - startX.current
    const clamped = Math.max(-120, Math.min(120, diff))
    setOffset(clamped)
  }

  function onTouchEnd() {
    if (swiped) return

    if (offset > THRESHOLD) {
      setSwiped(true)
      setOffset(400)
      if (navigator.vibrate) navigator.vibrate([15, 10, 15])
      setTimeout(() => onStatusChange(log.id, 'taken'), 250)
    } else if (offset < -THRESHOLD) {
      setSwiped(true)
      setOffset(-400)
      if (navigator.vibrate) navigator.vibrate(30)
      setTimeout(() => onStatusChange(log.id, 'missed'), 250)
    } else {
      setOffset(0)
    }
  }

  if (log.status !== 'pending') return children

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Swipe right background (green = taken) */}
      <div
        className="absolute inset-0 flex items-center pl-5 rounded-2xl"
        style={{ background: '#10B981', opacity: offset > 0 ? Math.min(offset / THRESHOLD, 1) : 0 }}
      >
        <span className="text-white font-bold text-sm">Pris</span>
      </div>

      {/* Swipe left background (red = missed) */}
      <div
        className="absolute inset-0 flex items-center justify-end pr-5 rounded-2xl"
        style={{ background: '#EF4444', opacity: offset < 0 ? Math.min(Math.abs(offset) / THRESHOLD, 1) : 0 }}
      >
        <span className="text-white font-bold text-sm">Manqué</span>
      </div>

      {/* Swipeable content */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(${offset}px)`,
          transition: offset === 0 || Math.abs(offset) >= 400 ? 'transform 0.3s ease' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}
