import type { CSSProperties } from 'react'
import { Reveal } from './Reveal'
import './Bento.css'

const BOOKED = [2, 3, 4, 8, 9, 12, 13, 14, 15, 18, 19, 20, 23, 24, 25, 26]
const BARS = [42, 58, 51, 74, 66, 92]
const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const COHOSTS = [
  { initial: 'M', color: '#E8836B', rating: '4.97', homes: 'Hosting 12 homes' },
  { initial: 'J', color: '#6E9C72', rating: '4.92', homes: 'Hosting 8 homes' },
  { initial: 'R', color: '#7C8CB0', rating: '4.99', homes: 'Hosting 21 homes' },
]

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export function Bento() {
  return (
    <section className="section" aria-labelledby="bento-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Hosting, made easier</p>
          <h2 id="bento-title" className="section-title">Everything you need, from day one</h2>
        </Reveal>

        <div className="bento">
          <Reveal as="article" className="bento__tile bento__tile--wide">
            <div className="bento__copy">
              <h3>One-to-one guidance from a Superhost</h3>
              <p>Get matched with an experienced Host who’s done it all before, for free.</p>
            </div>
            <div className="chat" aria-hidden="true">
              <div className="chat__msg chat__msg--them anim" style={delay(200)}>
                <span className="chat__avatar">A</span>
                <p>Hi! I’ve hosted for six years. Want to start with pricing?</p>
              </div>
              <div className="chat__msg chat__msg--me anim" style={delay(1000)}>
                <p>Yes please. I’ve never done this before!</p>
              </div>
              <div className="chat__msg chat__msg--them anim" style={delay(1800)}>
                <span className="chat__avatar">A</span>
                <p>No problem. Places like yours book best at around $150 a night.</p>
              </div>
              <div className="chat__typing anim" style={delay(2600)}>
                <span /><span /><span />
              </div>
            </div>
          </Reveal>

          <Reveal as="article" className="bento__tile" delay={80}>
            <div className="bento__copy">
              <h3>A listing that writes itself</h3>
              <p>Answer a few questions and your listing comes together as you go.</p>
            </div>
            <div className="draft" aria-hidden="true">
              <div className="draft__img" />
              <div className="draft__line" style={{ '--w': '80%', '--d': '600ms' } as CSSProperties}><span>Sunny flat by the river</span></div>
              <div className="draft__line" style={{ '--w': '62%', '--d': '900ms' } as CSSProperties}><span>Wifi · Kitchen · Workspace</span></div>
              <div className="draft__line" style={{ '--w': '40%', '--d': '1200ms' } as CSSProperties}><span><b>$151</b> night</span></div>
            </div>
          </Reveal>

          <Reveal as="article" className="bento__tile">
            <div className="bento__copy">
              <h3>Host on your schedule</h3>
              <p>Block nights, set minimum stays, and change your mind any time.</p>
            </div>
            <div className="cal" aria-hidden="true">
              <div className="cal__head"><b>December</b><span>{BOOKED.length} nights booked</span></div>
              <div className="cal__grid">
                {Array.from({ length: 28 }, (_, i) => {
                  const order = BOOKED.indexOf(i)
                  return (
                    <span key={i} className={order >= 0 ? 'is-booked' : ''} style={order >= 0 ? delay(300 + order * 60) : undefined}>
                      {i + 1}
                    </span>
                  )
                })}
              </div>
            </div>
          </Reveal>

          <Reveal as="article" className="bento__tile" delay={80}>
            <div className="bento__copy">
              <h3>Find a co-host nearby</h3>
              <p>Hire a local co-host to handle check-ins, cleaning and messages.</p>
            </div>
            <ul className="cohosts" aria-hidden="true">
              {COHOSTS.map((h, k) => (
                <li key={h.initial} className="anim" style={delay(300 + k * 160)}>
                  <span className="cohosts__avatar" style={{ background: h.color }}>{h.initial}</span>
                  <span className="cohosts__meta"><b>★ {h.rating}</b><span>{h.homes}</span></span>
                  {k === 0 && <span className="cohosts__badge"><i /> Available</span>}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="article" className="bento__tile" delay={160}>
            <div className="bento__copy">
              <h3>Get paid, reliably</h3>
              <p>Payouts are typically sent about 24 hours after your guest checks in.</p>
            </div>
            <div className="payouts" aria-hidden="true">
              <div className="payouts__total"><b>+$2,140</b><span>this month</span></div>
              <div className="payouts__bars">
                {BARS.map((h, k) => (
                  <div key={MONTHS[k]} className="payouts__col">
                    <span className="payouts__bar" style={{ '--h': `${h}%`, '--d': `${300 + k * 90}ms` } as CSSProperties} />
                    <span className="payouts__label">{MONTHS[k]}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
