import { Link } from 'react-router-dom'
import '../App.css'

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
          </nav>

          <Link className="contact-pill" to="/contact">
            Contact
          </Link>
        </div>
      </header>

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
          <div className="document-panel">
            <div className="document-copy">
              <span className="eyebrow">Responsabilitate</span>
              <h2>Document de lucru și verificare periodică.</h2>
              <p>
                În vederea menținerii în permanență a condițiilor de siguranță, toate instalațiile,
                conductele, robinetele și buteliile trebuie verificate periodic, iar documentele de
                intervenție trebuie păstrate la sediu pentru control și actualizare.
              </p>
            </div>

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
