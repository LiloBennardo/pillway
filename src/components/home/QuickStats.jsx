import { Check, X, Clock } from 'lucide-react'

export default function QuickStats({ logs }) {
  const taken = logs.filter(l => l.status === 'taken').length
  const missed = logs.filter(l => l.status === 'missed').length
  const pending = logs.filter(l => l.status === 'pending').length

  const stats = [
    { icon: Check, label: 'Pris', value: taken, color: 'text-brand-green', bg: 'bg-brand-green/20' },
    { icon: X, label: 'Manqués', value: missed, color: 'text-red-400', bg: 'bg-red-500/20' },
    { icon: Clock, label: 'En attente', value: pending, color: 'text-gray-400', bg: 'bg-bg-hover' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      {stats.map(({ icon: Icon, label, value, color, bg }) => (
        <div key={label} className="bg-bg-card rounded-2xl p-3 text-center border border-bg-hover">
          <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <p className="text-white font-bold text-lg">{value}</p>
          <p className="text-gray-400 text-xs">{label}</p>
        </div>
      ))}
    </div>
  )
}
