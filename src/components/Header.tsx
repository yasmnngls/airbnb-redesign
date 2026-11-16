import { useEffect, useState } from 'react'
import { PrimaryButton } from './PrimaryButton'
import './Header.css'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      const hero = document.getElementById('estimate')
      if (hero) setPastHero(hero.getBoundingClientRect().bottom < 80)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header__inner">
        <a href="#top" className="header__logo" aria-label="Airbnb concept, back to top">
          <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
            <path d="M5 15 16 6l11 9v11a1.5 1.5 0 0 1-1.5 1.5H19v-7h-6v7H6.5A1.5 1.5 0 0 1 5 26z" fill="currentColor" />
          </svg>
          <span className="header__wordmark">airbnb</span>
        </a>
        <nav className="header__nav" aria-label="Page sections">
          <a href="#setup">How it works</a>
          <a href="#aircover">AirCover</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className={`header__cta ${pastHero ? 'is-visible' : ''}`}>
          <span className="header__cta-label">Ready to Airbnb it?</span>
          <PrimaryButton href="#start" tabIndex={pastHero ? 0 : -1} aria-hidden={!pastHero}>
            Airbnb Setup
          </PrimaryButton>
        </div>
      </div>
    </header>
  )
}
