import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, X } from 'lucide-react'

export default function TourTooltip({ step, stepIndex, totalSteps, onNext, onPrev, onSkip }) {
  const [targetRect, setTargetRect] = useState(null)
  const tooltipRef = useRef(null)

  useEffect(() => {
    function updatePosition() {
      const el = document.querySelector(step.targetSelector)
      if (el) {
        const rect = el.getBoundingClientRect()
        setTargetRect(rect)
        // Scroll element into view
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        setTargetRect(null)
      }
    }

    // Small delay to let DOM settle
    const timer = setTimeout(updatePosition, 300)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [step.targetSelector])

  if (!targetRect) return null

  const padding = 8
  const spotlightStyle = {
    top: targetRect.top - padding,
    left: targetRect.left - padding,
    width: targetRect.width + padding * 2,
    height: targetRect.height + padding * 2,
  }

  // Calculate tooltip position
  let tooltipStyle = {}
  const tooltipWidth = 300
  const tooltipOffset = 16

  if (step.position === 'bottom') {
    tooltipStyle = {
      top: spotlightStyle.top + spotlightStyle.height + tooltipOffset,
      left: Math.max(16, Math.min(
        spotlightStyle.left + spotlightStyle.width / 2 - tooltipWidth / 2,
        window.innerWidth - tooltipWidth - 16
      )),
    }
  } else if (step.position === 'top') {
    tooltipStyle = {
      bottom: window.innerHeight - spotlightStyle.top + tooltipOffset,
      left: Math.max(16, Math.min(
        spotlightStyle.left + spotlightStyle.width / 2 - tooltipWidth / 2,
        window.innerWidth - tooltipWidth - 16
      )),
    }
  }

  return (
    <div className="fixed inset-0 z-[9999]" onClick={e => e.stopPropagation()}>
      {/* Overlay with spotlight cutout using CSS clip-path */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={spotlightStyle.left}
              y={spotlightStyle.top}
              width={spotlightStyle.width}
              height={spotlightStyle.height}
              rx="16"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0" y="0"
          width="100%" height="100%"
          fill="rgba(0,0,0,0.75)"
          mask="url(#tour-mask)"
          style={{ pointerEvents: 'all' }}
        />
      </svg>

      {/* Spotlight border glow */}
      <div
        className="absolute border-2 border-brand-green rounded-2xl pointer-events-none"
        style={{
          top: spotlightStyle.top,
          left: spotlightStyle.left,
          width: spotlightStyle.width,
          height: spotlightStyle.height,
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
        }}
      />

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          ref={tooltipRef}
          initial={{ opacity: 0, y: step.position === 'top' ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: step.position === 'top' ? 10 : -10 }}
          transition={{ duration: 0.2 }}
          className="absolute bg-bg-card border border-bg-hover rounded-2xl p-4 shadow-2xl"
          style={{ ...tooltipStyle, width: tooltipWidth }}
        >
          {/* Close button */}
          <button
            onClick={onSkip}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <p className="text-white font-semibold text-sm mb-1">{step.title}</p>
          <p className="text-gray-400 text-xs leading-relaxed mb-4">{step.description}</p>

          <div className="flex items-center justify-between">
            {/* Step counter */}
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === stepIndex ? 'bg-brand-green' : i < stepIndex ? 'bg-brand-green/40' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <button
                  onClick={onPrev}
                  className="text-gray-400 hover:text-white p-1.5 rounded-lg transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onNext}
                className="bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5"
              >
                {stepIndex === totalSteps - 1 ? 'Terminer' : 'Suivant'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
