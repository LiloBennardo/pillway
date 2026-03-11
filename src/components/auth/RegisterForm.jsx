import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { UserPlus, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterForm({ onSwitch }) {
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Compte créé ! Vérifiez votre email pour confirmer.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-400 text-sm mb-1.5">Nom complet</label>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
          className="w-full bg-bg-card border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition"
          placeholder="Jean Dupont"
        />
      </div>
      <div>
        <label className="block text-gray-400 text-sm mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-bg-card border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition"
          placeholder="votre@email.com"
        />
      </div>
      <div>
        <label className="block text-gray-400 text-sm mb-1.5">Mot de passe</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-bg-card border border-bg-hover text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition pr-12"
            placeholder="6 caractères minimum"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3.5 rounded-xl transition shadow-green disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Créer mon compte
          </>
        )}
      </button>
      <p className="text-center text-gray-400 text-sm">
        Déjà un compte ?{' '}
        <button type="button" onClick={onSwitch} className="text-brand-green font-semibold hover:underline">
          Se connecter
        </button>
      </p>
    </form>
  )
}
