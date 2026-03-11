import { useState, useMemo } from 'react'
import Modal from '../ui/Modal'
import toast from 'react-hot-toast'
import { searchMedications, CATEGORIES } from '../../lib/medicationsDB'
import { Search, Plus, Clock, Info, ChevronRight } from 'lucide-react'

const DAYS = [
  { id: 1, label: 'L' },
  { id: 2, label: 'M' },
  { id: 3, label: 'M' },
  { id: 4, label: 'J' },
  { id: 5, label: 'V' },
  { id: 6, label: 'S' },
  { id: 7, label: 'D' },
]

const QUICK_TIMES = [
  { label: 'Matin', value: '08:00', icon: '🌅' },
  { label: 'Midi', value: '12:00', icon: '☀️' },
  { label: 'Soir', value: '20:00', icon: '🌙' },
  { label: 'Coucher', value: '22:00', icon: '😴' },
]

export default function AddReminderModal({ isOpen, onClose, medications, onAdd, onAddMedication }) {
  const [step, setStep] = useState(1) // 1: select med, 2: configure
  const [medicationId, setMedicationId] = useState('')
  const [time, setTime] = useState('08:00')
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5, 6, 7])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDbMed, setSelectedDbMed] = useState(null)

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return []
    return searchMedications(searchQuery)
  }, [searchQuery])

  function toggleDay(dayId) {
    setSelectedDays(prev =>
      prev.includes(dayId)
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId].sort()
    )
  }

  function handleSelectDbMed(dbMed) {
    setSelectedDbMed(dbMed)
    setSearchQuery('')
    setStep(2)
  }

  function handleSelectExistingMed(medId) {
    setMedicationId(medId)
    setSelectedDbMed(null)
    setStep(2)
  }

  function handleClose() {
    onClose()
    setStep(1)
    setMedicationId('')
    setTime('08:00')
    setSelectedDays([1, 2, 3, 4, 5, 6, 7])
    setSearchQuery('')
    setSelectedDbMed(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    let finalMedId = medicationId

    // If we selected from DB, create the medication first
    if (selectedDbMed && !medicationId) {
      if (!onAddMedication) {
        toast.error('Impossible de créer le médicament')
        return
      }
      const { data, error } = await onAddMedication({
        name: selectedDbMed.name,
        dosage: selectedDbMed.dosage || '',
        form: selectedDbMed.form || 'comprimé',
        color: CATEGORIES[selectedDbMed.category]?.color || '#10B981',
      })
      if (error) {
        toast.error('Erreur lors de la création du médicament')
        return
      }
      finalMedId = data.id
    }

    if (!finalMedId) {
      toast.error('Sélectionnez un médicament')
      return
    }
    if (selectedDays.length === 0) {
      toast.error('Sélectionnez au moins un jour')
      return
    }

    setLoading(true)
    const { error } = await onAdd({
      medication_id: finalMedId,
      scheduled_time: time,
      days_of_week: selectedDays,
    })

    if (error) {
      toast.error('Erreur lors de la création du rappel')
    } else {
      toast.success('Rappel créé !')
      handleClose()
    }
    setLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={step === 1 ? 'Choisir un médicament' : 'Configurer le rappel'}>
      {step === 1 ? (
        <div className="space-y-4">
          {/* Search from database */}
          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-1.5">Rechercher dans la base</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Doliprane, Whey, Magnésium..."
                className="w-full bg-bg-primary border border-bg-hover text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-brand-green transition"
                autoFocus
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto space-y-1 bg-bg-primary rounded-xl border border-bg-hover p-2">
                {searchResults.map((med, i) => {
                  const cat = CATEGORIES[med.category]
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectDbMed(med)}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-bg-hover transition flex items-center gap-2"
                    >
                      <span className="text-sm">{cat?.icon || '💊'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium">{med.name} {med.dosage && <span className="text-gray-400">{med.dosage}</span>}</p>
                        <p className="text-gray-500 text-[10px]">{med.form} · {cat?.label || med.category}</p>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                    </button>
                  )
                })}
              </div>
            )}
            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <p className="text-gray-500 text-xs mt-2 text-center">Aucun résultat. Ajoutez-le manuellement ci-dessous.</p>
            )}
          </div>

          {/* Or select existing */}
          {medications.length > 0 && (
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-1.5">Vos médicaments</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {medications.map(med => (
                  <button
                    key={med.id}
                    onClick={() => handleSelectExistingMed(med.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-bg-primary border border-bg-hover hover:border-brand-green/30 transition flex items-center gap-2"
                  >
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: med.color || '#10B981' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{med.name}</p>
                      <p className="text-gray-500 text-[10px]">{med.dosage}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selected medication info */}
          {selectedDbMed && (
            <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{CATEGORIES[selectedDbMed.category]?.icon || '💊'}</span>
                <p className="text-white text-sm font-semibold">{selectedDbMed.name} {selectedDbMed.dosage}</p>
              </div>
              {selectedDbMed.tip && (
                <div className="flex items-start gap-1.5 mt-1.5">
                  <Info className="w-3 h-3 text-brand-green mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300 text-[11px] leading-relaxed">{selectedDbMed.tip}</p>
                </div>
              )}
            </div>
          )}

          {/* Quick time selection */}
          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-2">Quand ?</label>
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {QUICK_TIMES.map(qt => (
                <button
                  key={qt.value}
                  type="button"
                  onClick={() => setTime(qt.value)}
                  className={`flex flex-col items-center py-2 rounded-xl text-xs transition ${
                    time === qt.value
                      ? 'bg-brand-green/20 text-brand-green border border-brand-green/30'
                      : 'bg-bg-primary text-gray-400 border border-bg-hover'
                  }`}
                >
                  <span className="text-sm mb-0.5">{qt.icon}</span>
                  <span className="font-semibold">{qt.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="flex-1 bg-bg-primary border border-bg-hover text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-green transition"
              />
            </div>
          </div>

          {/* Days */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-400 text-xs font-semibold">Jours</label>
              <button
                type="button"
                onClick={() => setSelectedDays(selectedDays.length === 7 ? [] : [1, 2, 3, 4, 5, 6, 7])}
                className="text-brand-green text-[10px] font-semibold"
              >
                {selectedDays.length === 7 ? 'Aucun' : 'Tous les jours'}
              </button>
            </div>
            <div className="flex gap-1.5">
              {DAYS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleDay(id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                    selectedDays.includes(id)
                      ? 'bg-brand-green text-white'
                      : 'bg-bg-primary text-gray-500 border border-bg-hover'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setStep(1); setSelectedDbMed(null); setMedicationId('') }}
              className="flex-1 bg-bg-primary border border-bg-hover text-gray-300 font-semibold py-3 rounded-xl transition hover:bg-bg-hover"
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 rounded-xl transition shadow-green disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
