import { Navigate } from 'react-router-dom'
import { setToken, useToken } from '../auth.js'
import { apiFetch } from '../api.jsx'
import { useEffect, useMemo, useRef, useState } from 'react'

const categoryOptions = [
  'documente',
  'securitate',
  'urgenta',
  'inspectie',
]

const formatDate = (value) => {
  if (!value) return '—'

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ro-RO')
}

function AdminPage({ loginOnly = false }) {
  const [requests, setRequests] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')
  const [sortOrder, setSortOrder] = useState('recent')
  const [documentTitle, setDocumentTitle] = useState('')
  const [documentCategory, setDocumentCategory] = useState('documente')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingState, setEditingState] = useState({ title: '', category: 'documente' })
  const token = useToken()
  const [formState, setFormState] = useState({ username: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const fileInputRef = useRef(null)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      const [requestsResponse, documentsResponse] = await Promise.all([
        apiFetch(`/api/requests`, { auth: true }),
        apiFetch(`/api/documents/admin`, { auth: true }),
      ])

      if (requestsResponse.status === 401 || documentsResponse.status === 401) {
        return
      }

      const requestsResult = await requestsResponse.json()
      const documentsResult = await documentsResponse.json()

      if (!requestsResponse.ok) {
        throw new Error(requestsResult.message || 'Eroare la încărcarea cererilor.')
      }

      if (!documentsResponse.ok) {
        throw new Error(documentsResult.message || 'Eroare la încărcarea documentelor.')
      }

      setRequests(requestsResult.data || [])
      setDocuments(documentsResult.data || [])
    } catch (err) {
      setError(err.message || 'Nu s-au putut încărca datele.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token || loginOnly) {
      setLoading(false)
      return
    }

    loadDashboardData()
  }, [token, loginOnly])

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Ștergi definitiv această cerere?')) {
      return
    }

    try {
      const response = await apiFetch(`/api/requests/${id}`, {
        method: 'DELETE',
        auth: true,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Eroare la ștergerea cererii.')
      }

      setRequests((current) => current.filter((item) => item.id !== id))
      setStatusMessage('Cererea a fost ștearsă cu succes.')
    } catch (err) {
      setError(err.message || 'Cererea nu a putut fi ștearsă.')
    }
  }

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Ștergi definitiv acest document?')) {
      return
    }

    try {
      const response = await apiFetch(`/api/documents/${id}`, {
        method: 'DELETE',
        auth: true,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Eroare la ștergerea documentului.')
      }

      setDocuments((current) => current.filter((item) => item.id !== id))
      setStatusMessage('Documentul a fost eliminat din baza de date.')
    } catch (err) {
      setError(err.message || 'Documentul nu a putut fi șters.')
    }
  }

  const handleDocumentSubmit = async (event) => {
    event.preventDefault()

    if (!selectedFile) {
      setError('Selectează un fișier înainte de upload.')
      return
    }

    try {
      setUploading(true)
      setError('')
      setStatusMessage('')

      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', documentTitle.trim())
      formData.append('category', documentCategory)

      const response = await apiFetch(`/api/documents`, {
        method: 'POST',
        auth: true,
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Încarcarea documentului a eșuat.')
      }

      setDocuments((current) => [result.data, ...current])
      setDocumentTitle('')
      setDocumentCategory('documente')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setStatusMessage(result.message)
    } catch (err) {
      setError(err.message || 'Nu s-a putut încărca documentul.')
    } finally {
      setUploading(false)
    }
  }

  const handleDocumentUpdate = async (id) => {
    try {
      setError('')
      setStatusMessage('')

      const response = await apiFetch(`/api/documents/${id}`, {
        method: 'PUT',
        auth: true,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingState.title,
          category: editingState.category,
          isPublished: 1,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Actualizarea documentului a eșuat.')
      }

      setDocuments((current) => current.map((item) => (item.id === id ? { ...item, ...result.data } : item)))
      setEditingId(null)
      setEditingState({ title: '', category: 'documente' })
      setStatusMessage(result.message)
    } catch (err) {
      setError(err.message || 'Documentul nu a putut fi actualizat.')
    }
  }

  const exportCsv = () => {
    const rows = displayedRequests.map((item) => ({
      ID: item.id,
      Companie: item.companyName || '',
      Nume: item.contactName || '',
      Email: item.email || '',
      Telefon: item.phone || '',
      Cerere: item.requirement || '',
      Data: formatDate(item.createdAt),
    }))

    const headers = Object.keys(rows[0] || {
      ID: 'ID',
      Companie: 'Companie',
      Nume: 'Nume',
      Email: 'Email',
      Telefon: 'Telefon',
      Cerere: 'Cerere',
      Data: 'Data',
    })

    const escapeCsv = (value) => {
      const normalized = String(value ?? '').replace(/\r?\n/g, ' ')
      return `"${normalized.replace(/"/g, '""')}"`
    }

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cereri-fontegas-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      setLoginLoading(true)
      setError('')

      const response = await apiFetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formState.username,
          password: formState.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Autentificarea a eșuat.')
      }

      setToken(result.token)
      setFormState((current) => ({ ...current, password: '' }))
      setStatusMessage('Autentificare reușită.')
    } catch (err) {
      setError(err.message || 'Autentificarea a eșuat.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    setToken('')
    setRequests([])
    setDocuments([])
    setStatusMessage('')
    setError('')
  }

  const displayedRequests = useMemo(() => {
    const sorted = [...requests].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB
    })

    return sortOrder === 'recent' ? sorted.slice(0, 10) : sorted
  }, [requests, sortOrder])

  const publishedDocumentCount = documents.filter((item) => Number(item.isPublished) === 1).length

  if (loginOnly && token) return <Navigate to="/fontegas" replace />

  if (loginOnly || !token) {
    return (
      <div style={pageStyle}>
        <div style={loginCardStyle}>
          <div style={loginHeaderStyle}>
            <div style={brandBadgeStyle}>FONTEGAS</div>
            <h1 style={titleStyle}>Autentificare</h1>
            <p style={subtitleStyle}>Acces rezervat administratorului platformei.</p>
          </div>

          <form onSubmit={handleLogin} style={loginFormStyle}>
            <label style={fieldStyle}>
              <span style={labelStyle}>Utilizator</span>
              <input
                type="text"
                value={formState.username}
                onChange={(event) => setFormState((current) => ({ ...current, username: event.target.value }))}
                placeholder="Introdu utilizatorul"
                style={{ ...inputStyle, background: '#f8fafc' }}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>Parolă</span>
              <input
                type="password"
                value={formState.password}
                onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
                placeholder="Introdu parola"
                style={inputStyle}
              />
            </label>

            {error ? <p style={errorBannerStyle}>{error}</p> : null}

            <button type="submit" style={primaryButtonStyle} disabled={loginLoading}>
              {loginLoading ? 'Se autentifică...' : 'Intră în dashboard'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Dashboard documente și cereri</h1>
          </div>

          <div style={toolbarRowStyle}>
            <button type="button" onClick={exportCsv} style={primaryButtonStyle} disabled={displayedRequests.length === 0}>
              Export CSV cereri
            </button>
            <button type="button" onClick={handleLogout} style={secondaryButtonStyle}>
              Deloghează-te
            </button>
          </div>
        </div>

        {statusMessage ? <p style={successStyle}>{statusMessage}</p> : null}
        {error ? <p style={errorStyle}>{error}</p> : null}

        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>Cereri primite</span>
            <strong style={statValueStyle}>{requests.length}</strong>
          </div>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>Documente publice</span>
            <strong style={statValueStyle}>{publishedDocumentCount}</strong>
          </div>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>Total documente</span>
            <strong style={statValueStyle}>{documents.length}</strong>
          </div>
        </div>

        {loading ? (
          <p style={metaStyle}>Se încarcă dashboard-ul...</p>
        ) : (
          <>
            <section style={panelStyle}>
              <div style={sectionHeaderStyle}>
                <h2 style={sectionTitleStyle}>Încarcă document</h2>
              </div>

              <form onSubmit={handleDocumentSubmit} style={formGridStyle}>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Titlu document</span>
                  <input
                    type="text"
                    value={documentTitle}
                    onChange={(event) => setDocumentTitle(event.target.value)}
                    placeholder="Ex: Plan de urgență internă"
                    style={inputStyle}
                  />
                </label>

                <label style={fieldStyle}>
                  <span style={labelStyle}>Categorie</span>
                  <select
                    value={documentCategory}
                    onChange={(event) => setDocumentCategory(event.target.value)}
                    style={inputStyle}
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={fieldStyle}>
                  <span style={labelStyle}>Fișier</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                    style={{ ...inputStyle, padding: '10px 12px' }}
                  />
                </label>

                <div style={submitWrapStyle}>
                  <button type="submit" style={primaryButtonStyle} disabled={uploading}>
                    {uploading ? 'Se încarcă...' : 'Încarcă document'}
                  </button>
                </div>
              </form>
            </section>

            <section style={panelStyle}>
              <div style={sectionHeaderStyle}>
                <h2 style={sectionTitleStyle}>Documente disponibile</h2>
              </div>

              {documents.length === 0 ? (
                <p style={emptyStyle}>Niciun document încărcat în baza de date.</p>
              ) : (
                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={cellStyle}>Titlu</th>
                        <th style={cellStyle}>Categorie</th>
                        <th style={cellStyle}>Fișier</th>
                        <th style={cellStyle}>Data</th>
                        <th style={cellStyle}>Public</th>
                        <th style={cellStyle}>Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((item) => (
                        <tr key={item.id}>
                          <td style={cellStyle}>
                            {editingId === item.id ? (
                              <input
                                type="text"
                                value={editingState.title}
                                onChange={(event) =>
                                  setEditingState((current) => ({ ...current, title: event.target.value }))
                                }
                                style={inputStyle}
                              />
                            ) : (
                              item.title || '—'
                            )}
                          </td>
                          <td style={cellStyle}>
                            {editingId === item.id ? (
                              <select
                                value={editingState.category}
                                onChange={(event) =>
                                  setEditingState((current) => ({ ...current, category: event.target.value }))
                                }
                                style={inputStyle}
                              >
                                {categoryOptions.map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              item.category || 'documente'
                            )}
                          </td>
                          <td style={cellStyle}>{item.fileName || '—'}</td>
                          <td style={cellStyle}>{formatDate(item.createdAt)}</td>
                          <td style={cellStyle}>{Number(item.isPublished) === 1 ? 'Da' : 'Nu'}</td>
                          <td style={{ ...cellStyle, minWidth: 170 }}>
                            {editingId === item.id ? (
                              <div style={actionGroupStyle}>
                                <button type="button" onClick={() => handleDocumentUpdate(item.id)} style={primaryButtonStyle}>
                                  Salvează
                                </button>
                                <button type="button" onClick={() => setEditingId(null)} style={secondaryButtonStyle}>
                                  Anulează
                                </button>
                              </div>
                            ) : (
                              <div style={actionGroupStyle}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingId(item.id)
                                    setEditingState({ title: item.title || '', category: item.category || 'documente' })
                                  }}
                                  style={secondaryButtonStyle}
                                >
                                  Editează
                                </button>
                                <button type="button" onClick={() => handleDeleteDocument(item.id)} style={dangerButtonStyle}>
                                  Șterge
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section style={panelStyle}>
              <div style={sectionHeaderStyle}>
                <h2 style={sectionTitleStyle}>Cereri primite</h2>
                <label style={selectWrapStyle}>
                  <span style={selectLabelStyle}>Sortare</span>
                  <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} style={selectStyle}>
                    <option value="recent">Cele mai recente</option>
                    <option value="oldest">Cele mai vechi</option>
                  </select>
                </label>
              </div>

              {displayedRequests.length === 0 ? (
                <p style={emptyStyle}>Nu există cereri pentru filtrul selectat.</p>
              ) : (
                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={cellStyle}>ID</th>
                        <th style={cellStyle}>Companie</th>
                        <th style={cellStyle}>Nume</th>
                        <th style={cellStyle}>Email</th>
                        <th style={cellStyle}>Telefon</th>
                        <th style={cellStyle}>Cerere</th>
                        <th style={cellStyle}>Data</th>
                        <th style={cellStyle}>Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedRequests.map((item) => (
                        <tr key={item.id}>
                          <td style={cellStyle}>{item.id}</td>
                          <td style={cellStyle}>{item.companyName || '—'}</td>
                          <td style={cellStyle}>{item.contactName || '—'}</td>
                          <td style={cellStyle}>{item.email || '—'}</td>
                          <td style={cellStyle}>{item.phone || '—'}</td>
                          <td style={{ ...cellStyle, maxWidth: 360, whiteSpace: 'pre-wrap' }}>{item.requirement || '—'}</td>
                          <td style={cellStyle}>{formatDate(item.createdAt)}</td>
                          <td style={cellStyle}>
                            <button type="button" onClick={() => handleDeleteRequest(item.id)} style={dangerButtonStyle}>
                              Șterge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f5f7fb 0%, #edf2f7 100%)',
  fontFamily: 'Arial, sans-serif',
  padding: '40px 20px',
}

const containerStyle = {
  maxWidth: 1280,
  margin: '0 auto',
  display: 'grid',
  gap: 24,
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
}

const toolbarRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
}

const titleStyle = {
  margin: 0,
  fontSize: 34,
  color: '#111827',
}

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 16,
}

const statCardStyle = {
  background: '#fff',
  border: '1px solid #dfe7ef',
  borderRadius: 16,
  padding: '18px 20px',
  display: 'grid',
  gap: 8,
  boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
}

const statLabelStyle = {
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: '#64748b',
}

const statValueStyle = {
  fontSize: 30,
  color: '#0f172a',
}

const panelStyle = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 18,
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
  padding: 20,
}

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  marginBottom: 18,
  flexWrap: 'wrap',
}

const sectionTitleStyle = {
  margin: 0,
  fontSize: 22,
  color: '#111827',
}

const loginCardStyle = {
  maxWidth: 440,
  margin: '80px auto',
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 18,
  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
  padding: 28,
}

const loginHeaderStyle = {
  marginBottom: 20,
  display: 'grid',
  gap: 10,
}

const brandBadgeStyle = {
  width: 'fit-content',
  background: '#e0f2fe',
  color: '#075985',
  border: '1px solid #bae6fd',
  borderRadius: 999,
  padding: '6px 10px',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.12em',
}

const subtitleStyle = {
  margin: 0,
  color: '#64748b',
  fontSize: 14,
}

const loginFormStyle = {
  display: 'grid',
  gap: 18,
}

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 18,
  alignItems: 'end',
}

const fieldStyle = {
  display: 'grid',
  gap: 8,
}

const labelStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const inputStyle = {
  border: '1px solid #cbd5e1',
  borderRadius: 12,
  padding: '12px 14px',
  fontSize: 14,
  color: '#0f172a',
  background: '#fff',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  outline: 'none',
}

const submitWrapStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
}

const primaryButtonStyle = {
  background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  padding: '12px 18px',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 10px 20px rgba(17, 24, 39, 0.16)',
}

const secondaryButtonStyle = {
  background: '#e2e8f0',
  color: '#0f172a',
  border: 'none',
  borderRadius: 10,
  padding: '8px 12px',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
}

const dangerButtonStyle = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '8px 12px',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
}

const actionGroupStyle = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
}

const tableWrapStyle = {
  overflowX: 'auto',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 980,
}

const cellStyle = {
  border: '1px solid #e5e7eb',
  padding: '12px 14px',
  textAlign: 'left',
  verticalAlign: 'top',
  color: '#1f2937',
}

const selectWrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  background: '#fff',
  border: '1px solid #dbe3ee',
  borderRadius: 10,
  padding: '8px 12px',
}

const selectLabelStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: '#4b5563',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const selectStyle = {
  border: 'none',
  background: 'transparent',
  fontSize: 14,
  color: '#111827',
  padding: '4px 0',
  outline: 'none',
}

const metaStyle = {
  color: '#374151',
  margin: 0,
}

const successStyle = {
  color: '#166534',
  fontWeight: 700,
  margin: 0,
}

const errorStyle = {
  color: '#b42318',
  fontWeight: 700,
  margin: 0,
}

const errorBannerStyle = {
  margin: 0,
  padding: '10px 12px',
  background: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: 10,
  color: '#b42318',
  fontSize: 13,
  fontWeight: 700,
}

const emptyStyle = {
  color: '#6b7280',
  margin: 0,
  padding: '12px 0',
}

export default AdminPage
