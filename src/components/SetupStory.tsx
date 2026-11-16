import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import './SetupStory.css'

const STEPS = [
  {
    title: 'Start with the space you have',
    body: 'A spare room, a whole flat, or a place that’s empty half the year. If guests can sleep there, it can earn.',
  },
  {
    title: 'Set it up with a Superhost',
    body: 'Airbnb Setup pairs you with an experienced Host who walks you through furnishing, pricing and house rules.',
  },
  {
    title: 'Make it photo-ready',
    body: 'Great photos are the first thing guests see. We’ll show you which shots matter and how to take them.',
  },
  {
    title: 'Go live in minutes',
    body: 'Your listing comes together as you go: title, amenities and a starting price based on places like yours.',
  },
  {
    title: 'Welcome your first guest',
    body: 'New Hosts can choose an experienced guest for their first booking, so you start with someone who knows the ropes.',
  },
]

export function SetupStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [isStatic, setIsStatic] = useState(false)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) { setIsStatic(true); return }
    const section = sectionRef.current!
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out', duration: 0.5 },
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 4}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))
            if (i !== activeRef.current) { activeRef.current = i; setActive(i) }
            section.style.setProperty('--story-progress', String(self.progress))
          },
        },
      })

      // 1 · Boxes leave, furniture arrives, Superhost tip appears
      tl.to('.s-boxes', { opacity: 0, y: 20, duration: 0.3 }, 1.0)
        .fromTo('.s-furn', { opacity: 0, y: -40 }, { opacity: 1, y: 0, stagger: 0.09 }, 1.15)
        .fromTo('.story__tip', { opacity: 0, y: 16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.35 }, 1.5)
        .to('.story__tip', { opacity: 0, y: -12, duration: 0.25 }, 2.0)

      // 2 · Viewfinder, flash, photos ready
      tl.fromTo('.story__viewfinder', { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.3 }, 2.1)
        .fromTo('.story__flash', { opacity: 0 }, { opacity: 0.9, duration: 0.06, ease: 'none' }, 2.45)
        .to('.story__flash', { opacity: 0, duration: 0.3 }, 2.51)
        .to('.story__viewfinder', { opacity: 0, duration: 0.2 }, 2.6)
        .fromTo('.story__photos', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3 }, 2.6)

      // 3 · Listing card slides up, gets published
      tl.to('.story__photos', { opacity: 0, y: 12, duration: 0.2 }, 3.05)
        .fromTo('.story__listing', { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 0.5 }, 3.1)
        .fromTo('.story__live', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(2)' }, 3.55)

      // 4 · Evening falls, the lamp comes on, a booking arrives
      tl.to('.s-sky', { attr: { fill: '#F4B98F' }, duration: 0.5 }, 4.05)
        .to('.s-sun', { attr: { cy: 205 }, duration: 0.5 }, 4.05)
        .to('.s-sunpatch', { opacity: 0, duration: 0.4 }, 4.05)
        .to('.s-dusk', { opacity: 0.18, duration: 0.5 }, 4.05)
        .to('.s-glow', { opacity: 1, duration: 0.3 }, 4.3)
        .fromTo('.story__toast', { opacity: 0, y: -20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.3 }, 4.35)

      // Hold the final frame for the rest of the scroll
      tl.to({}, { duration: 0.4 }, 4.6)
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`story ${isStatic ? 'is-static' : ''}`}
      id="setup"
      aria-labelledby="story-title"
    >
      <div className="container story__intro">
        <p className="eyebrow">Airbnb Setup</p>
        <h2 id="story-title" className="section-title">From empty room to first booking</h2>
        <p className="section-lede">Scroll through what setting up looks like. Most Hosts go from idea to live listing in an afternoon.</p>
      </div>

      <div className="story__pin" ref={pinRef}>
        <div className="container story__grid">
          <div className="story__steps-wrap">
          <span className="story__rail" aria-hidden="true"><span className="story__rail-fill" /></span>
          <ol className="story__steps">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className={`story__step ${i === active ? 'is-active' : ''} ${i < active ? 'is-done' : ''}`}
                aria-current={!isStatic && i === active ? 'step' : undefined}
              >
                <span className="story__num" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="story__step-title">{s.title}</h3>
                  <p className="story__step-body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          </div>

          <div className="story__stage" aria-hidden="true">
            <RoomScene />

            <div className="story__tip">
              <span className="story__avatar">SH</span>
              <span>
                <strong>Superhost tip</strong>
                <span>Add a reading lamp. Guests love a cosy corner.</span>
              </span>
            </div>

            <div className="story__viewfinder">
              <i /><i /><i /><i />
              <span className="story__focus" />
            </div>
            <div className="story__flash" />

            <div className="story__photos">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 8h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
              <span><strong>24 photos</strong> ready for your listing</span>
            </div>

            <div className="story__listing">
              <div className="story__listing-thumb">
                <span className="story__live"><i /> Live</span>
              </div>
              <div className="story__listing-body">
                <div className="story__listing-row">
                  <strong>Sunny flat by the river</strong>
                  <span>★ New</span>
                </div>
                <span className="story__muted">Entire place · 2 bedrooms</span>
                <span><strong>$151</strong> night</span>
              </div>
            </div>

            <div className="story__toast">
              <span className="story__toast-icon">
                <svg viewBox="0 0 24 24" width="18" height="18"><rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="#fff" strokeWidth="2" /><path d="M4 10h16M9 3v4M15 3v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
              </span>
              <span className="story__toast-text">
                <strong>New reservation</strong>
                <span>Dec 12 – 15 · 2 guests</span>
              </span>
              <span className="story__toast-amount">+$453</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** The room, drawn in layers so each part can animate on its own. */
