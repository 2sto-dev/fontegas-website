import test from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'
import jwt from 'jsonwebtoken'
import { createAdminAuth } from '../jwt-auth.js'

const secret = 'test-only-secret-for-jwt-route-verification'
const { signAdminToken, requireAdminAuth } = createAdminAuth(secret)

test('protected routes verify signature, expiry and administrator role', async (t) => {
  const app = express()
  app.get('/private', requireAdminAuth, (req, res) => res.json({ username: req.admin.username }))
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance))
  })
  t.after(() => new Promise((resolve) => server.close(resolve)))
  const url = `http://127.0.0.1:${server.address().port}/private`
  const claims = { username: 'admin', role: 'admin' }
  const cases = [
    ['missing token', '', 401],
    ['malformed token', 'invalid', 401],
    ['wrong signature', jwt.sign(claims, 'another-secret', { expiresIn: '1h' }), 401],
    ['expired token', jwt.sign(claims, secret, { expiresIn: -1 }), 401],
    ['missing expiry', jwt.sign(claims, secret), 401],
    ['wrong algorithm', jwt.sign(claims, secret, { algorithm: 'HS384', expiresIn: '1h' }), 401],
    ['non-admin role', jwt.sign({ ...claims, role: 'user' }, secret, { expiresIn: '1h' }), 403],
    ['missing username', jwt.sign({ role: 'admin' }, secret, { expiresIn: '1h' }), 401],
    ['valid administrator', signAdminToken('admin'), 200],
  ]
  for (const [name, token, status] of cases) {
    await t.test(name, async () => {
      const response = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      assert.equal(response.status, status)
      const body = await response.json()
      if (status === 200) assert.equal(body.username, 'admin')
      else assert.equal(body.ok, false)
    })
  }
})

test('JWT configuration requires an explicit secret', () => {
  assert.throws(() => createAdminAuth(''), /JWT_SECRET/)
})
