import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Smooth scrolling (Lenis) driven by GSAP's ticker, so ScrollTrigger and Lenis
 * share one clock. Skipped entirely for people who prefer reduced motion.
 */
export function startSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {}

  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  // In-page anchor links scroll through Lenis, offset for the sticky header
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href')!
    if (id.length < 2) return
    const el = document.querySelector(id)
    if (!el) return
    e.preventDefault()
    lenis.scrollTo(el as HTMLElement, { offset: -80 })
  }
  document.addEventListener('click', onClick)

  return () => {
    document.removeEventListener('click', onClick)
    gsap.ticker.remove(tick)
    lenis.destroy()
  }
}
