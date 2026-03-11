import { useAuth } from '../contexts/AuthContext'

export function useProfileMode() {
  const { profile } = useAuth()
  const isSenior = profile?.user_profile === 'senior'

  return {
    isSenior,
    textSize: isSenior ? 'text-lg' : 'text-sm',
    titleSize: isSenior ? 'text-3xl' : 'text-2xl',
    cardPadding: isSenior ? 'p-6' : 'p-4',
    buttonSize: isSenior ? 'py-5 text-lg' : 'py-3.5 text-sm',
    showSimplified: isSenior,
  }
}
