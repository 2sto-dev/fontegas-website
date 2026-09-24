import { Link, useLocation } from 'react-router-dom'
import Menu from '../components/menu.jsx'
import '../App.css'
import { useSeo } from '../seo.js'

// Legaturile utile de pe pagina de eroare: cineva care a nimerit gresit are
// nevoie de o cale inapoi, nu doar de un mesaj.
const scurtaturi = [
  { eticheta: 'Oferta', to: '/oferta' },
  { eticheta: 'Util', to: '/util' },
  { eticheta: 'Plan de urgență', to: '/plan-de-urgenta' },
  { eticheta: 'Documente', to: '/documente' },
  { eticheta: 'Contact', to: '/contact' },
]

function NotFoundPage() {
  useSeo({
    titlu: 'Pagina nu există | Fontegas',
    descriere:
      'Adresa căutată nu duce nicăieri pe acest site.',
    indexabil: false,
  })

  const location = useLocation()

  return (
    <div className="site-shell">
      <Menu />

      <a
        className="whatsapp-float"
        href="https://wa.me/40731315780?text=Salut%20v%C4%83%20scriu%20din%20site-ul%20dvs.%20%C8%99i%20a%C8%99%20dori%20mai%20multe%20informa%C8%9Bii."
        target="_blank"
        rel="noreferrer"
        aria-label="Deschide conversația WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.48 0 .12 5.37.12 11.95c0 2.1.55 4.15 1.6 5.96L0 24l6.35-1.67a11.94 11.94 0 0 0 5.7 1.71h.01c6.58 0 11.94-5.37 11.94-11.95 0-3.2-1.25-6.22-3.48-8.61ZM12.06 21.8h-.01a9.89 9.89 0 0 1-5.05-1.39l-.36-.21-3.77.99 1-3.67-.24-.38a9.87 9.87 0 1 1 18.22-5.24 9.9 9.9 0 0 1-9.79 9.9Zm5.42-7.38c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.19.29-.75.95-.92 1.14-.17.19-.34.21-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.2-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.66-1.58-.9-2.17-.24-.58-.48-.5-.66-.51l-.56-.01c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.02 2.81 1.17 3 .15.19 2 3.12 4.88 4.37.68.29 1.22.46 1.64.58.69.22 1.32.19 1.82.12.56-.08 1.72-.7 1.97-1.38.24-.68.24-1.26.17-1.38-.07-.12-.25-.19-.54-.34Z" fill="currentColor" />
        </svg>
      </a>

      <main className="notfound-main">
        <section className="container notfound-hero">
          <span className="eyebrow">Eroare 404</span>

          <p className="notfound-code" aria-hidden="true">
            4<span>0</span>4
          </p>

          <h1>Pagina căutată nu există.</h1>

          <p className="notfound-text">
            Adresa <code>{location.pathname}</code> nu duce nicăieri pe acest site. Este posibil
            să fi fost tastată greșit sau să fi fost mutată între timp.
          </p>

          <div className="notfound-actions">
            <Link className="btn btn--primary" to="/">
              Înapoi la pagina principală
            </Link>
            <Link className="btn btn--secondary" to="/contact">
              Contactează-ne
            </Link>
          </div>

          <nav className="notfound-links" aria-label="Legături rapide">
            <span>Sau mergeți direct la:</span>
            <ul>
              {scurtaturi.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.eticheta}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© 2026 Fontegas Roccadaspide Italia SRL</p>
          <p>România · GPL, distribuție și servicii profesionale</p>
        </div>
      </footer>
    </div>
  )
}

export default NotFoundPage
