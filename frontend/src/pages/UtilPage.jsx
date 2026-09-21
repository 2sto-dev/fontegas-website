import { Link } from 'react-router-dom'
import '../App.css'

const utilPoints = [
  'La fiecare montare nouă a buteliei se va utiliza o garnitură de etanșare nouă, între robinetul buteliei și regulatorul de presiune, montată obligatoriu în locul celei vechi.',
  'Pentru limitarea presiunii GPL care ajunge la aparat, butelia va fi prevăzută cu regulator de presiune sau supapă cu bilă și arc.',
  'Verificarea etanșeității buteliei, a accesoriilor și a tubului de cauciuc se va face cu spumă de săpun; este interzisă folosirea flăcării.',
  'Legătura dintre butelie și aparatele consumatoare se va face cu tub de cauciuc rezistent la produse petroliere, cu lungimea recomandată și fixare corespunzătoare.',
  'Este interzisă golirea buteliei cu ajutorul surselor de căldură, transvazarea gazului în alte recipiente, sau modificarea poziției buteliei prin prindere de regulator.',
  'În cazul în care se simte miros de gaz, se va închide robinetul buteliei, se va aerisi încăperea și se va anunța imediat serviciul de reclamatii autorizat.',
]

function UtilPage() {
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

      <main className="util-page-main">
        <section className="container util-page-hero">
          <div className="util-page-header">
            <span className="eyebrow">Util</span>
            <h1>Instrucțiuni de utilizare și siguranță.</h1>
            <p>
              Respectarea acestor recomandări este esențială pentru protejarea consumatorului,
              pentru funcționarea optimă a instalației și pentru prevenirea riscurilor legate de
              gazul lichefiat.
            </p>
          </div>
        </section>

        <section className="container util-grid">
          {utilPoints.map((point, index) => (
            <article key={point} className="util-card">
              <span className="util-index">0{index + 1}</span>
              <p>{point}</p>
            </article>
          ))}
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

export default UtilPage
