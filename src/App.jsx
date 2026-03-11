import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { TourProvider } from './contexts/TourContext'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import RemindersPage from './pages/RemindersPage'
import MedicationsPage from './pages/MedicationsPage'
import RecommendationsPage from './pages/RecommendationsPage'
import ReportPage from './pages/ReportPage'
import StudyPage from './pages/StudyPage'
import ProfilePage from './pages/ProfilePage'
import PricingPage from './pages/PricingPage'
import OnboardingPage from './pages/OnboardingPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary">
        <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function OnboardingGuard({ children }) {
  const { profile } = useAuth()
  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />
  }
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <OnboardingGuard>
              <Layout />
            </OnboardingGuard>
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="rappels" element={<RemindersPage />} />
        <Route path="notices" element={<MedicationsPage />} />
        <Route path="recommandations" element={<RecommendationsPage />} />
        <Route path="rapport" element={<ReportPage />} />
        <Route path="etude" element={<StudyPage />} />
        <Route path="profil" element={<ProfilePage />} />
        <Route path="abonnement" element={<PricingPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TourProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1A2D42',
                color: '#fff',
                borderRadius: '16px',
                border: '1px solid #243B55',
              },
            }}
          />
          <AppRoutes />
        </TourProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
