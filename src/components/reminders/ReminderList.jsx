import ReminderItem from './ReminderItem'

export default function ReminderList({ reminders, loading, onDelete }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-bg-card rounded-2xl h-24 animate-pulse" />
        ))}
      </div>
    )
  }

  if (reminders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">Aucun rappel configuré</p>
        <p className="text-gray-600 text-xs mt-1">Ajoutez un rappel pour ne rien oublier</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reminders.map(reminder => (
        <ReminderItem
          key={reminder.id}
          reminder={reminder}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
