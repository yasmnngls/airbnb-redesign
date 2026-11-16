import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Animates from the previously shown value to `target`. Interruptible: if the
 * target changes mid-animation it continues from wherever it currently is.
 */
export function useCountUp(target: number, { duration = 700, enabled = true } = {}) {
  // Always starts at 0; counts up once `enabled` is true (e.g. when scrolled into view)
  const [value, setValue] = useState(0)
  const current = useRef(0)
  const frame = useRef(0)

  useEffect(() => {
    if (!enabled) return
    if (prefersReducedMotion()) { current.current = target; setValue(target); return }
    const from = current.current
    const start = performance.now()
    cancelAnimationFrame(frame.current)
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const v = from + (target - from) * easeOutCubic(t)
      current.current = v
      setValue(v)
      if (t < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration, enabled])

  return value
}
