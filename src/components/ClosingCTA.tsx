import type { PointerEvent } from 'react'
import { Reveal } from './Reveal'
import './ClosingCTA.css'

export function ClosingCTA() {
  // A soft highlight follows the pointer across the panel
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--px', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--py', `${e.clientY - r.top}px`)
  }

  return (
    <section className="section cta" id="start" aria-labelledby="cta-title">
      <div className="container">
        <Reveal>
          <div className="cta__panel" onPointerMove={onPointerMove}>
            <h2 id="cta-title" className="cta__title">Ready to Airbnb it?</h2>
            <p className="cta__lede">Get set up with a Superhost for free, and start earning on your own schedule.</p>
            <div className="cta__actions">
              <a className="cta__btn" href="#top">
                Airbnb Setup
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
              <a className="cta__link" href="#estimate">See what you could earn</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
