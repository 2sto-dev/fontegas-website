import Menu from '../components/menu.jsx'
import '../App.css'
import { useSeo } from '../seo.js'

const utilPoints = [
  'La fiecare montare nouă a buteliei se va utiliza o garnitură de etanșare nouă, între robinetul buteliei și regulatorul de presiune, montată obligatoriu în locul celei vechi.',
  'Pentru limitarea presiunii GPL care ajunge la aparat, butelia va fi prevăzută cu regulator de presiune sau supapă cu bilă și arc.',
  'Verificarea etanșeității buteliei, a accesoriilor și a tubului de cauciuc se va face cu spumă de săpun; este interzisă folosirea flăcării.',
  'Legătura dintre butelie și aparatele consumatoare se va face cu tub de cauciuc rezistent la produse petroliere, cu lungimea recomandată și fixare corespunzătoare.',
  'Este interzisă golirea buteliei cu ajutorul surselor de căldură, transvazarea gazului în alte recipiente, sau modificarea poziției buteliei prin prindere de regulator.',
  'În cazul în care se simte miros de gaz, se va închide robinetul buteliei, se va aerisi încăperea și se va anunța imediat serviciul de reclamatii autorizat.',
]

function UtilPage() {
  useSeo({
    titlu: 'Siguranța buteliilor de aragaz — instrucțiuni | Fontegas',
    descriere:
      'Cum se montează garnitura, cum se verifică etanșeitatea cu spumă de săpun și ce se face când se simte miros de gaz.',
  })


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
