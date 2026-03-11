import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import TourTooltip from '../components/ui/TourTooltip'

const TourContext = createContext(null)

const TOUR_STEPS = [
  {
    id: 'scan-ordonnance',
    targetSelector: '[data-tour-id="scan-ordonnance"]',
    title: 'Scanner une ordonnance',
    description: 'Prenez en photo ou importez votre ordonnance pour ajouter automatiquement vos médicaments.',
    position: 'bottom',
  },
  {
    id: 'next-med',
    targetSelector: '[data-tour-id="next-med"]',
    title: 'Prochain médicament',
    description: 'Votre prochain médicament à prendre s\'affiche ici avec un bouton pour confirmer la prise.',
    position: 'bottom',
  },
  {
    id: 'calendar',
    targetSelector: '[data-tour-id="calendar"]',
    title: 'Calendrier',
    description: 'Visualisez toutes vos prises du mois et marquez celles que vous avez prises.',
    position: 'top',
  },
  {
    id: 'nav-rappels',
    targetSelector: '[data-tour-id="nav-rappels"]',
    title: 'Vos rappels',
    description: 'Gérez tous vos rappels et ajoutez de nouveaux médicaments.',
    position: 'top',
  },
  {
    id: 'nav-profil',
    targetSelector: '[data-tour-id="nav-profil"]',
    title: 'Votre profil',
    description: 'Modifiez vos préférences, alertes et informations personnelles.',
    position: 'top',
  },
]

export function TourProvider({ children }) {
  const { updateProfile } = useAuth()
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const startTour = useCallback(() => {
    setCurrentStepIndex(0)
    setIsTourActive(true)
  }, [])

  const next = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(i => i + 1)
    } else {
      completeTour()
    }
  }, [currentStepIndex])

  const prev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1)
    }
  }, [currentStepIndex])

  const completeTour = useCallback(() => {
    setIsTourActive(false)
    setCurrentStepIndex(0)
    updateProfile({ tour_completed: true })
  }, [updateProfile])

  const skipTour = useCallback(() => {
    setIsTourActive(false)
    setCurrentStepIndex(0)
    updateProfile({ tour_completed: true })
  }, [updateProfile])

  return (
    <TourContext.Provider value={{ isTourActive, currentStepIndex, steps: TOUR_STEPS, startTour, next, prev, skipTour, completeTour }}>
      {children}
      {isTourActive && (
        <TourTooltip
          step={TOUR_STEPS[currentStepIndex]}
          stepIndex={currentStepIndex}
          totalSteps={TOUR_STEPS.length}
          onNext={next}
          onPrev={prev}
          onSkip={skipTour}
        />
      )}
    </TourContext.Provider>
  )
}

export const useTour = () => useContext(TourContext)
