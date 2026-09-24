import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../App.css'

const PHONE_DISPLAY = '0731 315 780'
const PHONE_TEL = '+40731315780'

// Intrarile cu `hash` trimit spre sectiuni de pe pagina principala. Pastram
// aceleasi intrari pe toate paginile: din afara paginii principale devin
// link-uri catre "/#sectiune", iar scroll-ul se face dupa navigare.
const navItems = [
  { label: 'Acasă', hash: '#home' },
  { label: 'Despre noi', hash: '#despre' },
  { label: 'Servicii', hash: '#servicii' },
  { label: 'Avantaje', hash: '#produse' },
  { label: 'Oferta', to: '/oferta' },
  { label: 'Util', to: '/util' },
  { label: 'Plan de urgență', to: '/plan-de-urgenta' },
  { label: 'Documente', to: '/documente' },
]

// Acelasi continut in ambele variante de link (ancora pe pagina principala,
// ruta in rest).
const brandInterior = <img src="/SIGLA.jpg" alt="Logo Fontegas" />

// Un hash gol sau invalid ("#", "#2") ar face querySelector sa arunce.
const findSection = (hash) => {
  if (!hash || hash === '#') return null

  try {
    return document.querySelector(hash)
  } catch {
    return null
  }
}

export default function Menu({ home = false, contact = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const onHome = home || location.pathname === '/'

  // Escape inchide meniul mobil.
  useEffect(() => {
    if (!menuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  // Inchide meniul si la navigare cu butoanele browserului, nu doar la click.
  // Ajustam starea in timpul randarii, nu intr-un efect, ca sa evitam o
  // randare suplimentara dupa fiecare schimbare de ruta.
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setMenuOpen(false)
  }

  // Dupa fiecare navigare: la sectiunea ceruta daca exista hash, altfel in
  // capul paginii. Fara partea a doua, cine apasa "Util" din josul paginii
  // principale ajunge pe /util deja derulat la mijloc, fara sa vada titlul.
  useEffect(() => {
    const target = findSection(location.hash)

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    window.scrollTo({ top: 0, left: 0 })
  }, [location.pathname, location.hash])

  // Pe pagina principala derulam direct; href-ul ramane pentru click cu rotita,
  // copierea link-ului si navigarea fara JS.
  const handleHashClick = (event, hash) => {
    setMenuOpen(false)

    const target = findSection(hash)
    if (!target) return

    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', hash)
  }

  return (
    <header className="site-header" id={onHome ? 'home' : undefined}>
      <div className="top-strip">
        <div className="container top-strip__inner">
          <span>România · Județul Mehedinți · Simian, E70</span>
          <a href={`tel:${PHONE_TEL}`}>Tel: {PHONE_DISPLAY}</a>
        </div>
      </div>

      <div className="container nav-wrap">
        {onHome ? (
          <a
            href="#home"
            className="brand"
            aria-label="Pagina principală Fontegas"
            onClick={(event) => handleHashClick(event, '#home')}
          >
            {brandInterior}
          </a>
        ) : (
          <Link to="/" className="brand" aria-label="Pagina principală Fontegas">
            {brandInterior}
          </Link>
        )}

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? 'Închide meniul' : 'Deschide meniul'}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="main-nav"
          className={`main-nav ${menuOpen ? 'is-open' : ''}`}
          aria-label="Meniu principal"
        >
          {navItems.map((item) => {
            if (item.hash) {
              return onHome ? (
                <a
                  key={item.label}
                  href={item.hash}
                  onClick={(event) => handleHashClick(event, item.hash)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={`/${item.hash}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            }

            return (
              <Link
                key={item.label}
                to={item.to}
                aria-current={location.pathname === item.to ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Link
          className="contact-pill"
          to={contact ? '/' : '/contact'}
          aria-current={!contact && location.pathname === '/contact' ? 'page' : undefined}
        >
          {contact ? 'Înapoi acasă' : 'Contact'}
        </Link>
      </div>
    </header>
  )
}
