import { useState } from 'react'
import { Leaf, FlaskConical, ArrowRight, ChevronDown } from 'lucide-react'

const STUDIES = [
  {
    id: 1,
    title: 'Douleur & Inflammation',
    natural: {
      name: 'Curcuma (curcumine)',
      description: 'Anti-inflammatoire naturel puissant. Études montrent une réduction significative de la douleur articulaire.',
      pros: ['Peu d\'effets secondaires', 'Action anti-oxydante', 'Bien toléré long terme'],
      cons: ['Biodisponibilité faible sans pipérine', 'Action plus lente (2 semaines)'],
    },
    pharma: {
      name: 'Ibuprofène (AINS)',
      description: 'Anti-inflammatoire non stéroïdien. Action rapide et puissante sur la douleur et l\'inflammation.',
      pros: ['Action rapide (30-60 min)', 'Efficacité prouvée', 'Disponible sans ordonnance'],
      cons: ['Risque gastrique', 'Contre-indiqué insuffisance rénale', 'Max 3-5 jours sans avis médical'],
    },
    verdict: 'Le curcuma est adapté à l\'inflammation chronique légère. L\'ibuprofène est plus efficace pour la douleur aiguë mais limité dans le temps.',
  },
  {
    id: 2,
    title: 'Stress & Anxiété',
    natural: {
      name: 'Ashwagandha',
      description: 'Plante adaptogène ayurvédique. Réduit le cortisol de 30% et améliore la résistance au stress.',
      pros: ['Réduit le cortisol de 30%', 'Améliore le sommeil', 'Pas de dépendance'],
      cons: ['Résultats après 4-6 semaines', 'Interactions thyroïde', 'Qualité variable entre marques'],
    },
    pharma: {
      name: 'Benzodiazépines (Xanax)',
      description: 'Anxiolytique à action rapide. Prescrit pour l\'anxiété aiguë et les crises de panique.',
      pros: ['Action immédiate', 'Très efficace anxiété aiguë', 'Bien étudié'],
      cons: ['Risque de dépendance élevé', 'Somnolence importante', 'Sevrage difficile et long'],
    },
    verdict: 'L\'ashwagandha pour le stress chronique. Les benzodiazépines uniquement en crise, sous surveillance médicale, et de façon temporaire.',
  },
  {
    id: 3,
    title: 'Sommeil',
    natural: {
      name: 'Mélatonine + Magnésium',
      description: 'Combinaison naturelle favorisant l\'endormissement et la qualité du sommeil profond.',
      pros: ['Régule le cycle circadien', 'Pas de dépendance', 'Bien toléré'],
      cons: ['Moins efficace insomnie sévère', 'Somnolence matinale si dose trop haute'],
    },
    pharma: {
      name: 'Zolpidem (Stilnox)',
      description: 'Hypnotique non-benzodiazépine. Induit le sommeil rapidement.',
      pros: ['Endormissement rapide', 'Durée d\'action courte', 'Efficace insomnie aiguë'],
      cons: ['Risque de dépendance', 'Somnambulisme possible', 'Max 4 semaines de traitement'],
    },
    verdict: 'Commencez toujours par la mélatonine 2mg + magnésium 300mg. Le Stilnox uniquement si insomnie sévère et sur prescription.',
  },
  {
    id: 4,
    title: 'Fatigue & Énergie',
    natural: {
      name: 'Rhodiola + Spiruline',
      description: 'Adaptogène anti-fatigue (Rhodiola) et super-aliment riche en fer et protéines (Spiruline).',
      pros: ['Énergie naturelle sans excitant', 'Riche en nutriments', 'Action en 1-2 semaines'],
      cons: ['Moins efficace si carence médicale (fer, thyroïde)', 'Goût spiruline déplaisant'],
    },
    pharma: {
      name: 'Modafinil / Caféine médicale',
      description: 'Stimulant du système nerveux central. Prescrit pour la narcolepsie et la fatigue excessive.',
      pros: ['Action immédiate', 'Très efficace', 'Alertness augmentée'],
      cons: ['Sur ordonnance uniquement', 'Insomnie si prise tardive', 'Anxiété possible'],
    },
    verdict: 'Avant tout : faire un bilan sanguin (fer, thyroïde, D, B12). La Rhodiola est un excellent premier recours pour la fatigue fonctionnelle.',
  },
  {
    id: 5,
    title: 'Cholestérol',
    natural: {
      name: 'Oméga 3 + Levure de riz rouge',
      description: 'Les oméga 3 réduisent les triglycérides. La levure de riz rouge contient une statine naturelle.',
      pros: ['Effet prouvé sur les triglycérides', 'Bénéfices cardiovasculaires globaux', 'Bien toléré'],
      cons: ['Levure de riz rouge = mêmes effets secondaires que les statines', 'Effet modéré'],
    },
    pharma: {
      name: 'Atorvastatine (Tahor)',
      description: 'Statine. Réduit le LDL-cholestérol de 30-50%. Traitement de référence.',
      pros: ['Réduction puissante du LDL', 'Réduit le risque cardiovasculaire de 30%', 'Bien étudié'],
      cons: ['Douleurs musculaires possibles', 'Surveillance hépatique', 'Pas de pamplemousse'],
    },
    verdict: 'Oméga 3 pour tous en prévention. Statines si risque cardiovasculaire élevé. La levure de riz rouge ≠ "naturel sans risque".',
  },
  {
    id: 6,
    title: 'Douleurs menstruelles',
    natural: {
      name: 'Magnésium + Oméga 3',
      description: 'Le magnésium réduit les crampes de 40%. Les oméga 3 sont anti-inflammatoires naturels.',
      pros: ['Pas d\'effet hormonal', 'Action sur le SPM aussi', 'Utilisable long terme'],
      cons: ['Action sur 2-3 cycles', 'Moins efficace douleurs très fortes'],
    },
    pharma: {
      name: 'Ibuprofène + Spasfon',
      description: 'Anti-inflammatoire + antispasmodique. Combinaison classique contre les dysménorrhées.',
      pros: ['Soulagement en 30-60 min', 'Très efficace', 'Disponible sans ordonnance'],
      cons: ['Ibuprofène : risque gastrique', 'Ne traite pas la cause', 'Usage ponctuel seulement'],
    },
    verdict: 'Magnésium en prévention (commencer 3 jours avant). Ibuprofène + Spasfon en cas de douleur aiguë. Bouillotte = bonus efficace.',
  },
]

