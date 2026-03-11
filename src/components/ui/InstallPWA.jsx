import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return

    // iOS detection (no beforeinstallprompt event on iOS)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream
    if (ios) {
      // Show iOS instructions if not dismissed before
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      if (!dismissed) {
        setIsIOS(true)
        setShow(true)
      }
      return
    }

    // Chrome/Edge/Samsung - capture the install prompt
    function handler(e) {
      e.preventDefault()
      setDeferredPrompt(e)
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      if (!dismissed) setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShow(false)
    }
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    setShow(false)
    localStorage.setItem('pwa-install-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 mb-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
        <Smartphone className="w-4 h-4 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">Installer PillWay</p>
        {isIOS ? (
          <p className="text-gray-400 text-xs mt-0.5">
            Appuyez sur <span className="text-blue-400 font-semibold">Partager</span> puis <span className="text-blue-400 font-semibold">Sur l'écran d'accueil</span> pour installer l'app
          </p>
        ) : (
          <>
            <p className="text-gray-400 text-xs mt-0.5">Ajoutez PillWay sur votre écran d'accueil pour un accès rapide</p>
            <button
              onClick={handleInstall}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Installer
            </button>
          </>
        )}
      </div>
      <button onClick={handleDismiss} className="text-gray-500 hover:text-gray-300 p-0.5">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
