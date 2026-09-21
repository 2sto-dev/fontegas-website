import { Link } from 'react-router-dom'
import '../App.css'

function ContactPage() {
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

          <Link className="contact-pill" to="/">
            Înapoi acasă
          </Link>
        </div>
      </header>

      <main className="contact-page-main">
        <section className="contact-page-hero container">
          <div className="contact-page-content">
            <span className="eyebrow">Contact</span>
            <h1>Trimiteți-ne un mesaj</h1>
            <p>
              Suntem pregătiți să răspundem la întrebările dumneavoastră și să vă oferim
              soluția potrivită pentru nevoile de energie și distribuție GPL.
            </p>

            <div className="hero__actions">
              <a className="btn btn--primary" href="tel:+40252338310">
                +40 252 338310
              </a>
              <Link className="btn btn--secondary" to="/">
                Înapoi la pagina principală
              </Link>
            </div>
          </div>
        </section>

        <section className="contact-form-section container contact-page-form">
          <div className="section-heading">
            <span className="eyebrow">Contact electronic</span>
            <h2>Ne puteți contacta acum pe cale electronică.</h2>
          </div>

          <form
            className="contact-form"
            onSubmit={(event) => event.preventDefault()}
            action="#"
          >
            <div className="form-grid">
              <label>
                <span>Email expeditor:</span>
                <input type="email" name="EmailFrom" placeholder="exemplu@email.com" />
              </label>

              <label>
                <span>Subiect:</span>
                <input type="text" name="Subject" placeholder="Subiectul mesajului" />
              </label>

              <label>
                <span>Nume:</span>
                <input type="text" name="Nume" placeholder="Numele dumneavoastră" />
              </label>

              <label>
                <span>Prenume:</span>
                <input type="text" name="Prenume" placeholder="Prenumele dumneavoastră" />
              </label>

              <label>
                <span>Adresă:</span>
                <input type="text" name="Adresa" placeholder="Strada, număr" />
              </label>

              <label>
                <span>Localitate:</span>
                <input type="text" name="Localitatea" placeholder="Localitatea" />
              </label>

              <label>
                <span>Telefon:</span>
                <input type="tel" name="Telefon" placeholder="Telefon de contact" />
              </label>

              <label className="full-width">
                <span>Mesaj:</span>
                <textarea name="Mesaj" rows="6" placeholder="Scrieți mesajul dvs..." />
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn--primary submit-btn">
                Trimite
              </button>
            </div>
          </form>
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

export default ContactPage
