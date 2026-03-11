import { format, differenceInMinutes } from 'date-fns'
import { Check, Clock, SkipForward, Timer } from 'lucide-react'
import { useProfileMode } from '../../hooks/useProfileMode'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'

function PillSVG({ color, size = 44 }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 44 60" fill="none">
      <rect x="4" y="4" width="36" height="52" rx="18" fill={color} />
      <rect x="4" y="26" width="36" height="8" fill="rgba(0,0,0,0.15)" />
      <rect x="4" y="4" width="36" height="26" rx="18" fill={color} />
      <rect x="4" y="30" width="36" height="26" rx="18" fill={color} opacity="0.75" />
    </svg>
  )
}

function NoMedCard() {
  return (
    <div className="bg-bg-card rounded-3xl p-5 mb-4 text-center border border-bg-hover">
      <span className="text-4xl mb-3 block">🎉</span>
      <p className="text-white font-bold text-lg">Tout est à jour !</p>
      <p className="text-gray-400 text-sm mt-1">Aucune prise prévue pour le moment.</p>
    </div>
  )
}

export { NoMedCard }

export default function NextMedCard({ log, onTake, onSnooze }) {
  const { profile } = useAuth()
  const { titleSize, buttonSize, cardPadding, isSenior } = useProfileMode()

  if (!log) return <NoMedCard />

  const scheduledAt = new Date(log.scheduled_at)
  const minsLeft = differenceInMinutes(scheduledAt, new Date())
  const isOverdue = minsLeft < 0
  const isSoon = minsLeft <= 15 && minsLeft >= 0

  const pillColor = log.medications?.color || '#F59E0B'
  const medName = log.medications?.name || 'Médicament'
  const dosage = log.medications?.dosage || ''

  const profileEmoji = {
    regle_pilule: '🌸',
    complement_alimentaire: '💪',
    maladie_chronique: '🏥',
    senior: '💊',
  }

  return (
    <motion.div
      data-tour-id="next-med"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`bg-bg-card rounded-3xl ${cardPadding} mb-4 border border-bg-hover`}
    >
      {/* Status header */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          isOverdue ? 'bg-red-500/20 text-red-400' :
          isSoon    ? 'bg-amber-500/20 text-amber-400' :
                      'bg-brand-green/20 text-brand-green'
        }`}>
          {isOverdue
            ? `En retard de ${Math.abs(minsLeft)} min`
            : isSoon
            ? `Dans ${minsLeft} min`
            : format(scheduledAt, 'HH:mm')}
        </span>
        <span className="text-lg">
          {profileEmoji[profile?.user_profile] || '💊'}
        </span>
      </div>

      {/* Medication info */}
      <div className="flex items-center gap-4 mb-4">
        <PillSVG color={pillColor} size={isSenior ? 56 : 44} />
        <div>
          <p className={`font-bold text-white ${titleSize}`}>{medName}</p>
          {dosage && <p className="text-gray-400 text-sm">{dosage}</p>}
          {!isSenior && (
            <p className="text-gray-500 text-xs mt-0.5">
              <Clock className="w-3 h-3 inline mr-1" />
              {format(scheduledAt, 'HH:mm')}
            </p>
          )}
        </div>
      </div>

      {/* Main CTA */}
      <button
        onClick={() => onTake(log.id, 'taken')}
        aria-label={`Marquer ${medName} ${dosage} comme pris`}
        className={`w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold ${buttonSize} rounded-2xl transition shadow-green active:scale-95 flex items-center justify-center gap-2`}
      >
        <Check className="w-5 h-5" />
        {isSenior ? 'J\'ai pris mon médicament' : 'Pris'}
      </button>

      {/* Secondary actions */}
      {!isSenior && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onTake(log.id, 'skipped')}
            className="flex-1 text-gray-400 text-xs py-2 rounded-xl border border-bg-hover hover:bg-bg-hover transition flex items-center justify-center gap-1"
          >
            <SkipForward className="w-3 h-3" />
            Ignorer
          </button>
          {onSnooze && (
            <button
              onClick={() => onSnooze(log.id)}
              className="flex-1 text-gray-400 text-xs py-2 rounded-xl border border-bg-hover hover:bg-bg-hover transition flex items-center justify-center gap-1"
            >
              <Timer className="w-3 h-3" />
              +15 min
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
