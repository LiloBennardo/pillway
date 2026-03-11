import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { generateMonthlyReport } from '../../lib/generateReport'
import { Download, Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MonthReport() {
  const { user, profile } = useAuth()
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)

  async function fetchMonthLogs() {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const { data } = await supabase
      .from('medication_logs')
      .select('*, medications(id, name, dosage, color)')
      .eq('user_id', user.id)
      .gte('scheduled_at', startDate.toISOString())
      .lte('scheduled_at', endDate.toISOString())
      .order('scheduled_at', { ascending: true })

    return data || []
  }

  async function handleDownload() {
    setLoading(true)
    try {
      const logs = await fetchMonthLogs()
      if (logs.length === 0) {
        toast.error('Aucune donnée pour ce mois')
        setLoading(false)
        return
      }
      const doc = generateMonthlyReport(profile, logs, month, year)
      doc.save(`PillWay_Rapport_${month}_${year}.pdf`)
      toast.success('Rapport téléchargé !')
    } catch (err) {
      toast.error('Erreur lors de la génération du rapport')
      console.error(err)
    }
    setLoading(false)
  }

  async function handleSendToDoctor() {
    if (!profile?.doctor_email) {
      toast.error('Ajoutez l\'email de votre médecin dans votre profil')
      return
    }
    setLoading(true)
    try {
      const logs = await fetchMonthLogs()
      if (logs.length === 0) {
        toast.error('Aucune donnée pour ce mois')
        setLoading(false)
        return
      }

      await supabase.functions.invoke('send-report-email', {
        body: {
          doctorEmail: profile.doctor_email,
          patientName: profile.full_name || profile.email,
          month,
          year,
          logs,
        }
      })
      toast.success(`Rapport envoyé à ${profile.doctor_email}`)
    } catch (err) {
      toast.error('Erreur lors de l\'envoi')
      console.error(err)
    }
    setLoading(false)
  }

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-400 text-sm mb-1.5">Mois</label>
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="w-full bg-bg-card border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition appearance-none"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1.5">Année</label>
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="w-full bg-bg-card border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition appearance-none"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownload}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3.5 rounded-xl transition shadow-green disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Télécharger PDF
        </button>
        <button
          onClick={handleSendToDoctor}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-bg-card hover:bg-bg-hover text-white font-bold py-3.5 rounded-xl transition border border-bg-hover disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Envoyer au médecin
        </button>
      </div>
    </div>
  )
}
