import { useSyncExternalStore } from 'react'
import { createSeed } from './seed'
import type { DemoState } from './types'

const KEY = 'riverine.demo.v1'

function load(): DemoState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...createSeed(), ...(JSON.parse(raw) as Partial<DemoState>) }
  } catch {
    // Private mode or corrupt JSON: fall back to the seed
  }
  return createSeed()
}

let state: DemoState = load()
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage full or unavailable: the demo keeps working in memory
  }
}

export function getState(): DemoState {
  return state
}

export function update(fn: (draft: DemoState) => DemoState) {
  state = fn(state)
  persist()
  listeners.forEach((l) => l())
}

export function resetState() {
  state = createSeed()
  persist()
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

export function useDemo<T>(select: (s: DemoState) => T): T {
  return useSyncExternalStore(subscribe, () => select(state))
}
