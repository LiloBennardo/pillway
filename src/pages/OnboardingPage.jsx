import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { requestNotificationPermission } from '../hooks/useNotifications'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Pill, Calendar, Heart, Leaf, Target, Moon,
  ArrowRight, ArrowLeft, Bell, Stethoscope, Clock,
  Plus, Check, SkipForward, Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

const PROFILES = [
  { key: 'prescription_quotidienne', label: 'Prescription quotidienne', icon: Pill, desc: 'Médicaments tous les jours', color: 'emerald' },
  { key: 'prescription_hebdomadaire', label: 'Prescription hebdo', icon: Calendar, desc: 'Médicaments certains jours', color: 'blue' },
  { key: 'maladie_chronique', label: 'Maladie chronique', icon: Heart, desc: 'Traitement longue durée', color: 'red' },
  { key: 'complement_alimentaire', label: 'Compléments', icon: Leaf, desc: 'Vitamines, suppléments', color: 'lime' },
  { key: 'objectif', label: 'Objectif santé', icon: Target, desc: 'Suivi sportif / bien-être', color: 'amber' },
  { key: 'regle_pilule', label: 'Cycle / Pilule', icon: Moon, desc: 'Suivi du cycle menstruel', color: 'purple' },
]

const PROFILE_COLORS = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', activeBg: 'bg-emerald-500/20', activeBorder: 'border-emerald-500', text: 'text-emerald-400', icon: 'text-emerald-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', activeBg: 'bg-blue-500/20', activeBorder: 'border-blue-500', text: 'text-blue-400', icon: 'text-blue-400' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/30', activeBg: 'bg-red-500/20', activeBorder: 'border-red-500', text: 'text-red-400', icon: 'text-red-400' },
  lime: { bg: 'bg-lime-500/10', border: 'border-lime-500/30', activeBg: 'bg-lime-500/20', activeBorder: 'border-lime-500', text: 'text-lime-400', icon: 'text-lime-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', activeBg: 'bg-amber-500/20', activeBorder: 'border-amber-500', text: 'text-amber-400', icon: 'text-amber-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', activeBg: 'bg-purple-500/20', activeBorder: 'border-purple-500', text: 'text-purple-400', icon: 'text-purple-400' },
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
}

