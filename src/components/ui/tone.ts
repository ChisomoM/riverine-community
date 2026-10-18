export type Tone = 'surface' | 'clay' | 'blue' | 'olive' | 'sand' | 'rose' | 'ok' | 'bad' | 'warn'

export const toneClass: Record<Tone, string> = {
  surface: 'bg-surface-2 text-ink',
  clay: 'bg-clay-bg text-clay-fg',
  blue: 'bg-blue-bg text-blue-fg',
  olive: 'bg-olive-bg text-olive-fg',
  sand: 'bg-sand-bg text-sand-fg',
  rose: 'bg-rose-bg text-rose-fg',
  ok: 'bg-ok-bg text-ok-fg',
  bad: 'bg-bad-bg text-bad-fg',
  warn: 'bg-warn-bg text-warn-fg',
}

