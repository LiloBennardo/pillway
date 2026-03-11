import { useEffect, useState, useCallback } from 'react'
import { useTodayLogs } from '../hooks/useReminders'
import { useAuth } from '../contexts/AuthContext'
import { useTour } from '../contexts/TourContext'
import { useNotifications } from '../hooks/useNotifications'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import { supabase } from '../lib/supabase'
import NextMedCard from '../components/home/NextMedCard'
import CollapsibleReminders from '../components/home/CollapsibleReminders'
import MiniCalendar from '../components/home/MiniCalendar'
import QuickStats from '../components/home/QuickStats'
import InteractionAlert from '../components/recommendations/InteractionAlert'
import ScanOrdonnance from '../components/home/ScanOrdonnance'
import StreakWidget from '../components/home/StreakWidget'
import InstallPWA from '../components/ui/InstallPWA'
import NotificationBanner from '../components/ui/NotificationBanner'
import TourBanner from '../components/tour/TourBanner'
import { FileText, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const { logs, loading, updateLogStatus, snoozeLog, nextMed, completionRate, refetch } = useTodayLogs()
  const { user, profile } = useAuth()
  const { startTour, isTourActive } = useTour()
  const [monthLogs, setMonthLogs] = useState([])

  // Activate medication notifications (sound + browser notif)
  useNotifications(logs)

  // Trigger guided tour for new users
  useEffect(() => {
    if (profile && !profile.tour_completed && !isTourActive) {
      const timer = setTimeout(() => startTour(), 1000)
      return () => clearTimeout(timer)
    }
  }, [profile, startTour, isTourActive])

  // Fetch month logs for mini calendar
  const fetchMonthLogs = useCallback(async () => {
    if (!user) return
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
    const { data } = await supabase
      .from('medication_logs')
      .select('id, scheduled_at, status, medications(name, dosage, color)')
      .eq('user_id', user.id)
      .gte('scheduled_at', start)
      .lte('scheduled_at', end)
    setMonthLogs(data || [])
  }, [user])

  useEffect(() => {
    fetchMonthLogs()
  }, [fetchMonthLogs])

  // Re-fetch month logs when today's logs change
  useEffect(() => {
    if (!loading) fetchMonthLogs()
  }, [logs, loading, fetchMonthLogs])

  // Pull-to-refresh
  const handlePullRefresh = useCallback(async () => {
    await refetch()
    await fetchMonthLogs()
  }, [refetch, fetchMonthLogs])

  const { refreshing, pullDistance, onTouchStart, onTouchMove, onTouchEnd } = usePullToRefresh(handlePullRefresh)

  const greeting = new Date().getHours() < 12 ? 'Bonjour'
    : new Date().getHours() < 18 ? 'Bon après-midi'
    : 'Bonsoir'

  return (
    <div
      className="min-h-screen bg-bg-primary"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="px-4 md:px-6 pt-6 max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto">

        {/* Pull-to-refresh indicator */}
        {pullDistance > 10 && (
          <div className="flex justify-center transition-all" style={{ marginTop: pullDistance - 48 }}>
            <div className={`w-8 h-8 rounded-full border-2 border-brand-green flex items-center justify-center ${refreshing ? 'animate-spin' : ''}`}>
              <RefreshCw className="w-4 h-4 text-brand-green" />
            </div>
          </div>
        )}

        {/* Greeting */}
        <div className="mb-5">
          <p className="text-gray-400 text-sm">{greeting} 👋</p>
          <h1 className="text-white font-display font-bold text-2xl lg:text-3xl">
            {profile?.full_name?.split(' ')[0] || 'Bienvenue'}
          </h1>
        </div>

        {/* Notification permission banner */}
        <NotificationBanner />

        {/* PWA Install prompt */}
        <InstallPWA />

        {/* Tour banner for new users */}
        <TourBanner />

        {/* Interaction alerts */}
        <InteractionAlert />

        {/* Desktop 2-column grid */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          {/* Left column */}
          <div>
            {/* Streak */}
            <StreakWidget />

            {/* Hero — Next medication */}
            <NextMedCard
              log={nextMed}
              onTake={(id, status) => updateLogStatus(id || nextMed?.id, status || 'taken')}
              onSnooze={snoozeLog}
            />

            {/* Scan ordonnance */}
            <ScanOrdonnance onComplete={refetch} />

            {/* Monthly report link */}
            <Link
              to="/rapport"
              className="flex items-center justify-between bg-brand-green text-white rounded-2xl px-5 py-4 mb-4 shadow-green hover:bg-brand-green-dark transition"
            >
              <div>
                <p className="font-bold text-sm">Rapport mensuel</p>
                <p className="text-xs text-green-100 mt-0.5">Envoyez le suivi à votre médecin</p>
              </div>
              <FileText className="w-5 h-5 opacity-80" />
            </Link>

            {/* Collapsible Reminders */}
            <CollapsibleReminders
              logs={logs}
              loading={loading}
              onStatusChange={updateLogStatus}
            />
          </div>

          {/* Right column */}
          <div>
            {/* Mini Calendar */}
            <MiniCalendar logs={monthLogs} />

            {/* Quick Stats */}
            <QuickStats logs={logs} />
          </div>
        </div>

      </div>
    </div>
  )
}
