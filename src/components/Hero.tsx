import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { Estimator } from './Estimator'
import './Hero.css'

const HERO_IMG = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=75&auto=format'

export function Hero() {
  const mediaRef = useRef<HTMLDivElement>(null)

  // Gentle parallax: the photo drifts slower than the page as you scroll away
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !mediaRef.current) return
    const ctx = gsap.context(() => {
      gsap.to('.hero__parallax', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: mediaRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, mediaRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero__media" ref={mediaRef}>
          <div className="hero__parallax">
          <img
            className="hero__img"
            src={`${HERO_IMG}&w=1800`}
            srcSet={`${HERO_IMG}&w=800 800w, ${HERO_IMG}&w=1400 1400w, ${HERO_IMG}&w=2200 2200w`}
            sizes="(min-width: 1440px) 1280px, 100vw"
            alt="A bright living room with a grey sofa, plants and bookshelves"
            fetchPriority="high"
          />
          </div>
          <div className="hero__scrim" aria-hidden="true" />
          <div className="hero__copy">
            <h1 id="hero-title" className="hero__title">
              <span className="hero__line" style={{ animationDelay: '120ms' }}>Airbnb it.</span>
            </h1>
            <p className="hero__sub" style={{ animationDelay: '260ms' }}>
              Your home could be earning while you’re away. See what it’s worth, then let us help you set it up.
            </p>
          </div>
        </div>

        <div className="hero__estimator">
          <Estimator />
        </div>
      </div>
    </section>
  )
}
