import { useState } from 'react'
import { HEALTH_GUIDES, HEALTH_TIPS } from '../lib/interactionsDB'
import NaturalVsPharma from '../components/study/NaturalVsPharma'
import { BookOpen, ChevronDown, ChevronRight, ArrowLeft, Leaf, FlaskConical } from 'lucide-react'

const GUIDE_KEYS = ['sport', 'fatigue', 'complement', 'menstruation', 'senior', 'jeune', 'maladie_chronique']

export default function StudyPage() {
  const [activeView, setActiveView] = useState('menu') // 'menu' | 'naturalVsPharma' | guide key
  const [expandedSections, setExpandedSections] = useState({})

  function toggleSection(key) {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Guide detail view
  if (activeView !== 'menu' && activeView !== 'naturalVsPharma') {
    const guide = HEALTH_GUIDES[activeView]
    const tips = HEALTH_TIPS[activeView] || []
    if (!guide) return null

    return (
      <div className="min-h-screen bg-bg-primary pb-24">
        <div className="px-4 md:px-6 pt-6 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
          <button onClick={() => setActiveView('menu')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour</span>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: guide.color + '20' }}>
              {guide.icon}
            </div>
            <div>
              <h1 className="text-white font-display font-bold text-xl">{guide.title}</h1>
              <p className="text-gray-400 text-xs">{guide.intro}</p>
            </div>
          </div>

          {/* Guide sections */}
          <div className="space-y-3 mb-6">
            {guide.sections.map((section, idx) => {
              const key = `${activeView}-${idx}`
              const isOpen = expandedSections[key] !== false // Open by default
              return (
                <div key={idx} className="bg-bg-card rounded-2xl border border-bg-hover overflow-hidden">
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, [key]: !isOpen }))}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <h3 className="text-white font-semibold text-sm">{section.title}</h3>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4">
                      <ul className="space-y-2">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex gap-2 text-xs">
                            <span className="text-brand-green mt-0.5 flex-shrink-0">•</span>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Quick tips */}
          {tips.length > 0 && (
            <>
              <h2 className="text-white font-semibold text-sm mb-3">Conseils rapides</h2>
              <div className="space-y-2 mb-6">
                {tips.map((tip, i) => (
                  <div key={i} className="bg-bg-card rounded-xl p-3 border border-bg-hover">
                    <p className="text-white text-xs font-semibold mb-0.5">{tip.title}</p>
                    <p className="text-gray-400 text-[11px] leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
            <p className="text-amber-400 text-xs font-semibold mb-1">Avertissement</p>
            <p className="text-gray-400 text-xs">
              Ces informations sont éducatives. Consultez votre médecin avant tout changement de traitement.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Natural vs Pharma view
  if (activeView === 'naturalVsPharma') {
    return (
      <div className="min-h-screen bg-bg-primary pb-24">
        <div className="px-4 md:px-6 pt-6 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
          <button onClick={() => setActiveView('menu')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour</span>
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-400" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-white font-display font-bold text-xl">Naturel vs Pharmaceutique</h1>
              <p className="text-gray-400 text-xs">Comparaisons éducatives</p>
            </div>
          </div>
          <NaturalVsPharma />
        </div>
      </div>
    )
  }

  // Main menu
  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <div className="px-4 md:px-6 pt-6 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-white font-display font-bold text-2xl">Centre de santé</h1>
            <p className="text-gray-400 text-xs">Guides, conseils et comparaisons</p>
          </div>
        </div>

        {/* Natural vs Pharma card */}
        <button
          onClick={() => setActiveView('naturalVsPharma')}
          className="w-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-bg-hover rounded-2xl p-4 flex items-center gap-3 mb-4 text-left hover:border-green-500/30 transition"
        >
          <div className="flex -space-x-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-400" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm">Naturel vs Pharmaceutique</h3>
            <p className="text-gray-400 text-[11px]">6 comparaisons détaillées</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
        </button>

        {/* Guide cards */}
        <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Guides santé</h2>
        <div className="space-y-2.5">
          {GUIDE_KEYS.map(key => {
            const guide = HEALTH_GUIDES[key]
            if (!guide) return null
            return (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className="w-full bg-bg-card border border-bg-hover rounded-2xl p-4 flex items-center gap-3 text-left hover:border-brand-green/30 transition"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: guide.color + '20' }}
                >
                  {guide.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm">{guide.title}</h3>
                  <p className="text-gray-400 text-[11px] truncate">{guide.intro}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
