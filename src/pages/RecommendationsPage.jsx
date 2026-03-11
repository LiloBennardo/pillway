import { useRecommendations } from '../hooks/useRecommendations'
import { useMedications } from '../hooks/useMedications'
import { useAuth } from '../contexts/AuthContext'
import RecommendationCard from '../components/recommendations/RecommendationCard'
import { HEALTH_TIPS } from '../lib/interactionsDB'
import { CheckCircle2, AlertTriangle, Lightbulb, Heart } from 'lucide-react'
import { useState } from 'react'

export default function RecommendationsPage() {
  const { recommendations, interactions, advices, loading } = useRecommendations()
  const { medications } = useMedications()
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('all')

  // Get profile-specific tips
  const profileKey = profile?.user_profile
  const profileTipsMap = {
    objectif: 'sport',
    complement_alimentaire: 'complement',
    regle_pilule: 'menstruation',
    maladie_chronique: 'maladie_chronique',
    senior: 'senior',
  }
  const profileTips = HEALTH_TIPS[profileTipsMap[profileKey]] || HEALTH_TIPS.complement || []

  const displayed = activeTab === 'interactions'
    ? interactions
    : activeTab === 'advices'
    ? advices
    : recommendations

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <div className="px-4 md:px-6 pt-6 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-white font-display font-bold text-2xl">Recommandations</h1>
          <p className="text-gray-400 text-xs mt-1">
            {medications.length > 0
              ? `Basé sur vos ${medications.length} médicament${medications.length > 1 ? 's' : ''}`
              : 'Ajoutez des médicaments pour obtenir des conseils'}
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className={`rounded-xl p-3 border ${interactions.length > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-bg-card border-bg-hover'}`}>
            <AlertTriangle className={`w-5 h-5 mb-1 ${interactions.length > 0 ? 'text-red-400' : 'text-gray-500'}`} />
            <p className="text-white font-bold text-lg">{interactions.length}</p>
            <p className="text-gray-400 text-[10px]">Interactions détectées</p>
          </div>
          <div className={`rounded-xl p-3 border ${advices.length > 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-bg-card border-bg-hover'}`}>
            <Lightbulb className={`w-5 h-5 mb-1 ${advices.length > 0 ? 'text-blue-400' : 'text-gray-500'}`} />
            <p className="text-white font-bold text-lg">{advices.length}</p>
            <p className="text-gray-400 text-[10px]">Conseils personnalisés</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Tout' },
            { id: 'interactions', label: `Interactions (${interactions.length})` },
            { id: 'advices', label: `Conseils (${advices.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-brand-green text-white'
                  : 'bg-bg-card text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Recommendations list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-bg-card rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto mb-3 opacity-50" />
            <p className="text-gray-400 text-sm">
              {medications.length === 0
                ? 'Ajoutez des médicaments pour obtenir des recommandations'
                : 'Aucune interaction détectée'}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {medications.length === 0
                ? 'Allez dans l\'onglet Rappels pour commencer'
                : 'Vos médicaments semblent compatibles'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {displayed.map(rec => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        )}

        {/* Profile health tips */}
        {profileTips.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-brand-green" />
              <h2 className="text-white font-semibold text-sm">Conseils pour votre profil</h2>
            </div>
            <div className="space-y-2">
              {profileTips.slice(0, 5).map((tip, i) => (
                <div key={i} className="bg-bg-card rounded-xl p-3 border border-bg-hover">
                  <p className="text-white text-xs font-semibold mb-0.5">{tip.title}</p>
                  <p className="text-gray-400 text-[11px] leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
