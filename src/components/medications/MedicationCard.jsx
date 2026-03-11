import PillIcon from '../ui/PillIcon'
import { Trash2, Edit3 } from 'lucide-react'

export default function MedicationCard({ medication, onEdit, onDelete }) {
  return (
    <div className="bg-bg-card rounded-2xl p-4 border border-bg-hover">
      <div className="flex items-center gap-3">
        <PillIcon color={medication.color || '#F59E0B'} size={40} />
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{medication.name}</h3>
          <p className="text-gray-400 text-xs">
            {medication.dosage && `${medication.dosage} · `}
            {medication.form || 'Comprimé'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <button onClick={() => onEdit(medication)} className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-bg-hover transition">
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(medication.id)} className="text-gray-400 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/10 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {medication.notice_summary && (
        <p className="text-gray-400 text-xs mt-3 leading-relaxed border-t border-bg-hover pt-3">
          {medication.notice_summary}
        </p>
      )}
    </div>
  )
}
