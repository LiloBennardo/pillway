import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <div className="px-4 md:px-6 pt-6 max-w-lg md:max-w-2xl mx-auto text-center">
        <div className="bg-brand-green/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-brand-green" />
        </div>
        <h1 className="text-white font-display font-bold text-2xl mb-2">Toutes les fonctionnalités sont débloquées</h1>
        <p className="text-gray-400 text-sm mb-8">
          Profitez de l'ensemble des fonctionnalités PillWay sans restriction.
        </p>
        <Link
          to="/"
          className="inline-block bg-brand-green hover:bg-brand-green-dark text-white font-bold px-8 py-3.5 rounded-xl transition shadow-green"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
