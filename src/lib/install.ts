import { useCallback, useEffect, useState } from 'react'

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: InstallPromptEvent | null = null

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e as InstallPromptEvent
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
  })
}

const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true)

/**
 * Add-to-home-screen helper. `install()` resolves to 'accepted', 'dismissed',
 * or 'manual' when the browser has no prompt (iOS Safari, desktop Firefox).
 */
export function useInstall() {
  const [installed, setInstalled] = useState(isStandalone)

  useEffect(() => {
    const done = () => setInstalled(true)
    window.addEventListener('appinstalled', done)
    return () => window.removeEventListener('appinstalled', done)
  }, [])

  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | 'manual'> => {
    if (!deferred) return 'manual'
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    deferred = null
    return outcome
  }, [])

  return { installed, install }
}