export default function OnboardingPage() {
  const { user, updateProfile, refetchProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [saving, setSaving] = useState(false)

  // Step 2 - Profile
  const [selectedProfile, setSelectedProfile] = useState(null)

  // Step 3 - Config
  const [doctorEmail, setDoctorEmail] = useState('')
  const [alertMinutes, setAlertMinutes] = useState(5)
  const [notifications, setNotifications] = useState(true)

  // Step 4 - First med
  const [medName, setMedName] = useState('')
  const [medDosage, setMedDosage] = useState('')
  const [medTime, setMedTime] = useState('08:00')

  function goNext() {
    setDirection(1)
    setStep(s => s + 1)
  }

  function goBack() {
    setDirection(-1)
    setStep(s => s - 1)
  }

  async function addFirstMed() {
    if (!medName.trim()) return

    // Insert medication
    const { data: med, error: medErr } = await supabase
      .from('medications')
      .insert({ user_id: user.id, name: medName.trim(), dosage: medDosage.trim() || null })
      .select()
      .single()

    if (medErr) {
      toast.error('Erreur lors de l\'ajout du médicament')
      return false
    }

    // Insert reminder
    const { error: remErr } = await supabase
      .from('reminders')
      .insert({
        user_id: user.id,
        medication_id: med.id,
        scheduled_time: medTime,
        days_of_week: [1, 2, 3, 4, 5, 6, 7],
        start_date: new Date().toISOString().split('T')[0],
      })

    if (remErr) {
      toast.error('Erreur lors de la création du rappel')
      return false
    }

    return true
  }

  async function handleComplete(skipMed = false) {
    setSaving(true)

    // Add first medication if provided
    if (!skipMed && medName.trim()) {
      const ok = await addFirstMed()
      if (!ok) { setSaving(false); return }
    }

    // Request notifications
    if (notifications) {
      await requestNotificationPermission()
    }

    // Update profile
    const { error } = await updateProfile({
      user_profile: selectedProfile,
      onboarding_completed: true,
      tour_completed: false,
      doctor_email: doctorEmail || undefined,
      alert_minutes: alertMinutes,
      notifications,
      onboarding_data: { selectedProfile, configuredAt: new Date().toISOString() },
    })

    if (error) {
      toast.error('Erreur lors de la sauvegarde')
      setSaving(false)
      return
    }

    await refetchProfile()
    toast.success('Bienvenue sur PillWay !')
    navigate('/', { replace: true })
    setSaving(false)
  }

  const steps = [
    // Step 0: Welcome
    <StepWelcome key="welcome" onNext={goNext} />,
    // Step 1: Profile selection
    <StepProfile key="profile" selected={selectedProfile} onSelect={setSelectedProfile} onNext={goNext} onBack={goBack} />,
    // Step 2: Configuration
    <StepConfig
      key="config"
      doctorEmail={doctorEmail}
      setDoctorEmail={setDoctorEmail}
      alertMinutes={alertMinutes}
      setAlertMinutes={setAlertMinutes}
      notifications={notifications}
      setNotifications={setNotifications}
      onNext={goNext}
      onBack={goBack}
    />,
    // Step 3: First med + finish
    <StepFirstMed
      key="firstmed"
      medName={medName}
      setMedName={setMedName}
      medDosage={medDosage}
      setMedDosage={setMedDosage}
      medTime={medTime}
      setMedTime={setMedTime}
      saving={saving}
      onComplete={() => handleComplete(false)}
      onSkip={() => handleComplete(true)}
      onBack={goBack}
    />,
  ]

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Progress bar */}
      {step > 0 && (
        <div className="px-4 pt-4">
          <div className="flex gap-2 max-w-lg mx-auto">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-bg-card">
                <div
                  className="h-full bg-brand-green rounded-full transition-all duration-500"
                  style={{ width: step >= i ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ── Step 0: Welcome ─────────────────────────────────
function StepWelcome({ onNext }) {
  return (
    <div className="text-center">
      {/* Logo animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="w-24 h-24 rounded-3xl bg-brand-green mx-auto mb-8 flex items-center justify-center shadow-green"
      >
        <Pill className="w-12 h-12 text-white" />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white font-display font-bold text-3xl mb-3"
      >
        Bienvenue sur PillWay
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-400 text-base mb-2"
      >
        Le bon médicament, au bon moment
      </motion.p>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-500 text-sm mb-10"
      >
        Configurons votre expérience en quelques étapes
      </motion.p>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onNext}
        className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-4 px-10 rounded-2xl transition shadow-green inline-flex items-center gap-2 text-base"
      >
        Commencer
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  )
}

// ── Step 1: Profile Selection ───────────────────────
function StepProfile({ selected, onSelect, onNext, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-1 text-sm">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h2 className="text-white font-display font-bold text-2xl mb-2">Votre profil</h2>
      <p className="text-gray-400 text-sm mb-6">Comment utilisez-vous PillWay ?</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {PROFILES.map(p => {
          const colors = PROFILE_COLORS[p.color]
          const isSelected = selected === p.key
          const Icon = p.icon
          return (
            <button
              key={p.key}
              onClick={() => onSelect(p.key)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                isSelected
                  ? `${colors.activeBg} ${colors.activeBorder} scale-[1.02]`
                  : `${colors.bg} ${colors.border} hover:scale-[1.01]`
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${isSelected ? colors.activeBg : colors.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${colors.icon}`} />
              </div>
              <p className="text-white text-sm font-semibold">{p.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{p.desc}</p>
              {isSelected && (
                <div className="mt-2 flex items-center gap-1">
                  <Check className={`w-3.5 h-3.5 ${colors.text}`} />
                  <span className={`text-xs font-medium ${colors.text}`}>Sélectionné</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3.5 rounded-xl transition shadow-green disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Continuer
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Step 2: Configuration ───────────────────────────
function StepConfig({ doctorEmail, setDoctorEmail, alertMinutes, setAlertMinutes, notifications, setNotifications, onNext, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-1 text-sm">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h2 className="text-white font-display font-bold text-2xl mb-2">Configuration</h2>
      <p className="text-gray-400 text-sm mb-6">Personnalisez vos préférences</p>

      <div className="space-y-4">
        {/* Doctor email */}
        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-1.5">
            <Stethoscope className="w-4 h-4" /> Email du médecin (optionnel)
          </label>
          <input
            type="email"
            value={doctorEmail}
            onChange={e => setDoctorEmail(e.target.value)}
            className="w-full bg-bg-card border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition"
            placeholder="docteur@cabinet.fr"
          />
          <p className="text-gray-500 text-xs mt-1">Pour envoyer vos rapports mensuels</p>
        </div>

        {/* Alert minutes */}
        <div>
          <label className="flex items-center gap-2 text-gray-400 text-sm mb-1.5">
            <Clock className="w-4 h-4" /> Alerte avant la prise
          </label>
          <div className="flex gap-2">
            {[0, 5, 10, 15, 30].map(m => (
              <button
                key={m}
                onClick={() => setAlertMinutes(m)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition ${
                  alertMinutes === m
                    ? 'bg-brand-green text-white'
                    : 'bg-bg-card border border-bg-hover text-gray-400 hover:text-white'
                }`}
              >
                {m === 0 ? 'Pile' : `${m}min`}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-bg-card rounded-2xl p-4 border border-bg-hover flex items-center justify-between">
          <label className="flex items-center gap-2 text-gray-300 text-sm">
            <Bell className="w-4 h-4" /> Notifications & son
          </label>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-7 rounded-full transition-colors ${notifications ? 'bg-brand-green' : 'bg-gray-600'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full mt-8 bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3.5 rounded-xl transition shadow-green flex items-center justify-center gap-2"
      >
        Continuer
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Step 3: First Medication ────────────────────────
function StepFirstMed({ medName, setMedName, medDosage, setMedDosage, medTime, setMedTime, saving, onComplete, onSkip, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-1 text-sm">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h2 className="text-white font-display font-bold text-2xl mb-2">Premier médicament</h2>
      <p className="text-gray-400 text-sm mb-6">Ajoutez votre premier rappel ou passez cette étape</p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1.5">Nom du médicament</label>
          <input
            type="text"
            value={medName}
            onChange={e => setMedName(e.target.value)}
            className="w-full bg-bg-card border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition"
            placeholder="ex: Doliprane, Levothyrox..."
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1.5">Dosage (optionnel)</label>
          <input
            type="text"
            value={medDosage}
            onChange={e => setMedDosage(e.target.value)}
            className="w-full bg-bg-card border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition"
            placeholder="ex: 1000mg, 2 comprimés..."
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1.5">Heure de prise</label>
          <input
            type="time"
            value={medTime}
            onChange={e => setMedTime(e.target.value)}
            className="w-full bg-bg-card border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition"
          />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={onComplete}
          disabled={saving || !medName.trim()}
          className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3.5 rounded-xl transition shadow-green disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Ajouter et terminer
            </>
          )}
        </button>

        <button
          onClick={onSkip}
          disabled={saving}
          className="w-full bg-bg-card hover:bg-bg-hover text-gray-300 font-semibold py-3.5 rounded-xl transition border border-bg-hover flex items-center justify-center gap-2 text-sm"
        >
          <SkipForward className="w-4 h-4" />
          Passer cette étape
        </button>
      </div>
    </div>
  )
}
