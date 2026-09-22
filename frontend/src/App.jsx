import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

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

const stats = [
  { label: 'Ani de experiență', value: '10+' },
  { label: 'Statie proprie', value: '2x400 m³' },
  { label: 'GPL auto', value: 'Disponibil' },
]

const services = [
  {
    title: 'Furnizarea de GPL',
    description:
      'Solutii sigure pentru consum casnic si industrial, cu livrare si consultanta personalizata.',
    tag: 'Livrare constanta',
  },
  {
    title: 'Instalatii GPL',
    description:
      'Montaj si verificare instalatii moderne, adaptate necesitatilor fiecarui client.',
    tag: 'Montaj complet',
  },
  {
    title: 'Imbuteliere si stocare',
    description:
      'Capacitate de depozitare si imbuteliere pentru fluxuri de aprovizionare eficiente.',
    tag: 'Siguranta maxima',
  },
]

const differentiators = [
  {
    icon: '01',
    title: 'Soluții personalizate',
    text: 'Evaluăm nevoile reale ale clienților și adaptăm oferta de gaz și instalare.',
  },
  {
    icon: '02',
    title: 'Siguranță și standarde',
    text: 'Respectăm proceduri clare de operare, stocare și utilizare a produselor.',
  },
  {
    icon: '03',
    title: 'Disponibilitate rapidă',
    text: 'Răspuns prompt și sprijin operational pentru comenzile și cerințele urgente.',
  },
  {
    icon: '04',
    title: 'Partener de încredere',
    text: 'O relație stabilă cu clienții, prin profesionalism și transparenta continua.',
  },
]

const trustPoints = ['GPL auto', 'Distribuție locală', 'Stocare sigură', 'Consultanță tehnică']

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="site-shell">
      <header className="site-header" id="home">
        <div className="top-strip">
          <div className="container top-strip__inner">
            <span>România · Județul Mehedinți · Simian, E70</span>
            <span>Tel: 00-40-252-338310</span>
          </div>
        </div>

        <div className="container nav-wrap">
          <a href="#home" className="brand" aria-label="Pagina principală Fontegas">
            <img src="/SIGLA.jpg" alt="Logo Fontegas" />
          </a>

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

          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
            {navItems.map((item) =>
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

          <Link className="contact-pill" to="/contact">
            Contact
          </Link>
        </div>
      </header>

      <main>
        <a
          className="whatsapp-float"
          href="https://wa.me/40252338310?text=Salut%20v%C4%83%20scriu%20din%20site-ul%20dvs.%20%C8%99i%20a%C8%99%20dori%20mai%20multe%20informa%C8%9Bii."
          target="_blank"
          rel="noreferrer"
          aria-label="Deschide conversația WhatsApp"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.48 0 .12 5.37.12 11.95c0 2.1.55 4.15 1.6 5.96L0 24l6.35-1.67a11.94 11.94 0 0 0 5.7 1.71h.01c6.58 0 11.94-5.37 11.94-11.95 0-3.2-1.25-6.22-3.48-8.61ZM12.06 21.8h-.01a9.89 9.89 0 0 1-5.05-1.39l-.36-.21-3.77.99 1-3.67-.24-.38a9.87 9.87 0 1 1 18.22-5.24 9.9 9.9 0 0 1-9.79 9.9Zm5.42-7.38c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.19.29-.75.95-.92 1.14-.17.19-.34.21-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.2-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.66-1.58-.9-2.17-.24-.58-.48-.5-.66-.51l-.56-.01c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.02 2.81 1.17 3 .15.19 2 3.12 4.88 4.37.68.29 1.22.46 1.64.58.69.22 1.32.19 1.82.12.56-.08 1.72-.7 1.97-1.38.24-.68.24-1.26.17-1.38-.07-.12-.25-.19-.54-.34Z" fill="currentColor" />
          </svg>
        </a>

        <section className="hero container">
          <div className="hero__content">
            <span className="eyebrow">Gaz lichefiat • GPL auto • instalații</span>
            <h1>Solutii sigure pentru energie și mobilitate.</h1>
            <p>
              Facilităm furnizarea de GPL, distribuția și instalarea de echipamente pentru
              clienți casnici și industriali, cu o abordare modernă, clară și responsabilă.
            </p>

            <div className="hero__actions">
              <Link className="btn btn--primary" to="/contact">
                Solicită ofertă
              </Link>
              <a className="btn btn--secondary" href="#servicii">
                Vezi serviciile
              </a>
            </div>

            <div className="hero__meta">
              {stats.map((item) => (
                <div key={item.label} className="meta-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero__visual">
            <div className="image-frame">
              <img src="/general.jpg" alt="Statie de gaz și distribuție" />
            </div>
          </div>
        </section>

        <section className="trust-bar container" aria-label="Valori de încredere">
          {trustPoints.map((point) => (
            <div key={point} className="trust-item">
              {point}
            </div>
          ))}
        </section>

        <section className="services container" id="servicii">
          <div className="section-heading">
            <span className="eyebrow">Ce oferim</span>
            <h2>Servicii complete pentru nevoile tale.</h2>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article key={service.title} className="service-card">
                <span className="service-tag">{service.tag}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link to="/oferta">Află detalii</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="about container" id="despre">
          <div className="about__image">
            <img src="/fontegas.jpeg" alt="Imagine Fontegas" />
          </div>

          <div className="about__content">
            <span className="eyebrow">Despre noi</span>
            <h2>Profesionalism, siguranță și experiență în domeniul gazelor.</h2>
            <p>
              Societatea noastră activează în domeniul furnizării de gaz lichefiat, GPL auto,
              imbutelierii și distribuției de butelii, precum și în realizarea instalatiilor de
              alimentare cu GPL pentru consumatori casnici și industriali.
            </p>

            <ul className="check-list">
              <li>Operațiuni sigure și conforme cu standardele de protecție</li>
              <li>Capacitate de stocare și distribuție pentru volume variate</li>
              <li>Consultanță tehnică și soluții adaptate cerințelor reale</li>
            </ul>

            <div className="stats-inline">
              <div>
                <strong>400 m³</strong>
                <span>capacitate principală</span>
              </div>
              <div>
                <strong>100 m³</strong>
                <span>capacitate auxiliară</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features container" id="produse">
          <div className="section-heading centered">
            <span className="eyebrow">De ce noi</span>
            <h2>Avantajele unei colaborări solide.</h2>
          </div>

          <div className="feature-grid">
            {differentiators.map((item) => (
              <article key={item.title} className="feature-card">
                <span className="feature-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-banner container" id="contact">
          <div className="cta-banner__content">
            <span className="eyebrow">Contact rapid</span>
            <h2>Suntem pregătiți să vă oferim soluția potrivită.</h2>
          </div>

          <div className="cta-banner__actions">
            <a className="btn btn--primary" href="tel:+40252338310">
              +40 252 338310
            </a>
            <Link className="btn btn--secondary" to="/contact">
              Contactează-ne
            </Link>
          </div>
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

export default App
