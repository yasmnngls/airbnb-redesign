import './Footer.css'

const COLUMNS = [
  { title: 'Support', links: ['Help Centre', 'AirCover', 'Safety issues', 'Cancellation options'] },
  { title: 'Hosting', links: ['Airbnb your home', 'AirCover for Hosts', 'Hosting resources', 'Community forum'] },
  { title: 'Airbnb', links: ['Newsroom', 'Careers', 'Investors', 'Gift cards'] },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cols">
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="footer__title">{c.title}</h2>
              <ul>
                {c.links.map((l) => (
                  <li key={l}><a href="#top">{l}</a></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="footer__legal">
          Unofficial concept redesign for portfolio purposes. Not affiliated with or endorsed by Airbnb, Inc.
          Earnings figures are illustrative. Photos from Unsplash.
        </p>
      </div>
    </footer>
  )
}
