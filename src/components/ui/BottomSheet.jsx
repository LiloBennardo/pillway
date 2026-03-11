import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'

export default function BottomSheet({ open, onClose, children, title }) {
  const constraintsRef = useRef(null)
  const dragControls = useDragControls()

  useEffect(() => {
    if (!open) return
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          <motion.div
            key="sheet"
            ref={constraintsRef}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 400) onClose()
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg-card rounded-t-3xl max-h-[92vh] flex flex-col"
            style={{
              boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            <div
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 bg-bg-hover rounded-full" />
            </div>

            {title && (
              <div className="px-5 pb-3 border-b border-bg-hover">
                <h2 className="text-white font-bold text-lg">{title}</h2>
              </div>
            )}

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
