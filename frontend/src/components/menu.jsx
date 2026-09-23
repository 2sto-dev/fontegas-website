import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

const navItems = [
  { label: 'Acasă', href: '#home' },
  { label: 'Despre noi', href: '#despre' },
  { label: 'Servicii', href: '#servicii' },
  { label: 'Avantaje', href: '#produse' },
  { label: 'Oferta', to: '/oferta' },
  { label: 'Util', to: '/util' },
  { label: 'Plan de urgență', to: '/plan-de-urgenta' },
  { label: 'Documente', to: '/documente' },
]

const pageNavItems = [{ label: navItems[0].label, to: '/' }, ...navItems.filter((item) => item.to)]

export default function Menu({ home = false, contact = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const items = home ? navItems : pageNavItems

  return (
    <header className="site-header" id={home ? 'home' : undefined}>
      <div className="top-strip">
        <div className="container top-strip__inner">
          <span>România · Județul Mehedinți · Simian, E70</span>
          <span>Tel: 0731 315 780</span>
        </div>
      </div>

      <div className="container nav-wrap">
        {home ? (
          <a href="#home" className="brand" aria-label="Pagina principală Fontegas">
            <img src="/SIGLA.jpg" alt="Logo Fontegas" />
          </a>
        ) : (
          <Link to="/" className="brand" aria-label="Pagina principală Fontegas">
            <img src="/SIGLA.jpg" alt="Logo Fontegas" />
          </Link>
        )}

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label="Deschide meniul"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label={home ? undefined : 'Meniu principal'}>
          {items.map((item) =>
            item.to ? (
              <Link key={item.label} to={item.to} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ),
          )}
        </nav>

        <Link className="contact-pill" to={contact ? '/' : '/contact'}>
          {contact ? 'Înapoi acasă' : 'Contact'}
        </Link>
      </div>
    </header>
  )
}
