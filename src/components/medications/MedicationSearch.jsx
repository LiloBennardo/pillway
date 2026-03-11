import { useState } from 'react'
import { Search } from 'lucide-react'
import { useMedications } from '../../hooks/useMedications'
import MedicationCard from './MedicationCard'

export default function MedicationSearch() {
  const { medications, loading, deleteMedication } = useMedications()
  const [search, setSearch] = useState('')

  const filtered = medications.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un médicament..."
          className="w-full bg-bg-card border border-bg-hover text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-green transition"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-bg-card rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">
            {search ? 'Aucun résultat' : 'Aucun médicament ajouté'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(med => (
            <MedicationCard
              key={med.id}
              medication={med}
              onDelete={deleteMedication}
            />
          ))}
        </div>
      )}
    </div>
  )
}
