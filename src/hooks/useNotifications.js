import { useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

// Request notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  const result = await Notification.requestPermission()
  return result
}

// Play a notification sound using Web Audio API
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime

    // Pleasant ascending chime: C5, E5, G5
    const frequencies = [523.25, 659.25, 783.99]
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, now + i * 0.15)
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.15 + 0.05)
      gain.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.4)
      osc.start(now + i * 0.15)
      osc.stop(now + i * 0.15 + 0.5)
    })

    setTimeout(() => ctx.close(), 2000)
  } catch {
    // AudioContext not available
  }
}

// Send browser notification
function sendBrowserNotification(title, body, tag) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return

  try {
    const notification = new Notification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag,
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }
  } catch {
    // Notification failed (e.g. service worker required on some platforms)
  }
}

export function useNotifications(logs) {
  const { user } = useAuth()
  const notifiedRef = useRef(new Set())
  const intervalRef = useRef(null)

  const checkMedications = useCallback(() => {
    if (!logs || logs.length === 0) return

    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    for (const log of logs) {
      if (log.status !== 'pending') continue
      if (notifiedRef.current.has(log.id)) continue

      const scheduledAt = new Date(log.scheduled_at)
      const scheduledMinutes = scheduledAt.getHours() * 60 + scheduledAt.getMinutes()

      // Notify from 5 min before to 30 min after the scheduled time
      const diff = currentMinutes - scheduledMinutes
      if (diff >= -5 && diff <= 30) {
        notifiedRef.current.add(log.id)

        const medName = log.medications?.name || 'Médicament'
        const dosage = log.medications?.dosage || ''
        const time = `${String(scheduledAt.getHours()).padStart(2, '0')}:${String(scheduledAt.getMinutes()).padStart(2, '0')}`

        // Sound
        playNotificationSound()

        // Browser notification
        sendBrowserNotification(
          `PillWay — ${medName}`,
          `${dosage ? dosage + ' · ' : ''}C'est l'heure ! (${time})`,
          `pillway-${log.id}`
        )

        // In-app toast
        toast(
          `💊 ${medName} ${dosage ? '· ' + dosage : ''} — ${time}`,
          {
            duration: 15000,
            style: {
              background: '#1B2B3A',
              color: '#fff',
              border: '1px solid #10B981',
              padding: '12px 16px',
              fontSize: '14px',
            },
          }
        )
      }
    }
  }, [logs])

  useEffect(() => {
    checkMedications()
    intervalRef.current = setInterval(checkMedications, 30000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [checkMedications])

  // Request notification permission on mount
  useEffect(() => {
    if (user) requestNotificationPermission()
  }, [user])
}
