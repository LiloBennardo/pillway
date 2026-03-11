import { Pill, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function NoticeCard({ result, onAdd }) {
  return (
    <div className="bg-bg-card rounded-2xl overflow-hidden border border-bg-hover">
      <div className="flex items-center gap-3 p-4 border-b border-bg-hover">
        <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center">
          <Pill className="w-5 h-5 text-brand-green" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-base">{result.name || 'Médicament détecté'}</h3>
          {result.dosage && (
            <p className="text-brand-green text-sm font-medium">{result.dosage}</p>
          )}
        </div>
        {result.form && (
          <span className="text-xs bg-bg-hover text-gray-300 px-2 py-1 rounded-lg capitalize">
            {result.form}
          </span>
        )}
      </div>

      {result.how_to_take && (
        <div className="p-4 border-b border-bg-hover">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-brand-green" />
            <p className="text-white text-sm font-semibold">Comment le prendre</p>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{result.how_to_take}</p>
        </div>
      )}

      {result.warnings?.length > 0 && (
        <div className="p-4 border-b border-bg-hover">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <p className="text-white text-sm font-semibold">Précautions</p>
          </div>
          <ul className="space-y-1">
            {result.warnings.map((w, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">&bull;</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.interactions?.length > 0 && (
        <div className="p-4 border-b border-bg-hover bg-red-500/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <p className="text-white text-sm font-semibold">Interactions à éviter</p>
          </div>
          <ul className="space-y-1">
            {result.interactions.map((inter, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-red-400 mt-0.5">&bull;</span>
                {inter}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.summary && (
        <div className="p-4 border-b border-bg-hover">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <p className="text-white text-sm font-semibold">Résumé IA</p>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed italic">{result.summary}</p>
        </div>
      )}

      {onAdd && (
        <div className="p-4">
          <button
            onClick={() => onAdd(result)}
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3.5 rounded-xl transition shadow-green"
          >
            + Ajouter à mes médicaments
          </button>
        </div>
      )}
    </div>
  )
}
