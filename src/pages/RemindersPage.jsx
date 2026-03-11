import { useState } from 'react'
import { useReminders } from '../hooks/useReminders'
import { useMedications } from '../hooks/useMedications'
import ReminderList from '../components/reminders/ReminderList'
import AddMedicationReminderModal from '../components/reminders/AddMedicationReminderModal'
import WaterReminderCard from '../components/reminders/WaterReminderCard'
import { Plus, Bell, Info } from 'lucide-react'

export default function RemindersPage() {
  const { reminders, loading, addReminder, deleteReminder, refetch: refetchReminders } = useReminders()
  const { medications, refetch: refetchMeds } = useMedications()
  const [showAdd, setShowAdd] = useState(false)

  function handleCreated() {
    setShowAdd(false)
    refetchReminders?.()
    refetchMeds?.()
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white font-display font-bold text-2xl">Mes rappels</h1>
            <p className="text-gray-400 text-xs mt-0.5">
              {reminders.length > 0
                ? `${reminders.length} rappel${reminders.length > 1 ? 's' : ''} actif${reminders.length > 1 ? 's' : ''}`
                : 'Aucun rappel configuré'}
            </p>
          </div>
        </div>

        {/* Guide for empty state */}
        {reminders.length === 0 && !loading && (
          <div className="bg-bg-card border border-bg-hover rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5 text-brand-green" />
              <h2 className="text-white font-semibold text-sm">Comment ça marche ?</h2>
            </div>
            <div className="space-y-2.5">
              {[
                { step: '1', text: 'Appuyez sur + pour ajouter un médicament et son rappel' },
                { step: '2', text: 'Cherchez votre médicament dans notre base (120+ références)' },
                { step: '3', text: 'Choisissez l\'heure et les jours de prise' },
                { step: '4', text: 'Recevez une notification au bon moment' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-green/20 text-brand-green text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {step}
                  </div>
                  <p className="text-gray-300 text-xs">{text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 rounded-xl transition shadow-green mt-4"
            >
              Ajouter mon premier médicament
            </button>
          </div>
        )}

        {/* Water reminder */}
        <WaterReminderCard />

        {/* Tips banner */}
        {reminders.length > 0 && reminders.length < 3 && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-4 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300 text-[11px] leading-relaxed">
              Pensez à ajouter tous vos médicaments pour que PillWay détecte les <span className="text-blue-400 font-semibold">interactions</span> entre eux.
            </p>
          </div>
        )}

        <ReminderList
          reminders={reminders}
          loading={loading}
          onDelete={deleteReminder}
        />
      </div>

      {/* FAB — floating add button */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-brand-green hover:bg-brand-green-dark text-white rounded-full flex items-center justify-center shadow-green transition-all active:scale-95 md:bottom-6"
        aria-label="Ajouter un médicament"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* All-in-one Add Medication + Reminder Modal */}
      {showAdd && (
        <AddMedicationReminderModal
          onClose={() => setShowAdd(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
