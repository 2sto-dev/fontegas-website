import test from 'node:test'
import assert from 'node:assert/strict'

import { sanitizeDocumentFileName, normalizeCategory } from '../document-utils.js'

test('sanitizeDocumentFileName keeps a safe filename and extension', () => {
  const sanitized = sanitizeDocumentFileName(' Plan de urgență 2025.pdf ')

  assert.equal(sanitized, 'plan-de-urgenta-2025.pdf')
})

test('normalizeCategory falls back to a safe default name', () => {
  assert.equal(normalizeCategory('   '), 'documente')
  assert.equal(normalizeCategory('Seguridad'), 'seguridad')
})
