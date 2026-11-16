import { useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { CITIES, currency, nearbyPins, nightlyRate, type City, type PlaceType } from '../data/earnings'
import { useCountUp } from '../hooks/useCountUp'
import './Estimator.css'

export function Estimator() {
  const [city, setCity] = useState<City>(CITIES[0])
  const [type, setType] = useState<PlaceType>('entire')
  const [bedrooms, setBedrooms] = useState(2)
  const [nights, setNights] = useState(7)

  const nightly = nightlyRate(city, type, bedrooms)
  const total = nightly * nights
  const shownTotal = useCountUp(total, { duration: 650 })
  const pins = useMemo(() => nearbyPins(city, type, bedrooms), [city, type, bedrooms])

  return (
    <div className="estimator" id="estimate">
      <div className="estimator__panel">
        <p className="estimator__kicker">You could earn</p>
        <p className="estimator__total" aria-live="polite" aria-atomic="true">
          <span aria-hidden="true">{currency.format(Math.round(shownTotal))}</span>
          <span className="visually-hidden">{currency.format(total)}</span>
        </p>
        <p className="estimator__detail">
          <strong>{nights} {nights === 1 ? 'night' : 'nights'}</strong> at an estimated {currency.format(nightly)} a night
        </p>

        <NightsSlider value={nights} onChange={setNights} />

        <div className="estimator__controls">
          <LocationPicker value={city} onChange={setCity} />
          <div className="estimator__row">
            <Segmented
              label="Type of place"
              value={type}
              onChange={setType}
              options={[
                { value: 'entire', label: 'Entire place' },
                { value: 'room', label: 'Private room' },
              ]}
            />
            <Stepper
              label="Bedrooms"
              value={bedrooms}
              min={1}
              max={6}
              onChange={setBedrooms}
              disabled={type === 'room'}
            />
          </div>
        </div>

        <p className="estimator__note">
          Estimates use made-up rates for this concept.{' '}
          <a className="link" href="#faq">Learn how we estimate your earnings</a>
        </p>
      </div>

      <EarningsMap city={city} pins={pins} nightly={nightly} />
    </div>
  )
}

/* ---------- Nights slider ---------- */

function NightsSlider({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const min = 1
  const max = 30
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="slider">
      <label className="visually-hidden" htmlFor="nights">Nights booked per month</label>
      <input
        id="nights"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value} nights a month`}
        style={{ '--pct': `${pct}%` } as CSSProperties}
      />
      <div className="slider__scale" aria-hidden="true">
        <span>1 night</span>
        <span>30 nights</span>
      </div>
    </div>
  )
}

/* ---------- Location combobox ---------- */

function LocationPicker({ value, onChange }: { value: City; onChange: (c: City) => void }) {
  const id = useId()
  const listId = `${id}-list`
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CITIES
    return CITIES.filter((c) => `${c.name} ${c.region}`.toLowerCase().includes(q))
  }, [query])

  const select = (c: City) => {
    onChange(c)
    setQuery('')
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(results.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter' && open && results[active]) {
      e.preventDefault()
      select(results[active])
    } else if (e.key === 'Escape') {
      setQuery('')
      setOpen(false)
    }
  }

  return (
    <div className={`field location ${open ? 'is-open' : ''}`}>
      <label htmlFor={id} className="field__label">Where’s your place?</label>
      <div className="location__input-wrap">
        <svg className="location__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="9.5" r="2.5" fill="currentColor" />
        </svg>
        <input
          ref={inputRef}
          id={id}
          className="location__input"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${id}-${results[active].id}` : undefined}
          autoComplete="off"
          placeholder={`${value.name}, ${value.region}`}
          value={open ? query : `${value.name}, ${value.region}`}
          onFocus={() => { setOpen(true); setQuery(''); setActive(0) }}
          onBlur={() => setOpen(false)}
          onChange={(e) => { setQuery(e.target.value); setActive(0); setOpen(true) }}
          onKeyDown={onKeyDown}
        />
      </div>
      <ul id={listId} role="listbox" className="location__list" aria-label="Cities">
        {results.length === 0 && <li className="location__empty">No matching cities in this demo</li>}
        {results.map((c, i) => (
          <li
            key={c.id}
            id={`${id}-${c.id}`}
            role="option"
            aria-selected={c.id === value.id}
            className={`location__option ${i === active ? 'is-active' : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => setActive(i)}
            onClick={() => { select(c); inputRef.current?.blur() }}
          >
            <span className="location__pin" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
            </span>
            <span>
              <span className="location__name">{c.name}</span>
              <span className="location__region">{c.region}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- Segmented control ---------- */

type Option<T extends string> = { value: T; label: string }

function Segmented<T extends string>({ label, value, onChange, options }: {
  label: string
  value: T
  onChange: (v: T) => void
  options: Option<T>[]
}) {
  const index = options.findIndex((o) => o.value === value)
  return (
    <fieldset className="field segmented">
      <legend className="field__label">{label}</legend>
      <div className="segmented__track" style={{ '--count': options.length, '--index': index } as CSSProperties}>
        <span className="segmented__thumb" aria-hidden="true" />
        {options.map((o) => (
          <label key={o.value} className={`segmented__option ${o.value === value ? 'is-selected' : ''}`}>
            <input
              type="radio"
              name={label}
              value={o.value}
              checked={o.value === value}
              onChange={() => onChange(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/* ---------- Stepper ---------- */

function Stepper({ label, value, min, max, onChange, disabled }: {
  label: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
  disabled?: boolean
}) {
  return (
    <div className={`field stepper ${disabled ? 'is-disabled' : ''}`} role="group" aria-label={label}>
      <span className="field__label" aria-hidden="true">{label}</span>
      <div className="stepper__controls">
        <button
          type="button"
          className="stepper__btn"
          aria-label={`Fewer ${label.toLowerCase()}`}
          disabled={disabled || value <= min}
          onClick={() => onChange(value - 1)}
        >
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <output className="stepper__value" aria-live="polite">{disabled ? '–' : value}</output>
        <button
          type="button"
          className="stepper__btn"
          aria-label={`More ${label.toLowerCase()}`}
          disabled={disabled || value >= max}
          onClick={() => onChange(value + 1)}
        >
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  )
}

/* ---------- Stylised map ---------- */

function EarningsMap({ city, pins, nightly }: { city: City; pins: ReturnType<typeof nearbyPins>; nightly: number }) {
  const key = pins.map((p) => p.price).join('-')
  return (
    <div className="map" role="img" aria-label={`Map of similar listings around ${city.name}, averaging about ${currency.format(nightly)} a night`}>
      <svg className="map__base" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g style={{ transform: `rotate(${city.mapAngle}deg)`, transformOrigin: '200px 200px' }} className="map__layer">
          <rect x="-200" y="-200" width="800" height="800" fill="#f2efe9" />
          <path d="M-200 300 C 0 260, 120 340, 260 300 S 520 250, 600 280 L 600 600 L -200 600 Z" fill="#cfe3f0" />
          <rect x="40" y="60" width="90" height="70" rx="14" fill="#d8ead2" />
          <rect x="270" y="120" width="70" height="90" rx="14" fill="#d8ead2" />
          <g stroke="#ffffff" strokeLinecap="round" fill="none">
            <path d="M-200 200 H 600" strokeWidth="14" />
            <path d="M200 -200 V 600" strokeWidth="14" />
            <path d="M-200 40 L 600 380" strokeWidth="10" />
            <path d="M-100 140 H 520 M-100 260 H 520 M80 -200 V 600 M320 -200 V 600" strokeWidth="6" />
            <path d="M-100 100 H 520 M-100 340 H 520 M140 -200 V 600 M260 -200 V 600 M30 -200 V 600 M370 -200 V 600" strokeWidth="3" />
          </g>
          <g stroke="#f6d38a" strokeLinecap="round" fill="none">
            <path d="M-200 200 H 600" strokeWidth="5" />
            <path d="M200 -200 V 600" strokeWidth="5" />
          </g>
        </g>
      </svg>

      <ul className="map__pins" key={key} aria-hidden="true">
        {pins.map((p, i) => (
          <li
            key={p.id}
            className="map__pin"
            style={{ left: `${p.x}%`, top: `${p.y}%`, '--i': i } as CSSProperties}
          >
            {currency.format(p.price)}
          </li>
        ))}
      </ul>

      <div className="map__home" aria-hidden="true">
        <span className="map__home-pulse" />
        <svg viewBox="0 0 32 32" width="22" height="22">
          <path d="M6 15 16 7l10 8v10a1 1 0 0 1-1 1h-6v-6h-6v6H7a1 1 0 0 1-1-1z" fill="#fff" />
        </svg>
      </div>

      <div className="map__legend">
        <span className="map__legend-dot" aria-hidden="true" /> Your place · similar listings in {city.name}
      </div>
    </div>
  )
}
