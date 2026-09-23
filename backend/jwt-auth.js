import jwt from 'jsonwebtoken'

export function createAdminAuth(secret) {
  if (!secret) throw new Error('JWT_SECRET must be configured.')

  const signAdminToken = (username) => jwt.sign(
    { username, role: 'admin' }, secret, { algorithm: 'HS256', expiresIn: '8h' },
  )

  const requireAdminAuth = (req, res, next) => {
    const token = /^Bearer\s+(\S+)$/i.exec(String(req.headers.authorization || ''))?.[1]
    if (!token) return res.status(401).json({ ok: false, message: 'Autentificare necesară.' })
    try {
      const claims = jwt.verify(token, secret, { algorithms: ['HS256'] })
      if (!Number.isFinite(claims.exp) || typeof claims.username !== 'string' || !claims.username) {
        return res.status(401).json({ ok: false, message: 'Token invalid sau expirat.' })
      }
      if (claims.role !== 'admin') {
        return res.status(403).json({ ok: false, message: 'Acces rezervat administratorului.' })
      }
      req.admin = claims
      return next()
    } catch {
      return res.status(401).json({ ok: false, message: 'Token invalid sau expirat.' })
    }
  }

  return { signAdminToken, requireAdminAuth }
}
