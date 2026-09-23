import { getToken, setToken } from './auth.js'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function apiUrl(path) {
  return API_URL + path
}

// Return the original Response so each page keeps its existing error handling.
export async function apiFetch(path, { auth = false, ...options } = {}) {
  const token = auth ? getToken() : ''
  const headers = new Headers(options.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(apiUrl(path), { ...options, headers })
  if (auth && response.status === 401 && getToken() === token) setToken('')
  return response
}
