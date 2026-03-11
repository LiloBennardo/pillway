import PillIcon from '../ui/PillIcon'
import { Trash2, Clock } from 'lucide-react'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export default function ReminderItem({ reminder, onDelete }) {
  const med = reminder.medications

  return (
    <div className="bg-bg-card rounded-2xl p-4 border border-bg-hover">
      <div className="flex items-center gap-3">
        <PillIcon color={med?.color || '#F59E0B'} size={36} />
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{med?.name || 'Médicament'}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="w-3 h-3 text-brand-green" />
            <span className="text-brand-green text-xs font-medium">{reminder.scheduled_time?.slice(0, 5)}</span>
          </div>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(reminder.id)}
            className="text-gray-400 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/10 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-1 mt-3">
        {DAYS.map((day, i) => {
          const isActive = reminder.days_of_week?.includes(i + 1)
          return (
            <span
              key={day}
              className={`text-xs px-2 py-1 rounded-lg font-medium ${
                isActive
                  ? 'bg-brand-green/20 text-brand-green'
                  : 'bg-bg-hover text-gray-500'
              }`}
            >
              {day}
            </span>
          )
        })}
      </div>
    </div>
  )
}
