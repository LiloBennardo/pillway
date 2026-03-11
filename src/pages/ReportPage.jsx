import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

function AdherenceChart({ logs }) {
  const weeklyData = useMemo(() => {
    const weeks = [0, 0, 0, 0]
    const weekTotal = [0, 0, 0, 0]

    logs.forEach(log => {
      const day = new Date(log.scheduled_at).getDate()
      const weekIndex = Math.min(Math.floor((day - 1) / 7), 3)
      weekTotal[weekIndex]++
      if (log.status === 'taken') weeks[weekIndex]++
    })

    return weeks.map((taken, i) => ({
      label: `Sem. ${i + 1}`,
      rate: weekTotal[i] > 0 ? Math.round((taken / weekTotal[i]) * 100) : 0,
    }))
  }, [logs])

  return (
    <div className="bg-bg-card rounded-2xl p-5 mb-4 border border-bg-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Taux d'observance</h3>
        <span className="text-brand-green font-bold text-sm">
          {Math.round(logs.filter(l => l.status === 'taken').length / Math.max(logs.length, 1) * 100)}%
        </span>
      </div>
      <div className="flex items-end gap-3 h-28">
        {weeklyData.map((week, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-brand-green text-xs font-bold">{week.rate}%</span>
            <div className="w-full bg-bg-hover rounded-t-lg overflow-hidden" style={{ height: 80 }}>
              <div
                className="w-full rounded-t-lg transition-all duration-700"
                style={{
                  height: `${(week.rate / 100) * 80}px`,
                  background: week.rate >= 80 ? '#10B981' : week.rate >= 50 ? '#F59E0B' : '#EF4444',
                  marginTop: `${80 - (week.rate / 100) * 80}px`,
                }}
              />
            </div>
            <span className="text-gray-500 text-xs">{week.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MedBreakdownChart({ logs }) {
  const byMed = useMemo(() => {
    const map = {}
    logs.forEach(log => {
      const name = log.medications?.name || 'Inconnu'
      if (!map[name]) map[name] = { taken: 0, total: 0, color: log.medications?.color || '#10B981' }
      map[name].total++
      if (log.status === 'taken') map[name].taken++
    })
    return Object.entries(map).map(([name, v]) => ({
      name,
      rate: Math.round((v.taken / Math.max(v.total, 1)) * 100),
      color: v.color,
      taken: v.taken,
      total: v.total,
    }))
  }, [logs])

  return (
    <div className="bg-bg-card rounded-2xl p-5 mb-4 border border-bg-hover">
      <h3 className="text-white font-semibold text-sm mb-4">Par médicament</h3>
      <div className="space-y-3">
        {byMed.map(med => (
          <div key={med.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-300 text-xs font-medium">{med.name}</span>
              <span className="text-xs font-bold" style={{ color: med.color }}>
                {med.taken}/{med.total} — {med.rate}%
              </span>
            </div>
            <div className="w-full bg-bg-hover rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${med.rate}%`, background: med.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReportPage() {
  const { user, profile } = useAuth()
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchMonthLogs()
  }, [month, year])

  async function fetchMonthLogs() {
    setLoading(true)
    const start = new Date(year, month - 1, 1).toISOString()
    const end = new Date(year, month, 0, 23, 59, 59).toISOString()

    const { data } = await supabase
      .from('medication_logs')
      .select('*, medications(name, dosage, color)')
      .eq('user_id', user.id)
      .gte('scheduled_at', start)
      .lte('scheduled_at', end)
      .order('scheduled_at')

    setLogs(data || [])
    setLoading(false)
  }

  function prevMonth() {
    const d = new Date(year, month - 2)
    setMonth(d.getMonth() + 1)
    setYear(d.getFullYear())
  }

  function nextMonth() {
    const d = new Date(year, month)
    setMonth(d.getMonth() + 1)
    setYear(d.getFullYear())
  }

  async function handleDownloadPDF() {
    const { generateMonthlyReport } = await import('../lib/generateReport')
    const doc = generateMonthlyReport(profile, logs, month, year)
    doc.save(`PillWay_Rapport_${year}_${String(month).padStart(2, '0')}.pdf`)
    toast.success('Rapport téléchargé !')
  }

  async function handleSendToDoctor() {
    if (!profile?.doctor_email) {
      toast.error('Ajoutez l\'email de votre médecin dans votre profil')
      return
    }
    setSending(true)
    try {
      await supabase.functions.invoke('send-report-email', {
        body: { month, year, doctorEmail: profile.doctor_email }
      })
      toast.success(`Rapport envoyé à ${profile.doctor_email}`)
    } catch {
      toast.error('Erreur lors de l\'envoi')
    }
    setSending(false)
  }

  const totalTaken = logs.filter(l => l.status === 'taken').length
  const totalMissed = logs.filter(l => l.status === 'missed').length
  const globalRate = logs.length > 0 ? Math.round((totalTaken / logs.length) * 100) : 0

  const monthName = format(new Date(year, month - 1), 'MMMM yyyy', { locale: fr })

  return (
    <div className="min-h-screen bg-bg-primary pb-28 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-display font-bold text-2xl">Rapport mensuel</h1>
          <p className="text-gray-400 text-sm capitalize">{monthName}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-full bg-bg-card text-gray-400 hover:text-white flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-full bg-bg-card text-gray-400 hover:text-white flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="bg-bg-card rounded-2xl h-32 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Global score ring */}
          <div className="bg-bg-card rounded-2xl p-5 mb-4 border border-bg-hover">
            <div className="flex items-center gap-5">
              <svg width="80" height="80" viewBox="0 0 80 80" className="flex-shrink-0">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#1A2D42" strokeWidth="7" />
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke={globalRate >= 80 ? '#10B981' : globalRate >= 50 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${(globalRate / 100) * 213.6} 213.6`}
                  transform="rotate(-90 40 40)"
                />
                <text x="40" y="45" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                  {globalRate}%
                </text>
              </svg>
              <div>
                <p className="text-white font-bold text-lg">Observance globale</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {totalTaken} prises sur {logs.length} prévues
                </p>
                {totalMissed > 0 && (
                  <p className="text-red-400 text-xs mt-1">
                    {totalMissed} prise{totalMissed > 1 ? 's' : ''} manquée{totalMissed > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Charts */}
          {logs.length > 0 && (
            <>
              <AdherenceChart logs={logs} />
              <MedBreakdownChart logs={logs} />
            </>
          )}

          {/* Actions */}
          <div className="space-y-3 mt-6">
            <button
              onClick={handleDownloadPDF}
              disabled={logs.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white font-bold py-4 rounded-2xl transition shadow-green disabled:opacity-40"
            >
              Télécharger le rapport PDF
            </button>
            <button
              onClick={handleSendToDoctor}
              disabled={sending || logs.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-bg-card border border-bg-hover text-white font-semibold py-4 rounded-2xl transition hover:bg-bg-hover disabled:opacity-40"
            >
              {sending ? 'Envoi...' : 'Envoyer à mon médecin'}
            </button>
          </div>

          {logs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">Aucune donnée pour ce mois</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