export default function NaturalVsPharma() {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-sm mb-4">
        Comparaisons éducatives entre alternatives naturelles et traitements pharmaceutiques.
        <span className="text-amber-400 font-medium"> Consultez toujours votre médecin avant tout changement.</span>
      </p>

      {STUDIES.map(study => (
        <div key={study.id} className="bg-bg-card rounded-2xl border border-bg-hover overflow-hidden">
          <button
            onClick={() => setExpandedId(expandedId === study.id ? null : study.id)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-green-400" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <h3 className="text-white font-semibold text-sm">{study.title}</h3>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === study.id ? 'rotate-180' : ''}`} />
          </button>

          {expandedId === study.id && (
            <div className="px-4 pb-4 space-y-3">
              {/* Natural */}
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-green-400" />
                  <h4 className="text-green-400 font-semibold text-sm">{study.natural.name}</h4>
                </div>
                <p className="text-gray-300 text-xs mb-2.5">{study.natural.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-green-400 text-[10px] font-bold mb-1">AVANTAGES</p>
                    {study.natural.pros.map((p, i) => (
                      <p key={i} className="text-gray-400 text-[11px] leading-relaxed">+ {p}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-amber-400 text-[10px] font-bold mb-1">LIMITES</p>
                    {study.natural.cons.map((c, i) => (
                      <p key={i} className="text-gray-400 text-[11px] leading-relaxed">- {c}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pharma */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="w-4 h-4 text-blue-400" />
                  <h4 className="text-blue-400 font-semibold text-sm">{study.pharma.name}</h4>
                </div>
                <p className="text-gray-300 text-xs mb-2.5">{study.pharma.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-green-400 text-[10px] font-bold mb-1">AVANTAGES</p>
                    {study.pharma.pros.map((p, i) => (
                      <p key={i} className="text-gray-400 text-[11px] leading-relaxed">+ {p}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-amber-400 text-[10px] font-bold mb-1">LIMITES</p>
                    {study.pharma.cons.map((c, i) => (
                      <p key={i} className="text-gray-400 text-[11px] leading-relaxed">- {c}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verdict */}
              <div className="bg-brand-green/5 border border-brand-green/20 rounded-xl p-3">
                <p className="text-brand-green text-[10px] font-bold mb-1">NOTRE VERDICT</p>
                <p className="text-gray-300 text-xs">{study.verdict}</p>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mt-4">
        <p className="text-amber-400 text-xs font-semibold mb-1">Avertissement</p>
        <p className="text-gray-400 text-xs">
          Ces informations sont éducatives et ne remplacent en aucun cas un avis médical.
          Ne modifiez jamais votre traitement sans consulter votre médecin ou pharmacien.
        </p>
      </div>
    </div>
  )
}
