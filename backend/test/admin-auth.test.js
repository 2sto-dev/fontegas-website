import test from 'node:test'
import assert from 'node:assert/strict'

import { hashPassword, verifyPassword } from '../admin-auth.js'

test('hashPassword creates a bcrypt hash', async () => {
  const hash = await hashPassword('MyStrongP@ssword!2026')

  assert.ok(typeof hash === 'string')
  assert.ok(hash.startsWith('$2'))
  assert.notEqual(hash, 'MyStrongP@ssword!2026')
})

test('verifyPassword matches a stored bcrypt hash', async () => {
  const hash = await hashPassword('fontegas')

  assert.equal(await verifyPassword('fontegas', hash), true)
  assert.equal(await verifyPassword('wrong-password', hash), false)
})
