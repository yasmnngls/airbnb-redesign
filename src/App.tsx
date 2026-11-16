import { useEffect } from 'react'
import { ScrollTrigger, startSmoothScroll } from './lib/motion'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { SetupStory } from './components/SetupStory'
import { Bento } from './components/Bento'
import { Stats } from './components/Stats'
import { AirCover } from './components/AirCover'
import { FAQ } from './components/FAQ'
import { ClosingCTA } from './components/ClosingCTA'
import { Footer } from './components/Footer'

export function App() {
  useEffect(() => {
    const stop = startSmoothScroll()
    // Fonts and images change the layout after first paint; re-measure pinned sections
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      stop()
      window.removeEventListener('load', refresh)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <SetupStory />
        <Bento />
        <Stats />
        <AirCover />
        <FAQ />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  )
}
