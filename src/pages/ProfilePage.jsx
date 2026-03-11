import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTour } from '../contexts/TourContext'
import { User, Mail, Stethoscope, Bell, LogOut, Save, BookOpen } from 'lucide-react'
import Toggle from '../components/ui/Toggle'
import toast from 'react-hot-toast'

const PROFILS = [
  { type: 'prescription_quotidienne', icon: '💊', label: 'Prescription quotidienne', color: '#10B981' },
  { type: 'prescription_hebdomadaire', icon: '📅', label: 'Traitement en cours', color: '#3B82F6' },
  { type: 'maladie_chronique', icon: '🏥', label: 'Maladie chronique', color: '#EF4444' },
  { type: 'complement_alimentaire', icon: '💪', label: 'Compléments / Sport', color: '#F59E0B' },
  { type: 'regle_pilule', icon: '🌸', label: 'Cycle & Contraception', color: '#EC4899' },
  { type: 'objectif', icon: '🎯', label: 'Objectif bien-être', color: '#8B5CF6' },
  { type: 'senior', icon: '👴', label: 'Personne âgée / Aidant', color: '#94A3B8' },
]

export default function ProfilePage() {
  const { profile, signOut, updateProfile } = useAuth()
  const { startTour } = useTour()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [doctorEmail, setDoctorEmail] = useState(profile?.doctor_email || '')
  const [notifications, setNotifications] = useState(profile?.notifications ?? true)
  const [alertMinutes, setAlertMinutes] = useState(profile?.alert_minutes || 5)
  const [selectedProfile, setSelectedProfile] = useState(profile?.user_profile || 'prescription_quotidienne')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const { error } = await updateProfile({
      full_name: fullName,
      doctor_email: doctorEmail,
      notifications,
      alert_minutes: alertMinutes,
      user_profile: selectedProfile,
    })
    if (error) {
      toast.error('Erreur lors de la sauvegarde')
    } else {
      toast.success('Profil mis à jour !')
    }
    setSaving(false)
  }

  async function handleReplayTour() {
    await updateProfile({ tour_completed: false })
    navigate('/')
    setTimeout(() => startTour(), 500)
  }

  async function handleSignOut() {
    await signOut()
    toast.success('Déconnexion réussie')
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <div className="px-4 md:px-6 pt-6 max-w-lg md:max-w-2xl mx-auto">
        <h1 className="text-white font-display font-bold text-2xl mb-6">Mon profil</h1>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-green flex items-center justify-center text-white text-2xl font-bold">
            {(profile?.full_name || profile?.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold">{profile?.full_name || 'Utilisateur'}</p>
            <p className="text-gray-400 text-sm">{profile?.email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Profile type selector */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Mon profil de santé</label>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {PROFILS.map(p => (
                <button
                  key={p.type}
                  onClick={() => setSelectedProfile(p.type)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-sm ${
                    selectedProfile === p.type
                      ? 'border-brand-green bg-brand-green/10 text-white'
                      : 'border-bg-hover bg-bg-card text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span className="font-medium whitespace-nowrap">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-400 text-sm mb-1.5">
              <User className="w-4 h-4" /> Nom complet
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-bg-card border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-400 text-sm mb-1.5">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full bg-bg-card border border-bg-hover text-gray-500 rounded-xl px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-400 text-sm mb-1.5">
              <Stethoscope className="w-4 h-4" /> Email du médecin (pour le rapport)
            </label>
            <input
              type="email"
              value={doctorEmail}
              onChange={e => setDoctorEmail(e.target.value)}
              className="w-full bg-bg-card border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition"
              placeholder="docteur@cabinet.fr"
            />
          </div>

          <div className="bg-bg-card rounded-2xl p-4 border border-bg-hover space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-300 text-sm">
                <Bell className="w-4 h-4" /> Notifications
              </label>
              <Toggle checked={notifications} onChange={setNotifications} />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1.5">
                Alerte avant la prise (minutes)
              </label>
              <select
                value={alertMinutes}
                onChange={e => setAlertMinutes(Number(e.target.value))}
                className="w-full bg-bg-primary border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition appearance-none"
              >
                {[0, 5, 10, 15, 30].map(m => (
                  <option key={m} value={m}>{m === 0 ? 'À l\'heure exacte' : `${m} min avant`}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3.5 rounded-xl transition shadow-green disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Sauvegarder
          </button>

          {/* Replay tour */}
          <div className="bg-bg-card rounded-2xl p-4 border border-bg-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Tutoriel guidé</p>
                <p className="text-gray-500 text-xs">Redécouvrez les fonctionnalités de PillWay</p>
              </div>
            </div>
            <button
              onClick={handleReplayTour}
              className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold py-2.5 rounded-xl transition text-sm"
            >
              Relancer le tour
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full bg-bg-card hover:bg-bg-hover text-red-400 font-bold py-3.5 rounded-xl transition border border-bg-hover flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  )
}
