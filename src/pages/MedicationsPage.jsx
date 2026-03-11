import { useState, useRef, useEffect } from 'react'
import { useMedications } from '../hooks/useMedications'
import MedicationSearch from '../components/medications/MedicationSearch'
import MedicationImageScanner from '../components/medications/MedicationImageScanner'
import Modal from '../components/ui/Modal'
import { Search, ScanLine, Plus, Pill } from 'lucide-react'
import { searchMedications } from '../lib/medicationsDB'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'search', label: 'Rechercher', icon: Search },
  { id: 'scan', label: 'Scanner', icon: ScanLine },
]

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899']
const FORMS = ['comprimé', 'gélule', 'sirop', 'injection', 'patch']

export default function MedicationsPage() {
  const { addMedication } = useMedications()
  const [activeTab, setActiveTab] = useState('search')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMed, setNewMed] = useState({ name: '', dosage: '', form: 'comprimé', color: '#F59E0B', notes: '' })
  const [addLoading, setAddLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleNameChange(value) {
    setNewMed(p => ({ ...p, name: value }))
    const results = searchMedications(value)
    setSuggestions(results)
    setShowSuggestions(results.length > 0)
  }

  function selectSuggestion(med) {
    setNewMed(p => ({
      ...p,
      name: med.name,
      dosage: med.dosage || p.dosage,
      form: med.form || p.form,
    }))
    setShowSuggestions(false)
  }

  function handleMedicationFound(medData) {
    setNewMed({
      name: medData.name || '',
      dosage: medData.dosage || '',
      form: medData.form || 'comprimé',
      color: '#F59E0B',
      notes: '',
      notice_summary: medData.summary || medData.how_to_take || '',
    })
    setShowAddModal(true)
  }

  async function handleAddMedication(e) {
    e.preventDefault()
    if (!newMed.name.trim()) {
      toast.error('Nom du médicament requis')
      return
    }
    setAddLoading(true)
    const { error } = await addMedication(newMed)
    if (error) {
      toast.error('Erreur lors de l\'ajout')
    } else {
      toast.success('Médicament ajouté !')
      setShowAddModal(false)
      setNewMed({ name: '', dosage: '', form: 'comprimé', color: '#F59E0B', notes: '' })
    }
    setAddLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <div className="px-4 md:px-6 pt-6 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white font-display font-bold text-2xl">Médicaments & Notices</h1>
          <button
            onClick={() => {
              setNewMed({ name: '', dosage: '', form: 'comprimé', color: '#F59E0B', notes: '' })
              setShowAddModal(true)
            }}
            className="bg-brand-green hover:bg-brand-green-dark text-white p-2.5 rounded-xl transition shadow-green"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Onglets */}
        <div className="flex bg-bg-card rounded-2xl p-1 mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === id
                  ? 'bg-brand-green text-white shadow-green'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'search' && <MedicationSearch />}
        {activeTab === 'scan' && <MedicationImageScanner onMedicationFound={handleMedicationFound} />}

        {/* Add Medication Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Ajouter un médicament">
          <form onSubmit={handleAddMedication} className="space-y-4">
            <div className="relative" ref={suggestionsRef}>
              <label className="block text-gray-400 text-sm mb-1.5">Nom du médicament</label>
              <input
                type="text"
                value={newMed.name}
                onChange={e => handleNameChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                required
                autoComplete="off"
                className="w-full bg-bg-primary border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition"
                placeholder="Tapez pour rechercher (ex: Doliprane, Amoxicilline...)"
              />
              {showSuggestions && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-bg-card border border-bg-hover rounded-xl overflow-hidden shadow-card max-h-52 overflow-y-auto">
                  {suggestions.map((med, i) => (
                    <button
                      key={`${med.name}-${med.dosage}-${i}`}
                      type="button"
                      onClick={() => selectSuggestion(med)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-bg-hover transition border-b border-bg-hover last:border-0"
                    >
                      <Pill className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium">{med.name}</p>
                        <p className="text-gray-400 text-xs">
                          {med.dosage && `${med.dosage} · `}{med.form}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Dosage</label>
              <input
                type="text"
                value={newMed.dosage}
                onChange={e => setNewMed(p => ({ ...p, dosage: e.target.value }))}
                className="w-full bg-bg-primary border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition"
                placeholder="Ex: 500 mg"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Forme</label>
              <select
                value={newMed.form}
                onChange={e => setNewMed(p => ({ ...p, form: e.target.value }))}
                className="w-full bg-bg-primary border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition appearance-none"
              >
                {FORMS.map(f => (
                  <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Couleur</label>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewMed(p => ({ ...p, color: c }))}
                    className={`w-8 h-8 rounded-full transition-all ${
                      newMed.color === c ? 'ring-2 ring-white scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Notes (optionnel)</label>
              <textarea
                value={newMed.notes}
                onChange={e => setNewMed(p => ({ ...p, notes: e.target.value }))}
                className="w-full bg-bg-primary border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition resize-none h-20"
                placeholder="Notes personnelles..."
              />
            </div>
            <button
              type="submit"
              disabled={addLoading}
              className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3.5 rounded-xl transition shadow-green disabled:opacity-50"
            >
              {addLoading ? 'Ajout en cours...' : 'Ajouter le médicament'}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  )
}
