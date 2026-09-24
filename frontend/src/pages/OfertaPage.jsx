import { apiFetch } from '../api.jsx'
import Menu from '../components/menu.jsx'
import { useState } from 'react'
import '../App.css'
import { useSeo } from '../seo.js'

const initialFormState = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  requirement: '',
}

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
  useSeo({
    titlu: 'Ofertă GPL: propan, autogas și butelii | Fontegas',
    descriere:
      'Distribuție propan comercial în sistem mic vrac, GPL auto și butelii de aragaz de 26 l. Peste 250 de contracte în județul Mehedinți.',
  })

  const [formValues, setFormValues] = useState(initialFormState)
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitState({ status: 'loading', message: 'Se trimite cererea...' })

    try {
      const response = await apiFetch(`/api/lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Cererea nu a putut fi trimisă.')
      }

      setSubmitState({
        status: 'success',
        message: 'Cererea a fost trimisă cu succes. Vă vom contacta cât mai curând.',
      })
      setFormValues(initialFormState)
    } catch (error) {
      setSubmitState({
        status: 'error',
        message: error.message || 'A apărut o eroare la trimiterea cererii.',
      })
    }
  }

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
