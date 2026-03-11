import { NavLink } from 'react-router-dom'
import { Home, Bell, BookOpen, User, Lightbulb, FileText, FlaskConical } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/rappels', icon: Bell, label: 'Rappels' },
  { to: '/notices', icon: BookOpen, label: 'Notices' },
  { to: '/recommandations', icon: Lightbulb, label: 'Recommandations' },
  { to: '/rapport', icon: FileText, label: 'Rapport mensuel' },
  { to: '/etude', icon: FlaskConical, label: 'Naturel vs Pharma' },
  { to: '/profil', icon: User, label: 'Profil' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-bg-card border-r border-bg-hover h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-bg-hover">
        <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#065F46" />
          <rect x="26" y="16" width="12" height="32" rx="3" fill="#10B981" />
          <rect x="16" y="26" width="32" height="12" rx="3" fill="#10B981" />
        </svg>
        <span className="text-white font-display font-bold text-xl">PillWay</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-green/10 text-brand-green'
                  : 'text-gray-400 hover:text-white hover:bg-bg-hover'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-bg-hover">
        <p className="text-gray-500 text-xs text-center">PillWay v1.0</p>
      </div>
    </aside>
  )
}
