import path from 'node:path'

export const normalizeCategory = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  const sanitized = normalized
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return sanitized || 'documente'
}

export const sanitizeDocumentFileName = (value, fallback = 'document') => {
  const rawValue = String(value || fallback).trim()
  const extension = path.extname(rawValue).toLowerCase()
  const normalizedValue = rawValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const baseWithoutExtension = normalizedValue.replace(new RegExp(`${escapeRegExp(extension || '')}$`), '')
  const base = baseWithoutExtension
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

  const safeBase = base || String(fallback).trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'document'

  return `${safeBase.slice(0, 90)}${extension || '.pdf'}`
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
