import { useRef } from 'react'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import { Reveal } from './Reveal'
import './Stats.css'

const STATS = [
  { value: 5, prefix: '', suffix: 'M+', label: 'Hosts on Airbnb' },
  { value: 2, prefix: '', suffix: 'B+', label: 'guest arrivals, all time' },
  { value: 220, prefix: '', suffix: '+', label: 'countries and regions' },
  { value: 3, prefix: '$', suffix: 'M', label: 'damage protection with AirCover' },
]

export function Stats() {
  const ref = useRef<HTMLDListElement>(null)
  const inView = useInView(ref, { threshold: 0.4 })

  return (
    <section className="section stats" aria-labelledby="stats-title">
      <div className="container stats__grid">
        <Reveal as="figure" className="stats__quote">
          <blockquote>
            <p id="stats-title">“I listed my spare room to cover the mortgage. Two years later, hosting is the part of my week I look forward to most.”</p>
          </blockquote>
          <figcaption>
            <span className="stats__avatar" aria-hidden="true">L</span>
            <span><b>A Host in Lisbon</b><span>Sample story written for this concept</span></span>
          </figcaption>
        </Reveal>

        <dl className="stats__list" ref={ref}>
          {STATS.map((s, i) => (
            <Stat key={s.label} {...s} start={inView} delay={i * 120} />
          ))}
        </dl>
      </div>
      <p className="container stats__note">Figures reflect Airbnb’s public materials at the time of writing; check them before publishing.</p>
    </section>
  )
}

function Stat({ value, prefix, suffix, label, start, delay }: {
  value: number
  prefix: string
  suffix: string
  label: string
  start: boolean
  delay: number
}) {
  const shown = useCountUp(value, { enabled: start, duration: 1200 + delay })
  return (
    <div className={`stats__item ${start ? 'is-in' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <dt className="stats__label">{label}</dt>
      <dd className="stats__value">
        <span aria-hidden="true">{prefix}{Math.round(shown)}{suffix}</span>
        <span className="visually-hidden">{prefix}{value}{suffix}</span>
      </dd>
    </div>
  )
}
