import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Calendar, Info } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { searchMedications, CATEGORIES } from '../../lib/medicationsDB'
import { MedicationSchema, ReminderSchema, getZodErrors } from '../../lib/schemas'
import { sanitizeMedName, sanitizeDosage, sanitizeText } from '../../lib/sanitize'
import { checkRateLimit } from '../../lib/rateLimiter'
import toast from 'react-hot-toast'

const PILL_COLORS = [
  { color: '#F59E0B', label: 'Jaune' },
  { color: '#10B981', label: 'Vert' },
  { color: '#3B82F6', label: 'Bleu' },
  { color: '#EF4444', label: 'Rouge' },
  { color: '#8B5CF6', label: 'Violet' },
  { color: '#EC4899', label: 'Rose' },
  { color: '#F97316', label: 'Orange' },
  { color: '#94A3B8', label: 'Gris' },
]

const DAYS_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const FREQUENCY_PRESETS = [
  { id: 'everyday', label: 'Tous les jours', days: [1, 2, 3, 4, 5, 6, 7] },
  { id: 'weekdays', label: 'Lundi → Vendredi', days: [1, 2, 3, 4, 5] },
  { id: 'weekend', label: 'Week-end', days: [6, 7] },
  { id: 'custom', label: 'Personnalisé', days: [] },
]

