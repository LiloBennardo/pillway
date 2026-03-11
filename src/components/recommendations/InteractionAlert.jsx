import { useRecommendations } from '../../hooks/useRecommendations'
import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function InteractionAlert() {
  const { interactions } = useRecommendations()

  const dangerous = interactions.filter(r => r.severity === 'danger')
  if (!dangerous.length) return null

  return (
    <Link
      to="/recommandations"
      className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-4 hover:bg-red-500/20 transition"
    >
      <div className="bg-red-500/20 p-2 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-red-400" />
      </div>
      <div className="flex-1">
        <p className="text-white font-semibold text-sm">
          {dangerous.length} interaction{dangerous.length > 1 ? 's' : ''} détectée{dangerous.length > 1 ? 's' : ''}
        </p>
        <p className="text-gray-400 text-xs mt-0.5">
          {dangerous[0].title}
        </p>
      </div>
      <span className="text-red-400 text-xs font-bold">Voir</span>
    </Link>
  )
}