function RoomScene() {
  return (
    <svg className="story__scene" viewBox="0 0 600 450" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="lampGlow">
          <stop offset="0%" stopColor="#FFE3A6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFE3A6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Room shell */}
      <rect width="600" height="320" fill="#F3EEE8" />
      <rect y="320" width="600" height="130" fill="#E5D8C6" />
      <g stroke="#DACAB4" strokeWidth="2">
        <path d="M0 352H600M0 392H600M0 432H600" />
      </g>
      <rect y="313" width="600" height="8" fill="#FFFFFF" opacity="0.85" />

      {/* Window */}
      <rect x="400" y="60" width="150" height="170" rx="6" fill="#FFFFFF" />
      <rect className="s-sky" x="410" y="70" width="130" height="150" fill="#CFE5F3" />
      <svg x="410" y="70" width="130" height="150" overflow="hidden">
        <circle className="s-sun" cx="100" cy="35" r="14" fill="#FFE6A8" />
      </svg>
      <rect x="473" y="70" width="4" height="150" fill="#FFFFFF" />
      <rect x="410" y="143" width="130" height="4" fill="#FFFFFF" />
      <rect x="392" y="228" width="166" height="8" rx="3" fill="#FFFFFF" />
      <polygon className="s-sunpatch" points="380,322 560,322 610,450 410,450" fill="#FFFFFF" opacity="0.28" />

      {/* Rug */}
      <ellipse className="s-furn" cx="250" cy="408" rx="205" ry="30" fill="#EBCDB9" />

      {/* Wall art */}
      <g className="s-furn">
        <rect x="128" y="104" width="92" height="112" rx="4" fill="#FFFFFF" />
        <rect x="136" y="112" width="76" height="96" fill="#F4C7B3" />
        <circle cx="174" cy="150" r="20" fill="#E8836B" />
        <rect x="136" y="178" width="76" height="30" fill="#EFB59D" />
      </g>
      <g className="s-furn">
        <rect x="236" y="128" width="72" height="72" rx="4" fill="#FFFFFF" />
        <rect x="243" y="135" width="58" height="58" fill="#B9D3C3" />
        <path d="M243 180 Q 272 150 301 175 V193 H243 Z" fill="#8FB59E" />
      </g>

      {/* Floor lamp */}
      <g className="s-furn">
        <ellipse cx="46" cy="396" rx="22" ry="5" fill="#3D3D3D" />
        <rect x="44" y="232" width="4" height="164" fill="#3D3D3D" />
        <path d="M20 234 H72 L62 196 H30 Z" fill="#F6E7C8" />
      </g>

      {/* Sofa */}
      <g className="s-furn">
        <rect x="104" y="250" width="272" height="72" rx="18" fill="#9AA6B2" />
        <rect x="88" y="298" width="304" height="62" rx="14" fill="#8E9AA6" />
        <rect x="76" y="278" width="42" height="84" rx="14" fill="#86929E" />
        <rect x="362" y="278" width="42" height="84" rx="14" fill="#86929E" />
        <rect x="118" y="298" width="120" height="26" rx="10" fill="#A5B0BB" />
        <rect x="242" y="298" width="120" height="26" rx="10" fill="#A5B0BB" />
        <rect x="128" y="264" width="52" height="40" rx="10" fill="#F28B82" />
        <rect x="300" y="266" width="50" height="38" rx="10" fill="#F3E3C3" />
        <rect x="108" y="360" width="8" height="14" fill="#6B5A48" />
        <rect x="364" y="360" width="8" height="14" fill="#6B5A48" />
      </g>

      {/* Plant */}
      <g className="s-furn">
        <ellipse cx="478" cy="292" rx="12" ry="36" fill="#6E9C72" transform="rotate(-24 478 292)" />
        <ellipse cx="508" cy="284" rx="12" ry="40" fill="#85B08A" transform="rotate(16 508 284)" />
        <ellipse cx="494" cy="304" rx="10" ry="30" fill="#5E8C63" />
        <path d="M470 330 H520 L512 386 H478 Z" fill="#D9A27E" />
      </g>

      {/* Coffee table */}
      <g className="s-furn">
        <rect x="200" y="362" width="14" height="16" rx="3" fill="#FFFFFF" />
        <rect x="180" y="377" width="132" height="10" rx="5" fill="#C79A6B" />
        <rect x="192" y="386" width="6" height="24" fill="#A87D52" />
        <rect x="294" y="386" width="6" height="24" fill="#A87D52" />
      </g>

      {/* Moving boxes: only in the empty room */}
      <g className="s-boxes">
        <rect x="170" y="292" width="100" height="80" rx="3" fill="#D8B88A" />
        <rect x="170" y="292" width="100" height="9" fill="#C9A574" />
        <rect x="186" y="258" width="62" height="36" rx="3" fill="#E2C59C" />
        <rect x="211" y="258" width="12" height="36" fill="#CDAA7B" />
        <rect x="258" y="322" width="82" height="54" rx="3" fill="#CFAE80" />
        <rect x="292" y="322" width="14" height="54" fill="#BF9C6C" />
      </g>

      {/* Evening */}
      <rect className="s-dusk" width="600" height="450" fill="#3A2A4A" opacity="0" />
      <circle className="s-glow" cx="46" cy="230" r="120" fill="url(#lampGlow)" opacity="0" />
    </svg>
  )
}
