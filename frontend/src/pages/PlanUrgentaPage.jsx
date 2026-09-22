import { Link } from 'react-router-dom'
import '../App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const emergencyHighlights = [
  { label: 'Locație', value: 'Simian, județul Mehedinți' },
  { label: 'Telefon', value: '+40 252 338310' },
  { label: 'Fax', value: '+40 252 338309' },
  { label: 'Editia', value: '3 / 2013' },
]

const emergencySteps = [
  {
    title: 'Detectare și alertare',
    text: 'La observarea unei scurgeri, a unui miros de gaz sau a unei anomalii la instalație, se intrerupe imediat alimentarea, se închide robinetul buteliei și se anunță persoana responsabilă de siguranță.',
  },
  {
    title: 'Ventilație și izolare',
    text: 'Se aerisește imediat zona afectată și se evită orice sursă de aprindere: flacără, întrerupător electric, telefon mobil sau alte elemente ce pot genera scântei.',
  },
  {
    title: 'Intervenție operațională',
    text: 'Se verifică etanșeitatea conductelor, racordurilor și a echipamentelor cu soluție de spumă, fără a folosi flacăra sau alte surse de căldură.',
  },
  {
    title: 'Raportare și monitorizare',
    text: 'După stabilizarea situației, se documentează incidentul, se notifică autoritățile competente și se revine la funcționarea normală doar după remedierea completă a defecțiunii.',
  },
]

const emergencyRules = [
  'Se interzice folosirea flăcării pentru verificarea etanșeității.',
  'Nu se depășesc presiuni de lucru și nu se modifică poziția buteliei prin prindere de regulator.',
  'Se menține în permanență un sistem de ventilație adecvat în zona de depozitare și utilizare.',
  'Se înlocuiește obligatoriu garnitura de etanșare la fiecare montare nouă a buteliei.',
]

const emergencyContacts = [
  'Serviciu de intervenție autorizat',
  'Administrator responsabil: Antonio Scovotto',
  'Telefon: +40 252 338310',
  'Adresă: Simian, județul Mehedinți, E70',
]

function PlanUrgentaPage() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="top-strip">
          <div className="container top-strip__inner">
            <span>România · Județul Mehedinți · Simian, E70</span>
            <span>Tel: 00-40-252-338310</span>
          </div>
        </div>

        <div className="container nav-wrap">
          <Link to="/" className="brand" aria-label="Pagina principală Fontegas">
            <img src="/SIGLA.jpg" alt="Logo Fontegas" />
          </Link>

          <nav className="main-nav is-open" aria-label="Meniu principal">
            <Link to="/">Acasă</Link>
            <Link to="/oferta">Oferta</Link>
            <Link to="/util">Util</Link>
            <Link to="/plan-de-urgenta">Plan de urgență</Link>
            <Link to="/documente">Documente</Link>
          </nav>

          <Link className="contact-pill" to="/contact">
            Contact
          </Link>
        </div>
      </header>

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

      <main className="plan-urgenta-page-main">
        <section className="container plan-urgenta-page-hero">
          <div className="plan-urgenta-page-header">
            <span className="eyebrow">Plan de urgență</span>
            <h1>Proceduri operaționale pentru intervenția rapidă și prevenirea incidentelor.</h1>
            <p>
              Acest plan stabilește măsurile necesare pentru prevenirea și gestionarea situațiilor
              de risc asociate depozitării, manipulării și utilizării gazului lichefiat, cu un
              accent clar pe siguranța personalului, clienților și vecinătății.
            </p>
          </div>

          <div className="plan-urgenta-hero-visual">
            <img src="/psi.jpg" alt="Instalație de stocare GPL și echipamente de siguranță" />
          </div>

          <div className="plan-urgenta-hero-panel">
            <span className="panel-tag">Document intern</span>
            <div className="panel-grid">
              {emergencyHighlights.map((item) => (
                <div key={item.label} className="panel-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <a
              href={`${API_URL}/files/PLAN-DE-URGENTA-INTERNA.doc`}
              target="_blank"
              rel="noreferrer"
              className="panel-download-link"
            >
              Descarcă planul de urgență
            </a>
          </div>
        </section>

        <section className="container emergency-highlights">
          <article className="info-card danger-card">
            <span className="card-kicker">Prima măsură</span>
            <h2>În caz de miros de gaz</h2>
            <p>
              Închideți imediat robinetul buteliei, aerisiți spațiul, evitați aprinderea și folosiți
              numai echipamentele adecvate, în conformitate cu procedurile din prezentul plan.
            </p>
          </article>

          <article className="info-card">
            <span className="card-kicker">Obiectiv</span>
            <h2>Reducerea riscului</h2>
            <p>
              Ne asigurăm că fiecare intervenție este rapidă, clară și coordonată, astfel încât
              să limităm impactul asupra persoanelor, instalațiilor și mediului.
            </p>
          </article>
        </section>

        <section className="container emergency-grid">
          <div className="emergency-procedure">
            <div className="steps-header">
              <span className="eyebrow red-eyebrow">Etape de intervenție</span>
            </div>

            <div className="steps-list">
              {emergencySteps.map((step, index) => (
                <article key={step.title} className="step-card">
                  <span className="step-number">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="emergency-sidebar">
            <div className="sidebar-card contact-box">
              <span className="card-kicker">Contact de urgență</span>
              <h3>Informații de contact</h3>
              <ul>
                {emergencyContacts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="sidebar-card">
              <span className="card-kicker">Reguli esențiale</span>
              <h3>Ce NU se permite</h3>
              <ul className="warning-list">
                {emergencyRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        <section className="container emergency-doc-section">
          <div className="document-panel document-panel--metrics-only">
            <div className="document-metrics">
              <div>
                <strong>100%</strong>
                <span>evaluare riscuri</span>
              </div>
              <div>
                <strong>24h</strong>
                <span>reacție recomandată</span>
              </div>
              <div>
                <strong>0</strong>
                <span>compromitere la siguranță</span>
              </div>
            </div>
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

export default PlanUrgentaPage
