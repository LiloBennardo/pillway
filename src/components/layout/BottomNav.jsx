import { NavLink, useLocation } from 'react-router-dom'
import { Home, Bell, BookOpen, User, Lightbulb } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Accueil', tourId: null },
  { to: '/rappels', icon: Bell, label: 'Rappels', tourId: 'nav-rappels' },
  { to: '/etude', icon: BookOpen, label: 'Santé', tourId: null },
  { to: '/recommandations', icon: Lightbulb, label: 'Infos', tourId: null },
  { to: '/profil', icon: User, label: 'Profil', tourId: 'nav-profil' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'rgba(13,27,42,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center max-w-lg mx-auto px-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label, tourId }) => {
          const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)

          return (
            <NavLink
              key={to}
              to={to}
              data-tour-id={tourId}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all"
              style={{ minHeight: '56px' }}
            >
              <div className="relative">
                <Icon
                  className="w-5 h-5 transition-all"
                  style={{ color: isActive ? '#10B981' : '#64748B' }}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-green" />
                )}
              </div>
              <span
                className="text-[10px] font-medium transition-all"
                style={{ color: isActive ? '#10B981' : '#64748B' }}
              >
                {label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
