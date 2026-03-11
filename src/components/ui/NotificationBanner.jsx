import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { requestNotificationPermission } from '../../hooks/useNotifications'

export default function NotificationBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') {
      setShow(true)
    }
  }, [])

  async function handleEnable() {
    const result = await requestNotificationPermission()
    if (result === 'granted') {
      setShow(false)
    }
  }

  if (!show) return null

  return (
    <div className="bg-brand-green/10 border border-brand-green/30 rounded-2xl p-4 mb-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-brand-green/20 flex items-center justify-center flex-shrink-0">
        <Bell className="w-4 h-4 text-brand-green" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">Activer les notifications</p>
        <p className="text-gray-400 text-xs mt-0.5">Recevez une alerte sonore quand c'est l'heure de prendre vos médicaments</p>
        <button
          onClick={handleEnable}
          className="mt-2 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition"
        >
          Activer
        </button>
      </div>
      <button onClick={() => setShow(false)} className="text-gray-500 hover:text-gray-300 p-0.5">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
