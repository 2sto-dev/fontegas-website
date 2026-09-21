import { Link } from 'react-router-dom'
import '../App.css'

const ofertaItems = [
  {
    title: 'Distribuție propan comercial',
    text:
      'Societatea este autorizată pentru proiectare instalații GPL în sistem mic VRAC, precum și pentru amplasarea, instalarea, întreținerea și intervenția acestora. Deține autorizare pentru distribuție GPL.',
    accent: 'Autorizare completă',
  },
  {
    title: 'Distribuție autogas',
    text:
      'Oferim servicii de alimentare și distribuție pentru nevoi de mobilitate, cu soluții rapide, sigure și adaptate cerințelor clienților din zona Mehedinți și nu numai.',
    accent: 'Mobilitate sigură',
  },
  {
    title: 'Încărcare și distribuție butelii de aragaz de 26 l',
    text:
      'Peste 250 de contracte de prestări servicii sunt încheiate cu societăți comerciale și persoane fizice. Asigurăm aprovizionare promptă și siguranță operațională.',
    accent: 'Aprovizionare rapidă',
  },
]

function OfertaPage() {
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

      <main className="offer-page-main">
        <section className="container offer-page-hero">
          <div className="offer-page-header">
            <span className="eyebrow">Oferta noastră</span>
            <h1>Servicii complete pentru nevoile tale.</h1>
          </div>
        </section>

        <section className="container offer-grid">
          {ofertaItems.map((item) => (
            <article key={item.title} className="offer-card">
              <span className="offer-chip">{item.accent}</span>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </section>

        <section className="container offer-details">
          <div className="offer-details__content">
            <h2>Ce asigurăm</h2>
            <ul className="offer-list">
              <li>proiectarea, consultanța și obținerea tuturor autorizațiilor de funcționare;</li>
              <li>transport, montaj și punere în funcțiune în maxim două zile;</li>
              <li>aprovizionare promptă și sigură, în maxim 24 de ore;</li>
              <li>serviciul de întreținere este asigurat gratuit.</li>
            </ul>
          </div>

          <div className="offer-image-card">
            <img src="/statia.jpg" alt="Stație de distribuție GPL" />
          </div>
        </section>

        <section className="container offer-highlight">
          <div className="offer-highlight__box">
            <p>
              <strong>NU</strong> se percepe chirie și <strong>NU</strong> se cumpără rezervoarele de
              propan. Avantajul centralelor alimentate cu gaz este că oferă apă caldă în cel mult
              5–7 minute și încălzirea locuinței începe în cel mult 20 de minute.
            </p>
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

export default OfertaPage
