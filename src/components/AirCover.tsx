import { useRef, type CSSProperties } from 'react'
import { useInView } from '../hooks/useInView'
import { Reveal } from './Reveal'
import './AirCover.css'

const ROWS = [
  { title: 'Guest identity verification', body: 'We check the identity of every booking guest.' },
  { title: 'Reservation screening', body: 'Technology that helps reduce the risk of disruptive parties.' },
  { title: '$3M damage protection', body: 'Covers damage to your home and belongings caused by guests.' },
  { title: 'Art & valuables', body: 'Reimbursement for damaged art and valuables.' },
  { title: 'Auto & boat', body: 'Covers damage to cars, boats and watercraft parked or stored at your home.' },
  { title: 'Pet damage', body: 'Covers damage caused by a guest’s pet.' },
  { title: 'Income loss', body: 'Pays you back for bookings cancelled because of guest damage.' },
  { title: 'Deep cleaning', body: 'Reimbursement for extra cleaning, like removing smoke odour.' },
  { title: '$1M liability insurance', body: 'Protection if a guest gets hurt or their belongings are damaged.' },
  { title: '24-hour safety line', body: 'Reach specially trained safety agents, day or night.' },
]

export function AirCover() {
  const tableRef = useRef<HTMLTableElement>(null)
  const inView = useInView(tableRef, { threshold: 0.1 })

  return (
    <section className="section" id="aircover" aria-labelledby="aircover-title">
      <div className="container aircover">
        <Reveal className="aircover__intro">
          <p className="aircover__brand">
            <span>air</span>cover
          </p>
          <h2 id="aircover-title" className="section-title">Top-to-bottom protection. Only on Airbnb.</h2>
          <p className="section-lede">
            AirCover for Hosts is included for free every time you host. Here’s how it compares.
          </p>
        </Reveal>

        <table className={`aircover__table ${inView ? 'is-in' : ''}`} ref={tableRef}>
          <caption className="visually-hidden">What AirCover includes, compared with competitors</caption>
          <thead>
            <tr>
              <th scope="col"><span className="visually-hidden">Protection</span></th>
              <th scope="col" className="aircover__col aircover__col--us">Airbnb</th>
              <th scope="col" className="aircover__col">Competitors</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.title} style={{ transitionDelay: `${i * 70}ms` }}>
                <th scope="row">
                  <span className="aircover__title">{r.title}</span>
                  <span className="aircover__body">{r.body}</span>
                </th>
                <td className="aircover__col aircover__col--us">
                  <Check style={{ animationDelay: `${i * 70 + 250}ms` }} />
                  <span className="visually-hidden">Included</span>
                </td>
                <td className="aircover__col">
                  <Cross />
                  <span className="visually-hidden">Not included</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Check({ style }: { style?: CSSProperties }) {
  return (
    <svg className="aircover__check" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" style={style}>
      <circle cx="12" cy="12" r="11" fill="#008A05" />
      <path d="M7 12.5l3.2 3L17 8.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
    </svg>
  )
}

function Cross() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M7 7l10 10M17 7L7 17" stroke="#B0B0B0" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
