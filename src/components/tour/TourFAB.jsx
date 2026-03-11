import { HelpCircle } from 'lucide-react'
import { useTour } from '../../contexts/TourContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function TourFAB() {
  const { isTourActive, startTour } = useTour()
  const { updateProfile } = useAuth()
  const navigate = useNavigate()

  if (isTourActive) return null

  async function handleClick() {
    await updateProfile({ tour_completed: false })
    navigate('/')
    setTimeout(() => startTour(), 500)
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 left-4 z-30 w-10 h-10 bg-bg-card border border-bg-hover rounded-full flex items-center justify-center text-gray-400 hover:text-brand-green hover:border-brand-green/40 transition-all shadow-card md:bottom-6"
      aria-label="Revoir le tutoriel"
    >
      <HelpCircle className="w-5 h-5" />
    </button>
  )
}
