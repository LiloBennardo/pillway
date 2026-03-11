import { useState, useEffect } from 'react'

export function useKeyboardAware() {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    if (!window.visualViewport) return

    function onResize() {
      const viewportHeight = window.visualViewport.height
      const windowHeight = window.innerHeight
      const diff = windowHeight - viewportHeight

      if (diff > 100) {
        setKeyboardOpen(true)
        setKeyboardHeight(diff)
      } else {
        setKeyboardOpen(false)
        setKeyboardHeight(0)
      }
    }

    window.visualViewport.addEventListener('resize', onResize)
    return () => window.visualViewport.removeEventListener('resize', onResize)
  }, [])

  return { keyboardOpen, keyboardHeight }
}
