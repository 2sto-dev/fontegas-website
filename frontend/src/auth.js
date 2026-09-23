import { useSyncExternalStore } from 'react'

const TOKEN_KEY = 'fontegas_admin_token'
const AUTH_EVENT = 'fontegas-auth-change'

export const getToken = () => localStorage.getItem(TOKEN_KEY) || ''

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
  window.dispatchEvent(new Event(AUTH_EVENT))
}

function subscribe(listener) {
  window.addEventListener(AUTH_EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(AUTH_EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

export function useToken() {
  return useSyncExternalStore(subscribe, getToken, () => '')
}
