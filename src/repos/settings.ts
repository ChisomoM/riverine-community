import { resetState, update, useDemo } from '@/data/store'
import type { Settings } from '@/data/types'

export const SettingsRepo = {
  set(patch: Partial<Settings>) {
    update((s) => ({ ...s, settings: { ...s.settings, ...patch } }))
  },
  /** Restores the seed data between demo runs. */
  reset() {
    resetState()
  },
}

export const useSettings = () => useDemo((s) => s.settings)
