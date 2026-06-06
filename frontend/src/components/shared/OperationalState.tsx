import { CheckCircle, Info, LockKey, SpinnerGap, WarningCircle } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type State = 'loading' | 'empty' | 'error' | 'success' | 'forbidden'

const icons: Record<State, ReactNode> = {
  loading: <SpinnerGap className="spin" aria-hidden />,
  empty: <Info aria-hidden />,
  error: <WarningCircle aria-hidden />,
  success: <CheckCircle aria-hidden />,
  forbidden: <LockKey aria-hidden />,
}

export function OperationalState({ state, title, message }: { state: State; title: string; message: string }) {
  return (
    <section className={`state-card state-${state}`} role={state === 'error' ? 'alert' : 'status'} aria-label={title} aria-live="polite">
      <span className="state-icon">{icons[state]}</span>
      <div><strong>{title}</strong><p>{message}</p></div>
    </section>
  )
}
