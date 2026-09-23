import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { apiFetch } from '../api.jsx'
import { getToken, setToken, useToken } from '../auth.js'

export default function ProtectedRoute() {
  const token = useToken()
  const [session, setSession] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()
    let expiryTimer

    async function verifySession() {
      try {
        const response = await apiFetch('/api/auth/me', { auth: true, signal: controller.signal })
        const result = await response.json()
        if (controller.signal.aborted) return
        if (response.status === 401 || response.status === 403) {
          if (getToken() === token) setToken('')
          return
        }
        if (!response.ok) throw new Error('Verificarea sesiunii a eșuat.')
        const remaining = result.expiresAt * 1000 - Date.now()
        if (!Number.isFinite(remaining) || remaining <= 0) {
          if (getToken() === token) setToken('')
          return
        }
        setSession({ token, attempt, valid: true })
        expiryTimer = window.setTimeout(() => {
          if (getToken() === token) setToken('')
        }, remaining)
      } catch {
        if (!controller.signal.aborted) setSession({ token, attempt, valid: false })
      }
    }

    verifySession()
    return () => {
      controller.abort()
      window.clearTimeout(expiryTimer)
    }
  }, [token, attempt])

  if (!token) return <Navigate to="/fontegas/login" replace />
  if (session?.token !== token || session?.attempt !== attempt) {
    return <p role="status">Se verifică sesiunea...</p>
  }
  if (!session.valid) {
    return (
      <div role="alert">
        <p>Nu s-a putut verifica sesiunea. Verifică conexiunea și încearcă din nou.</p>
        <button type="button" onClick={() => setAttempt((value) => value + 1)}>Reîncearcă</button>
        <button type="button" onClick={() => setToken('')}>Autentificare</button>
      </div>
    )
  }
  return <Outlet />
}
