import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE = 'https://fontegas-info.ro'
const IMAGINE = `${SITE}/general.jpg`

// Aplicatia e randata in browser si toate rutele pleaca de la acelasi
// index.html, deci fara asta fiecare pagina ar aparea in Google cu acelasi
// titlu si aceeasi descriere. Scriem direct in DOM, controlat, ca sa nu
// ajungem cu etichete duplicate in <head>.
const seteazaMeta = (atribut, cheie, valoare) => {
  const selector = `meta[${atribut}="${cheie}"]`
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(atribut, cheie)
    document.head.appendChild(element)
  }

  element.setAttribute('content', valoare)
}

const seteazaCanonical = (url) => {
  let element = document.head.querySelector('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }

  element.setAttribute('href', url)
}

const stergeRobots = () => {
  const element = document.head.querySelector('meta[name="robots"]')
  if (element) element.remove()
}

export function useSeo({ titlu, descriere, indexabil = true }) {
  const location = useLocation()

  useEffect(() => {
    const url = `${SITE}${location.pathname}`

    document.title = titlu
    seteazaMeta('name', 'description', descriere)
    seteazaCanonical(url)

    // Open Graph: ce se vede cand cineva da link-ul pe WhatsApp sau Facebook.
    seteazaMeta('property', 'og:type', 'website')
    seteazaMeta('property', 'og:site_name', 'Fontegas')
    seteazaMeta('property', 'og:locale', 'ro_RO')
    seteazaMeta('property', 'og:title', titlu)
    seteazaMeta('property', 'og:description', descriere)
    seteazaMeta('property', 'og:url', url)
    seteazaMeta('property', 'og:image', IMAGINE)
    seteazaMeta('name', 'twitter:card', 'summary_large_image')

    // Pagina de eroare nu are ce cauta in index.
    if (indexabil) {
      stergeRobots()
    } else {
      seteazaMeta('name', 'robots', 'noindex, follow')
    }
  }, [titlu, descriere, indexabil, location.pathname])
}