export default function AddMedicationReminderModal({ onClose, onCreated }) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedTip, setSelectedTip] = useState(null)

  const [medForm, setMedForm] = useState({
    name: '',
    dosage: '',
    form: 'comprimé',
    color: '#F59E0B',
    notes: '',
  })

  const [reminderForm, setReminderForm] = useState({
    scheduledTime: '08:00',
    frequencyId: 'everyday',
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    alertMinutes: 10,
    addSecondTime: false,
    secondTime: '20:00',
  })

  function handleMedNameChange(val) {
    setMedForm(p => ({ ...p, name: val }))
    if (val.length < 2) { setSuggestions([]); setShowSuggestions(false); return }

    // Search local DB
    const localResults = searchMedications(val)
    setSuggestions(localResults)
    setShowSuggestions(localResults.length > 0)
  }

  function applySuggestion(sug) {
    const catColor = CATEGORIES[sug.category]?.color
    setMedForm(p => ({
      ...p,
      name: sug.name,
      dosage: sug.dosage || p.dosage,
      color: catColor || p.color,
      form: sug.form || p.form,
    }))
    setSelectedTip(sug.tip || null)
    setShowSuggestions(false)
    setSuggestions([])
  }

  function handleFrequencyPreset(preset) {
    if (preset.id === 'custom') {
      setReminderForm(p => ({ ...p, frequencyId: 'custom', daysOfWeek: [] }))
    } else {
      setReminderForm(p => ({ ...p, frequencyId: preset.id, daysOfWeek: preset.days }))
    }
  }

  function toggleDay(dayNum) {
    setReminderForm(p => ({
      ...p,
      frequencyId: 'custom',
      daysOfWeek: p.daysOfWeek.includes(dayNum)
        ? p.daysOfWeek.filter(d => d !== dayNum)
        : [...p.daysOfWeek, dayNum].sort(),
    }))
  }

  async function handleSave() {
    // Rate limit check
    const rl = checkRateLimit('add_medication')
    if (!rl.allowed) { toast.error(rl.message); return }

    // Validate medication
    const medErrors = getZodErrors(MedicationSchema, medForm)
    if (medErrors) {
      toast.error(Object.values(medErrors)[0])
      return
    }

    // Validate reminder
    const reminderErrors = getZodErrors(ReminderSchema, {
      scheduledTime: reminderForm.scheduledTime,
      daysOfWeek: reminderForm.daysOfWeek,
      startDate: reminderForm.startDate,
      endDate: reminderForm.endDate || null,
      alertMinutes: reminderForm.alertMinutes,
    })
    if (reminderErrors) {
      toast.error(Object.values(reminderErrors)[0])
      return
    }

    setSaving(true)
    try {
      // 1. Create medication (sanitized)
      const { data: medData, error: medError } = await supabase
        .from('medications')
        .insert({
          user_id: user.id,
          name: sanitizeMedName(medForm.name),
          dosage: sanitizeDosage(medForm.dosage) || null,
          form: medForm.form,
          color: medForm.color,
          notes: sanitizeText(medForm.notes) || null,
        })
        .select()
        .single()

      if (medError) throw medError

      // 2. Create main reminder
      await supabase.from('reminders').insert({
        user_id: user.id,
        medication_id: medData.id,
        scheduled_time: reminderForm.scheduledTime,
        days_of_week: reminderForm.daysOfWeek,
        start_date: reminderForm.startDate,
        end_date: reminderForm.endDate || null,
        alert_minutes: reminderForm.alertMinutes,
        is_active: true,
      })

      // 3. If second dose enabled → create 2nd reminder
      if (reminderForm.addSecondTime) {
        await supabase.from('reminders').insert({
          user_id: user.id,
          medication_id: medData.id,
          scheduled_time: reminderForm.secondTime,
          days_of_week: reminderForm.daysOfWeek,
          start_date: reminderForm.startDate,
          end_date: reminderForm.endDate || null,
          alert_minutes: reminderForm.alertMinutes,
          is_active: true,
        })
      }

      toast.success(`${medForm.name} ajouté à vos rappels`)
      onCreated?.()
      onClose()
    } catch (err) {
      toast.error('Erreur lors de la création')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-bg-card w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto"
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-bg-hover rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-bg-hover sticky top-0 bg-bg-card z-10">
          <div>
            <h2 className="text-white font-bold text-lg">
              {step === 1 ? 'Quel médicament ?' : 'Configurer le rappel'}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              {[1, 2].map(s => (
                <div
                  key={s}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: s === step ? 20 : 8,
                    background: s <= step ? '#10B981' : '#243B55',
                  }}
                />
              ))}
              <span className="text-gray-500 text-xs ml-1">{step}/2</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-bg-hover flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: MEDICATION ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Name + autocomplete */}
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-2">
                    Nom du médicament *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Doliprane, Whey, Vitamine D..."
                      value={medForm.name}
                      onChange={e => handleMedNameChange(e.target.value)}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="w-full bg-bg-primary text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm border border-bg-hover focus:border-brand-green outline-none transition"
                      autoFocus
                    />
                    <AnimatePresence>
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-bg-primary border border-bg-hover rounded-xl overflow-hidden z-20 shadow-card max-h-52 overflow-y-auto"
                        >
                          {suggestions.map((sug, i) => {
                            const cat = CATEGORIES[sug.category]
                            return (
                              <button
                                key={`${sug.name}-${sug.dosage}-${i}`}
                                onMouseDown={() => applySuggestion(sug)}
                                className="w-full text-left px-4 py-3 hover:bg-bg-hover transition flex items-center gap-3 border-b border-bg-hover last:border-b-0"
                              >
                                <span className="text-sm">{cat?.icon || '💊'}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-medium">{sug.name}</p>
                                  <p className="text-gray-500 text-xs">
                                    {sug.dosage && `${sug.dosage} · `}{sug.form} · {cat?.label || ''}
                                  </p>
                                </div>
                              </button>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Tip from DB */}
                {selectedTip && (
                  <div className="flex items-start gap-2 bg-brand-green/10 border border-brand-green/20 rounded-xl p-3">
                    <Info className="w-3.5 h-3.5 text-brand-green mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-[11px] leading-relaxed">{selectedTip}</p>
                  </div>
                )}

                {/* Dosage */}
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-2">
                    Dosage <span className="text-gray-500 font-normal">(facultatif)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 500 mg, 1000 UI, 2 gélules"
                    value={medForm.dosage}
                    onChange={e => setMedForm(p => ({ ...p, dosage: e.target.value }))}
                    className="w-full bg-bg-primary text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm border border-bg-hover focus:border-brand-green outline-none transition"
                  />
                </div>

                {/* Form */}
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-2">Forme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['comprimé', 'gélule', 'sirop', 'poudre', 'injection', 'autre'].map(form => (
                      <button
                        key={form}
                        onClick={() => setMedForm(p => ({ ...p, form }))}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all capitalize ${
                          medForm.form === form
                            ? 'bg-brand-green/15 border-brand-green text-brand-green'
                            : 'bg-bg-primary border-bg-hover text-gray-400'
                        }`}
                      >
                        {form}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pill color */}
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-2">Couleur</label>
                  <div className="flex gap-2 flex-wrap">
                    {PILL_COLORS.map(({ color }) => (
                      <button
                        key={color}
                        onClick={() => setMedForm(p => ({ ...p, color }))}
                        className={`w-8 h-8 rounded-full transition-all ${
                          medForm.color === color ? 'ring-2 ring-white scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {medForm.name && (
                  <div className="flex items-center gap-3 bg-bg-primary rounded-xl p-3 border border-bg-hover">
                    <div
                      className="w-9 h-12 rounded-xl flex-shrink-0"
                      style={{ background: medForm.color }}
                    />
                    <div>
                      <p className="text-white font-semibold text-sm">{medForm.name}</p>
                      <p className="text-gray-400 text-xs">{medForm.dosage || 'Dosage non renseigné'} · {medForm.form}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => medForm.name.trim() && setStep(2)}
                  disabled={!medForm.name.trim()}
                  className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-4 rounded-2xl transition shadow-green disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Configurer le rappel →
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: REMINDER ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Med recap */}
                <div className="flex items-center gap-3 bg-bg-primary rounded-xl p-3 border border-bg-hover">
                  <div className="w-8 h-10 rounded-lg flex-shrink-0" style={{ background: medForm.color }} />
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{medForm.name}</p>
                    <p className="text-gray-400 text-xs">{medForm.dosage}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-gray-500 hover:text-brand-green text-xs transition">
                    Modifier
                  </button>
                </div>

                {/* Time */}
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-2">
                    <Clock className="w-4 h-4 inline mr-1.5 text-brand-green" />
                    Heure de prise
                  </label>
                  <input
                    type="time"
                    value={reminderForm.scheduledTime}
                    onChange={e => setReminderForm(p => ({ ...p, scheduledTime: e.target.value }))}
                    className="w-full bg-bg-primary text-white rounded-xl px-4 py-3 text-sm border border-bg-hover focus:border-brand-green outline-none"
                  />
                </div>

                {/* Second dose toggle */}
                <div
                  className="flex items-center justify-between bg-bg-primary rounded-xl px-4 py-3 border border-bg-hover cursor-pointer"
                  onClick={() => setReminderForm(p => ({ ...p, addSecondTime: !p.addSecondTime }))}
                >
                  <div>
                    <p className="text-white text-sm font-medium">Ajouter une 2ème prise</p>
                    <p className="text-gray-500 text-xs">Ex: matin + soir</p>
                  </div>
                  <div
                    className="w-11 h-6 rounded-full transition-all relative"
                    style={{ background: reminderForm.addSecondTime ? '#10B981' : '#243B55' }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
                      style={{ left: reminderForm.addSecondTime ? 26 : 4 }}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {reminderForm.addSecondTime && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <label className="text-gray-300 text-sm font-medium block mb-2">2ème heure</label>
                      <input
                        type="time"
                        value={reminderForm.secondTime}
                        onChange={e => setReminderForm(p => ({ ...p, secondTime: e.target.value }))}
                        className="w-full bg-bg-primary text-white rounded-xl px-4 py-3 text-sm border border-bg-hover focus:border-brand-green outline-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Frequency */}
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-2">
                    <Calendar className="w-4 h-4 inline mr-1.5 text-brand-green" />
                    Fréquence
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {FREQUENCY_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => handleFrequencyPreset(preset)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all text-left ${
                          reminderForm.frequencyId === preset.id
                            ? 'bg-brand-green/15 border-brand-green text-brand-green'
                            : 'bg-bg-primary border-bg-hover text-gray-400'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1.5">
                    {DAYS_LABELS.map((label, i) => {
                      const dayNum = i + 1
                      const active = reminderForm.daysOfWeek.includes(dayNum)
                      return (
                        <button
                          key={dayNum}
                          onClick={() => toggleDay(dayNum)}
                          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                            active
                              ? 'bg-brand-green text-white'
                              : 'bg-bg-primary text-gray-500 border border-bg-hover'
                          }`}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Start/End dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-300 text-xs font-medium block mb-1.5">Début</label>
                    <input
                      type="date"
                      value={reminderForm.startDate}
                      onChange={e => setReminderForm(p => ({ ...p, startDate: e.target.value }))}
                      className="w-full bg-bg-primary text-white rounded-xl px-3 py-2.5 text-xs border border-bg-hover focus:border-brand-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium block mb-1.5">
                      Fin <span className="text-gray-600">(optionnel)</span>
                    </label>
                    <input
                      type="date"
                      value={reminderForm.endDate}
                      min={reminderForm.startDate}
                      onChange={e => setReminderForm(p => ({ ...p, endDate: e.target.value }))}
                      className="w-full bg-bg-primary text-white rounded-xl px-3 py-2.5 text-xs border border-bg-hover focus:border-brand-green outline-none"
                    />
                  </div>
                </div>

                {/* Alert minutes */}
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-2">
                    Me rappeler … avant
                  </label>
                  <div className="flex gap-2">
                    {[5, 10, 15, 30, 60].map(min => (
                      <button
                        key={min}
                        onClick={() => setReminderForm(p => ({ ...p, alertMinutes: min }))}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          reminderForm.alertMinutes === min
                            ? 'bg-brand-green text-white border-brand-green'
                            : 'bg-bg-primary text-gray-400 border-bg-hover'
                        }`}
                      >
                        {min === 60 ? '1h' : `${min}m`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-bg-hover text-gray-400 font-semibold py-4 rounded-2xl hover:bg-bg-hover hover:text-white transition"
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || reminderForm.daysOfWeek.length === 0}
                    className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white font-bold py-4 rounded-2xl transition shadow-green disabled:opacity-40"
                  >
                    {saving ? 'Enregistrement...' : 'Créer le rappel'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
