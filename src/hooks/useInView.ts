import { useEffect, useState, type RefObject } from 'react'

/** True once the element has scrolled into view (and stays true). */
export function useInView(ref: RefObject<Element | null>, { threshold = 0.2, rootMargin = '0px 0px -10% 0px' } = {}) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    if (!('IntersectionObserver' in window)) { setInView(true); return }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); io.disconnect() }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, rootMargin, inView])
  return inView
}
