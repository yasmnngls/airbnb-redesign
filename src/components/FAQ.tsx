import { useId, useRef, useState, type PointerEvent } from 'react'
import { Reveal } from './Reveal'
import './FAQ.css'

const FAQS = [
  {
    q: 'Is my place right for Airbnb?',
    a: 'Airbnb guests are interested in all kinds of places: spare rooms, flats, houses, cabins and more. If you have a space where guests can sleep, you can probably host.',
  },
  {
    q: 'Do I have to host all the time?',
    a: 'Not at all. You control your calendar. Host once a year, a few nights a month, or more often, whatever works for you.',
  },
  {
    q: 'How much should I interact with guests?',
    a: 'It’s up to you. Some Hosts prefer to message guests only at key moments, like a quick note when they check in. Others enjoy meeting their guests in person.',
  },
  {
    q: 'Any tips on being a great Airbnb Host?',
    a: 'Getting the basics right goes a long way. Keep your place clean, respond to guests promptly, and provide the essentials, like fresh towels. Small touches, like flowers or local tips, are optional but loved.',
  },
  {
    q: 'What are Airbnb’s fees?',
    a: 'Airbnb charges a service fee on each booking, taken as a percentage of the reservation subtotal. The rate depends on your fee structure and where you host, so check the Help Centre for current figures.',
  },
  {
    q: 'How do these earnings estimates work?',
    a: 'On this concept page, estimates are calculated from sample nightly rates for each city, place type and number of bedrooms. They are illustrative only and not a quote.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const houseRef = useRef<HTMLDivElement>(null)
  const baseId = useId()

  // The house tilts gently toward the pointer
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = houseRef.current
    if (!el || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 14).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 20).toFixed(2)}deg`)
  }
  const onPointerLeave = () => {
    houseRef.current?.style.setProperty('--rx', '0deg')
    houseRef.current?.style.setProperty('--ry', '0deg')
  }

  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div className="container faq__grid">
        <div>
          <Reveal>
            <h2 id="faq-title" className="section-title">Your questions, answered</h2>
          </Reveal>
          <div className="faq__house-wrap" aria-hidden="true">
            <div className="faq__house" ref={houseRef}>
              <IsoHouse />
            </div>
          </div>
        </div>

        <Reveal className="faq__list" delay={100}>
          {FAQS.map((item, i) => {
            const isOpen = open === i
            const btnId = `${baseId}-q${i}`
            const panelId = `${baseId}-a${i}`
            return (
              <div key={item.q} className={`faq__item ${isOpen ? 'is-open' : ''}`}>
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    className="faq__q"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <svg className="faq__chev" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={btnId} className="faq__a" inert={!isOpen}>
                  <div className="faq__a-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

/** A small isometric house with a Rausch roof */
function IsoHouse() {
  return (
    <svg viewBox="0 0 200 210" width="100%" height="100%">
      <ellipse className="faq__shadow" cx="100" cy="190" rx="78" ry="16" fill="#000" opacity="0.1" />
      {/* Front-left wall */}
      <polygon points="40,150 100,180 100,130 40,100" fill="#F7EDE3" />
      {/* Right gable wall */}
      <polygon points="100,180 160,150 160,100 130,80 100,130" fill="#E8D3BF" />
      {/* Roof */}
      <polygon points="70,50 130,80 100,130 40,100" fill="#FF385C" />
      <polygon points="70,50 130,80 132,76 72,46" fill="#E00B41" />
      {/* Window */}
      <polygon points="58,137 76,146 76,130 58,121" fill="#BFDDF0" />
      <polygon points="58,137 76,146 76,130 58,121" fill="none" stroke="#fff" strokeWidth="2" />
      {/* Door */}
      <polygon points="139,160.5 124,168 124,140 139,132.5" fill="#B88A63" />
      <circle cx="127" cy="155" r="1.4" fill="#FFE3A6" />
      {/* Round window in the gable */}
      <circle cx="130" cy="110" r="7" fill="#BFDDF0" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}
