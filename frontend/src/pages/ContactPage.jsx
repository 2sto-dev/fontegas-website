import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

const initialFormState = {
  EmailFrom: '',
  Subject: '',
  Nume: '',
  Prenume: '',
  Adresa: '',
  Localitatea: '',
  Telefon: '',
  Mesaj: '',
}

function ContactPage() {
  const [formValues, setFormValues] = useState(initialFormState)
  const [submitState, setSubmitState] = useState({
    status: 'idle',
    message: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitState({ status: 'loading', message: 'Se trimite mesajul...' })

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formValues.EmailFrom,
          fullName: `${formValues.Nume} ${formValues.Prenume}`.trim(),
          phone: formValues.Telefon,
          message: formValues.Mesaj,
          ...formValues,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Mesajul nu a putut fi trimis.')
      }

      setSubmitState({
        status: 'success',
        message: 'Mesajul a fost trimis cu succes. Vă vom contacta cât mai curând.',
      })
      setFormValues(initialFormState)
    } catch (error) {
      setSubmitState({
        status: 'error',
        message: error.message || 'A apărut o eroare la trimiterea mesajului.',
      })
    }
  }

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

          <Link className="contact-pill" to="/">
            Înapoi acasă
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

          <form className="contact-form" onSubmit={handleSubmit} action="#">
            <div className="form-grid">
              <label>
                <span>Email expeditor:</span>
                <input
                  type="email"
                  name="EmailFrom"
                  value={formValues.EmailFrom}
                  onChange={handleChange}
                  placeholder="exemplu@email.com"
                  required
                />
              </label>

              <label>
                <span>Subiect:</span>
                <input
                  type="text"
                  name="Subject"
                  value={formValues.Subject}
                  onChange={handleChange}
                  placeholder="Subiectul mesajului"
                />
              </label>

              <label>
                <span>Nume:</span>
                <input
                  type="text"
                  name="Nume"
                  value={formValues.Nume}
                  onChange={handleChange}
                  placeholder="Numele dumneavoastră"
                  required
                />
              </label>

              <label>
                <span>Prenume:</span>
                <input
                  type="text"
                  name="Prenume"
                  value={formValues.Prenume}
                  onChange={handleChange}
                  placeholder="Prenumele dumneavoastră"
                />
              </label>

              <label>
                <span>Adresă:</span>
                <input
                  type="text"
                  name="Adresa"
                  value={formValues.Adresa}
                  onChange={handleChange}
                  placeholder="Strada, număr"
                />
              </label>

              <label>
                <span>Localitate:</span>
                <input
                  type="text"
                  name="Localitatea"
                  value={formValues.Localitatea}
                  onChange={handleChange}
                  placeholder="Localitatea"
                />
              </label>

              <label>
                <span>Telefon:</span>
                <input
                  type="tel"
                  name="Telefon"
                  value={formValues.Telefon}
                  onChange={handleChange}
                  placeholder="Telefon de contact"
                />
              </label>

              <label className="full-width">
                <span>Mesaj:</span>
                <textarea
                  name="Mesaj"
                  rows="6"
                  value={formValues.Mesaj}
                  onChange={handleChange}
                  placeholder="Scrieți mesajul dvs..."
                  required
                />
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn--primary submit-btn" disabled={submitState.status === 'loading'}>
                {submitState.status === 'loading' ? 'Se trimite...' : 'Trimite'}
              </button>
            </div>

            {submitState.message && (
              <p
                className={submitState.status === 'error' ? 'form-status form-status--error' : 'form-status form-status--success'}
              >
                {submitState.message}
              </p>
            )}
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
