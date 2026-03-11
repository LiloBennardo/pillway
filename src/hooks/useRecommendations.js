import { useMemo } from 'react'
import { useMedications } from './useMedications'
import { checkInteractions, getPersonalizedTips } from '../lib/interactionsDB'

export function useRecommendations() {
  const { medications } = useMedications()

  const interactions = useMemo(() => {
    if (!medications || medications.length < 2) return []
    return checkInteractions(medications).map((inter, i) => ({
      id: `inter-${i}`,
      type: 'interaction',
      severity: inter.severity,
      title: `${inter.med1} + ${inter.med2}`,
      body: inter.message,
      is_read: false,
    }))
  }, [medications])

  const tips = useMemo(() => {
    if (!medications || medications.length === 0) return []
    return getPersonalizedTips(medications).map((tip, i) => ({
      id: `tip-${i}`,
      type: 'advice',
      severity: tip.type || 'info',
      title: tip.title,
      body: tip.text,
      is_read: false,
    }))
  }, [medications])

  const recommendations = useMemo(() => {
    return [...interactions, ...tips]
  }, [interactions, tips])

  const unreadCount = recommendations.length
  const advices = tips

  return {
    recommendations,
    interactions,
    advices,
    unreadCount,
    loading: false,
    markAsRead: () => {},
  }
}
