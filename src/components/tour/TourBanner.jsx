import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { useTour } from '../../contexts/TourContext'
import { useAuth } from '../../contexts/AuthContext'

export default function TourBanner() {
  const { profile } = useAuth()
  const { startTour, isTourActive } = useTour()
  const [dismissed, setDismissed] = useState(false)

  // Only show once: if tour not completed and not dismissed and not already active
  if (!profile || profile.tour_completed || dismissed || isTourActive) return null

  return (
    <div className="bg-brand-green/10 border border-brand-green/20 rounded-2xl p-4 mb-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-green/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-brand-green" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">Nouveau sur PillWay ?</p>
          <p className="text-gray-400 text-xs mt-0.5">Découvrez les fonctionnalités en 30 secondes</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={startTour}
              className="bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Démarrer le tour
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-gray-500 hover:text-gray-300 text-xs font-medium px-3 py-2 rounded-xl transition"
            >
              Plus tard
            </button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-500 hover:text-gray-300 transition p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
