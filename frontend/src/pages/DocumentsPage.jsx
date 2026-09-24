import { apiFetch, apiUrl } from '../api.jsx'
import Menu from '../components/menu.jsx'
import { useEffect, useMemo, useState } from 'react'
import '../App.css'

const categoryLabels = {
  all: 'Toate',
  documente: 'Documente',
  securitate: 'Securitate',
  urgenta: 'Urgenta',
  inspectie: 'Inspecție',
}

function DocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true)
        const response = await apiFetch(`/api/documents`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Nu s-au putut încărca documentele.')
        }

        setDocuments(result.data || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()
  }, [])

  const categories = useMemo(
    () => ['all', ...new Set(documents.map((item) => item.category || 'documente'))],
    [documents],
  )

  const sortedDocuments = useMemo(() => {
    const list = [...documents]

    list.sort((a, b) => {
      const valueA = String(a.title || '').toLowerCase()
      const valueB = String(b.title || '').toLowerCase()
      const timeA = new Date(a.createdAt || Date.now()).getTime()
      const timeB = new Date(b.createdAt || Date.now()).getTime()

      if (sortBy === 'name-asc') {
        return valueA.localeCompare(valueB)
      }

      if (sortBy === 'name-desc') {
        return valueB.localeCompare(valueA)
      }

      if (sortBy === 'date-asc') {
        return timeA - timeB
      }

      return timeB - timeA
    })

    return list
  }, [documents, sortBy])

  const filteredDocuments = sortedDocuments.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const matchesSearch =
      normalizedSearch.length === 0 ||
      String(item.title || '').toLowerCase().includes(normalizedSearch) ||
      String(item.fileName || '').toLowerCase().includes(normalizedSearch) ||
      String(item.category || '').toLowerCase().includes(normalizedSearch)

    return matchesCategory && matchesSearch
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

      <main className="documents-page-main">
        <section className="container documents-page-hero">
          <div className="documents-page-header">
            <span className="eyebrow">Documente</span>
            <h1>Fișiere oficiale și documente de lucru.</h1>
          </div>
        </section>

        <section className="container documents-filter-bar">
          <div className="documents-toolbar">
            <div className="filter-list" aria-label="Filtre documente">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`filter-btn ${activeCategory === category ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {categoryLabels[category] || category}
                </button>
              ))}
            </div>

            <div className="documents-control-group">
              <label className="documents-search">
                <span className="documents-search__label">Caută</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Nume document..."
                />
              </label>

              <label className="documents-sort">
                <span>Sortare</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="date-desc">Cele mai noi</option>
                  <option value="date-asc">Cele mai vechi</option>
                  <option value="name-asc">Nume A → Z</option>
                  <option value="name-desc">Nume Z → A</option>
                </select>
              </label>
            </div>
          </div>
        </section>

        <section className="container documents-grid-wrap">
          {loading ? (
            <div className="documents-loading">Se încarcă documentele...</div>
          ) : filteredDocuments.length === 0 ? (
            <div className="documents-empty">Nu există documente pentru această categorie.</div>
          ) : (
            <div className="documents-grid">
              {filteredDocuments.map((item) => (
                <article key={item.id} className="document-card">
                  <div className="document-card__meta">
                    <span>{categoryLabels[item.category] || item.category}</span>
                    <span>{(item.fileType || 'pdf').toUpperCase()}</span>
                  </div>

                  <h2>{item.title}</h2>
                  <p>
                    {item.fileName}
                  </p>

                  <div className="document-card__actions">
                    <a
                      href={apiUrl(item.downloadUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="document-card__link"
                    >
                      Descarcă
                    </a>
                    <a
                      href={apiUrl(item.downloadUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="document-card__ghost"
                    >
                      Vezi
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
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

export default DocumentsPage
