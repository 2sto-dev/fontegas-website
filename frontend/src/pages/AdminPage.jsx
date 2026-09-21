import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function AdminPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortOrder, setSortOrder] = useState('all')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/api/requests`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Eroare la încărcarea cererilor.')
      }

      setRequests(result.data || [])
    } catch (err) {
      setError(err.message || 'Nu s-au putut încărca datele.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Ștergi definitiv această cerere?')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/requests/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Eroare la ștergerea cererii.')
      }

      setRequests((current) => current.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message || 'Cererea nu a putut fi ștearsă.')
    }
  }

  const exportCsv = () => {
    const rows = filteredRequests.map((item) => ({
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

  const sortedRequests = [...requests].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortOrder === 'recent' ? dateB - dateA : dateA - dateB
  })

  const filteredRequests = sortOrder === 'recent' ? sortedRequests.slice(0, 10) : sortedRequests

  const formatDate = (value) => {
    if (!value) return '—'

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ro-RO')
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Cereri primite</h1>
          </div>

          <div style={toolbarStyle}>
            <button type="button" onClick={exportCsv} style={buttonStyle} disabled={filteredRequests.length === 0}>
              Export CSV
            </button>

            <label style={selectWrapStyle}>
              <span style={selectLabelStyle}>Sortare</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                style={selectStyle}
              >
                <option value="all">Toate</option>
                <option value="recent">Cele mai recente</option>
              </select>
            </label>
          </div>
        </div>

        {loading && <p style={metaStyle}>Se încarcă datele...</p>}
        {error && <p style={errorStyle}>{error}</p>}

        {!loading && !error && (
          <section style={panelStyle}>
            <div style={summaryStyle}>
              <strong>{filteredRequests.length}</strong>
              <span>cereri afișate</span>
            </div>

            {filteredRequests.length === 0 ? (
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
                    {filteredRequests.map((item) => (
                      <tr key={item.id}>
                        <td style={cellStyle}>{item.id}</td>
                        <td style={cellStyle}>{item.companyName || '—'}</td>
                        <td style={cellStyle}>{item.contactName || '—'}</td>
                        <td style={cellStyle}>{item.email || '—'}</td>
                        <td style={cellStyle}>{item.phone || '—'}</td>
                        <td style={{ ...cellStyle, maxWidth: 420, whiteSpace: 'pre-wrap' }}>{item.requirement || '—'}</td>
                        <td style={cellStyle}>{formatDate(item.createdAt)}</td>
                        <td style={cellStyle}>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            style={deleteButtonStyle}
                          >
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
        )}
      </div>
    </div>
  )
}

const pageStyle = {
  fontFamily: 'Arial, sans-serif',
  background: 'linear-gradient(180deg, #f7f7f7 0%, #eef2f6 100%)',
  minHeight: '100vh',
  padding: '40px 20px',
}

const containerStyle = {
  maxWidth: 1200,
  margin: '0 auto',
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  marginBottom: 24,
  flexWrap: 'wrap',
}

const titleStyle = {
  margin: 0,
  fontSize: 32,
  color: '#111827',
}

const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
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

const buttonStyle = {
  background: '#111827',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '10px 14px',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',
}

const deleteButtonStyle = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
}

const panelStyle = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 18,
  boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
  padding: 20,
}

const summaryStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 18,
  background: '#f3f4f6',
  borderRadius: 10,
  padding: '12px 14px',
  width: 'fit-content',
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

const metaStyle = {
  color: '#374151',
  margin: 0,
}

const errorStyle = {
  color: '#b42318',
  fontWeight: 600,
  margin: 0,
}

const emptyStyle = {
  color: '#6b7280',
  margin: 0,
  padding: '12px 0',
}

export default AdminPage
