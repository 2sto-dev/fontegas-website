import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

const navItems = [
  { label: 'Acasă', href: '#home' },
  { label: 'Despre noi', href: '#despre' },
  { label: 'Servicii', href: '#servicii' },
  { label: 'Produse', href: '#produse' },
  { label: 'Oferta', to: '/oferta' },
  { label: 'Util', to: '/util' },
  { label: 'Plan de urgență', to: '/plan-de-urgenta' },
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
            <div className="floating-card">
              <span>Statie proprie</span>
              <strong>2 rezervoare de 400 mc</strong>
              <small>+ instalație de stocare de 100 mc</small>
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
            <img src="/statia.jpg" alt="Stație de stocare și distribuție" />
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
