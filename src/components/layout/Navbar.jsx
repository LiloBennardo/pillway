import { useAuth } from '../../contexts/AuthContext'
import { NavLink } from 'react-router-dom'
import { Bell, User } from 'lucide-react'

export default function Navbar() {
  const { profile } = useAuth()

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 md:hidden"
      style={{
        background: 'rgba(13,27,42,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-green-dark rounded-xl flex items-center justify-center">
          <span className="text-white font-black text-lg leading-none">+</span>
        </div>
        <span className="text-white font-display font-black text-lg">PillWay</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button
          className="w-11 h-11 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-bg-hover transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>
        <NavLink
          to="/profil"
          className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center text-white text-sm font-bold"
        >
          {(profile?.full_name || profile?.email || '?')[0].toUpperCase()}
        </NavLink>
      </div>
    </header>
  )
}
