import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { normalizeCategory, sanitizeDocumentFileName } from './document-utils.js'
import { hashPassword, verifyPassword } from './admin-auth.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')
const FILE_STORAGE_DIR = path.join(PROJECT_ROOT, 'uploads')
fs.mkdirSync(FILE_STORAGE_DIR, { recursive: true })

const app = express()
const port = Number(process.env.PORT || 5000)
const isProduction = process.env.NODE_ENV === 'production'
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map((origin) => origin.trim()).filter(Boolean)
const ADMIN_USERNAME = process.env.FONTEGAS_ADMIN_USERNAME || 'fontegas'
const ADMIN_PASSWORD = process.env.FONTEGAS_ADMIN_PASSWORD || 'Zx7!mP9&dQ2@vN5$L'
const JWT_SECRET = process.env.JWT_SECRET || 'fontegas-jwt-secret-change-me-in-production'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'fontegas_app',
  password: process.env.DB_PASSWORD || 'AppPass123!',
  database: process.env.DB_NAME || 'fontegas_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

if (isProduction) {
  app.set('trust proxy', 1)
}

app.use(helmet())

app.use((req, res, next) => {
  const origin = req.headers.origin

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${origin || 'no-origin'} ${req.ip}`)
  next()
})

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origin not allowed by CORS'))
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(express.json({ limit: '1mb' }))

const fileStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, FILE_STORAGE_DIR)
  },
  filename: (_req, file, callback) => {
    const safeName = sanitizeDocumentFileName(file.originalname || 'document')
    callback(null, `${Date.now()}-${safeName}`)
  },
})

const upload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const allowedExtensions = new Set(['.pdf', '.doc', '.docx'])
    const extension = path.extname(file.originalname || '').toLowerCase()

    if (!allowedExtensions.has(extension)) {
      callback(new Error('Tip de fișier nepermis.'))
      return
    }

    callback(null, true)
  },
})

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Prea multe încercări. Încercați din nou peste câteva minute.',
  },
})

app.use('/api/lead', formLimiter)
app.use('/api/contact', formLimiter)

const normalizeString = (value) => String(value || '').trim()

const trimText = (value, maxLength = 1000) => {
  const text = normalizeString(value)
  return text.length > maxLength ? text.slice(0, maxLength) : text
}

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeString(value))

const isValidPhone = (value) => {
  const digits = normalizeString(value).replace(/\D/g, '')
  return digits.length >= 8 && digits.length <= 15
}

const parsePositiveInt = (value) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

const signAdminToken = (username = ADMIN_USERNAME) => jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' })

const requireAdminAuth = (req, res, next) => {
  const authorization = String(req.headers.authorization || '')
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : ''

  if (!token) {
    return res.status(401).json({ ok: false, message: 'Autentificare necesară.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.admin = decoded
    return next()
  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Token invalid sau expirat.' })
  }
}

const resolveFullName = (...parts) =>
  parts
    .map((part) => normalizeString(part))
    .filter(Boolean)
    .join(' ')

const getAllowedSort = (value, fallback = 'created_at DESC') => {
  const allowed = {
    newest: 'created_at DESC',
    oldest: 'created_at ASC',
    name_asc: 'contact_name ASC',
    name_desc: 'contact_name DESC',
  }

  return allowed[value] || fallback
}

const ensureTableExists = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id INT NOT NULL AUTO_INCREMENT,
      company_name VARCHAR(255) DEFAULT NULL,
      contact_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) DEFAULT NULL,
      requirement TEXT NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL DEFAULT 'general',
      file_name VARCHAR(255) NOT NULL,
      file_type VARCHAR(50) DEFAULT 'pdf',
      is_published TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_documents_file_name (file_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(80) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_admin_users_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
}

const ensureAdminUserRecord = async () => {
  const passwordHash = await hashPassword(ADMIN_PASSWORD)

  await pool.execute(
    `
      INSERT INTO admin_users (username, password_hash)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        password_hash = VALUES(password_hash),
        updated_at = CURRENT_TIMESTAMP
    `,
    [ADMIN_USERNAME, passwordHash],
  )

  if (ADMIN_USERNAME !== 'fontegas_admin') {
    await pool.execute("DELETE FROM admin_users WHERE username = 'fontegas_admin'")
  }
}

const normalizeDocumentTitle = (fileName) =>
  fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()

const documentCatalog = [
  { fileName: 'model-inf-publica.pdf', title: 'Model informații publice', category: 'documente' },
  { fileName: 'PLAN-DE-URGENTA-INTERNA.doc', title: 'Plan de urgență internă', category: 'urgenta' },
  { fileName: 'raport inspectie 23.05.2025.pdf', title: 'Raport inspecție 23.05.2025', category: 'inspectie' },
  { fileName: 'raport-securitate-2020-2.pdf', title: 'Raport de securitate 2020', category: 'securitate' },
  { fileName: 'raport-securitate-2020.pdf', title: 'Raport de securitate 2020 (variantă)', category: 'securitate' },
  { fileName: 'raport_inspectie.docx', title: 'Raport inspecție', category: 'inspectie' },
  { fileName: 'raport_inspectie_seveso.pdf', title: 'Raport inspecție Seveso', category: 'inspectie' },
  { fileName: 'svso2026.pdf', title: 'SVSO 2026', category: 'securitate' },
]

const buildFallbackDocumentData = () =>
  documentCatalog.map((document, index) => ({
    id: index + 1,
    title: document.title || normalizeDocumentTitle(document.fileName),
    category: document.category,
    fileName: document.fileName,
    fileType: path.extname(document.fileName).replace('.', '').toLowerCase() || 'pdf',
    isPublished: 1,
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    downloadUrl: `/files/${encodeURIComponent(document.fileName)}`,
  }))

const seedProjectDocuments = async () => {
  for (const document of documentCatalog) {
    const filePath = path.join(PROJECT_ROOT, document.fileName)
    if (!fs.existsSync(filePath)) {
      continue
    }

    const fileType = path.extname(document.fileName).replace('.', '').toLowerCase() || 'pdf'
    const title = document.title || normalizeDocumentTitle(document.fileName)

    const [existing] = await pool.query('SELECT id FROM documents WHERE file_name = ?', [document.fileName])
    if (existing.length > 0) {
      continue
    }

    await pool.execute(
      'INSERT INTO documents (title, category, file_name, file_type, is_published) VALUES (?, ?, ?, ?, 1)',
      [title, document.category, document.fileName, fileType],
    )
  }
}

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1 AS ok')

    res.json({
      ok: true,
      message: 'Fontegas backend is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Database connection failed',
      error: error.message,
    })
  }
})

app.get('/api', (req, res) => {
  res.json({
    name: 'Fontegas backend',
    version: '1.0.0',
    status: 'ready',
  })
})

app.use((err, req, res, next) => {
  if (err?.message === 'Origin not allowed by CORS') {
    console.warn(`CORS blocked: ${req.method} ${req.originalUrl} from ${req.headers.origin || 'unknown origin'}`)
    return res.status(403).json({ ok: false, message: 'Origin not allowed.' })
  }

  if (err?.type === 'entity.parse.failed') {
    console.warn(`Malformed JSON request: ${req.method} ${req.originalUrl} from ${req.ip}`)
    return res.status(400).json({ ok: false, message: 'Request body is invalid JSON.' })
  }

  console.error('Unhandled backend error:', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    message: err?.message,
  })

  return res.status(500).json({ ok: false, message: 'Internal server error.' })
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const username = trimText(req.body?.username || '', 80)
    const password = String(req.body?.password || '')

    if (!username || !password) {
      return res.status(400).json({ ok: false, message: 'Username și parola sunt obligatorii.' })
    }

    const [userRows] = await pool.execute(
      'SELECT username, password_hash AS passwordHash FROM admin_users WHERE username = ? LIMIT 1',
      [username],
    )

    if (userRows.length === 0) {
      return res.status(401).json({ ok: false, message: 'Date de autentificare incorecte.' })
    }

    const storedUser = userRows[0]
    const isPasswordValid = await verifyPassword(password, storedUser.passwordHash)

    if (!isPasswordValid) {
      return res.status(401).json({ ok: false, message: 'Date de autentificare incorecte.' })
    }

    return res.json({
      ok: true,
      token: signAdminToken(storedUser.username),
      user: {
        username: storedUser.username,
        role: 'admin',
      },
    })
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Autentificarea a eșuat.', error: error.message })
  }
})

app.get('/api/requests', requireAdminAuth, async (req, res) => {
  try {
    const sortValue = String(req.query.sort || 'newest')
    const search = trimText(req.query.search || '', 80)
    const orderBy = getAllowedSort(sortValue)

    let query = `
      SELECT id, company_name AS companyName, contact_name AS contactName, email, phone, requirement, created_at AS createdAt
      FROM leads
    `

    const params = []

    if (search) {
      query += ` WHERE contact_name LIKE ? OR email LIKE ? OR phone LIKE ? OR company_name LIKE ?`
      const pattern = `%${search}%`
      params.push(pattern, pattern, pattern, pattern)
    }

    query += ` ORDER BY ${orderBy}`

    const [rows] = await pool.execute(query, params)

    res.json({ ok: true, data: rows })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Nu s-au putut încărca cererile.',
      error: error.message,
    })
  }
})

app.delete('/api/requests/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id)

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: 'ID invalid.',
      })
    }

    const [result] = await pool.execute('DELETE FROM leads WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Cererea nu a fost găsită.',
      })
    }

    return res.json({
      ok: true,
      message: 'Cererea a fost ștearsă.',
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'A apărut o eroare la ștergerea cererii.',
      error: error.message,
    })
  }
})

app.delete('/api/leads/:id', async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id)

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: 'ID invalid.',
      })
    }

    const [result] = await pool.execute('DELETE FROM leads WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Lead-ul nu a fost găsit.',
      })
    }

    return res.json({
      ok: true,
      message: 'Lead-ul a fost șters.',
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'A apărut o eroare la ștergerea lead-ului.',
      error: error.message,
    })
  }
})

app.get('/api/documents', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, category, file_name AS fileName, file_type AS fileType, is_published AS isPublished, created_at AS createdAt FROM documents WHERE is_published = 1 ORDER BY created_at DESC',
    )

    const data = rows.map((item) => ({
      ...item,
      downloadUrl: `/files/${encodeURIComponent(item.fileName)}`,
    }))

    return res.json({ ok: true, data })
  } catch (error) {
    const fallbackData = buildFallbackDocumentData()
    return res.json({ ok: true, data: fallbackData, fallback: true })
  }
})

app.get('/api/documents/admin', requireAdminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, category, file_name AS fileName, file_type AS fileType, is_published AS isPublished, created_at AS createdAt FROM documents ORDER BY created_at DESC',
    )

    return res.json({
      ok: true,
      data: rows.map((item) => ({
        ...item,
        downloadUrl: `/files/${encodeURIComponent(item.fileName)}`,
      })),
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Nu s-au putut încărca documentele din admin.',
      error: error.message,
    })
  }
})

app.post('/api/documents', requireAdminAuth, upload.single('file'), async (req, res) => {
  try {
    const uploadedFile = req.file

    if (!uploadedFile) {
      return res.status(400).json({ ok: false, message: 'Selectați un fișier pentru upload.' })
    }

    const title = trimText(req.body.title || '', 255) || normalizeDocumentTitle(path.basename(uploadedFile.originalname, path.extname(uploadedFile.originalname)))
    const category = normalizeCategory(req.body.category || 'documente')
    const isPublished = String(req.body.isPublished ?? 'true').toLowerCase() === 'false' ? 0 : 1
    const fileName = uploadedFile.filename
    const fileType = path.extname(uploadedFile.originalname || uploadedFile.filename).replace('.', '').toLowerCase() || 'pdf'

    const [result] = await pool.execute(
      'INSERT INTO documents (title, category, file_name, file_type, is_published) VALUES (?, ?, ?, ?, ?)',
      [title, category, fileName, fileType, isPublished],
    )

    return res.status(201).json({
      ok: true,
      message: 'Documentul a fost încărcat cu succes.',
      data: {
        id: result.insertId,
        title,
        category,
        fileName,
        fileType,
        isPublished,
        createdAt: new Date().toISOString(),
        downloadUrl: `/files/${encodeURIComponent(fileName)}`,
      },
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'A apărut o eroare la încărcarea documentului.',
      error: error.message,
    })
  }
})

app.put('/api/documents/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id)

    if (!id) {
      return res.status(400).json({ ok: false, message: 'ID invalid.' })
    }

    const [existingRows] = await pool.execute('SELECT id, title, category, file_name AS fileName, file_type AS fileType, is_published AS isPublished FROM documents WHERE id = ?', [id])

    if (existingRows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Documentul nu a fost găsit.' })
    }

    const current = existingRows[0]
    const title = trimText(req.body.title || current.title, 255)
    const category = normalizeCategory(req.body.category || current.category)
    const isPublished = [0, 1].includes(Number(req.body.isPublished ?? current.isPublished))
      ? Number(req.body.isPublished ?? current.isPublished)
      : Number(current.isPublished)

    await pool.execute(
      'UPDATE documents SET title = ?, category = ?, is_published = ? WHERE id = ?',
      [title, category, isPublished, id],
    )

    return res.json({
      ok: true,
      message: 'Documentul a fost actualizat.',
      data: {
        ...current,
        title,
        category,
        isPublished,
      },
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'A apărut o eroare la actualizarea documentului.',
      error: error.message,
    })
  }
})

app.delete('/api/documents/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id)

    if (!id) {
      return res.status(400).json({ ok: false, message: 'ID invalid.' })
    }

    const [rows] = await pool.execute('SELECT file_name AS fileName FROM documents WHERE id = ?', [id])

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Documentul nu a fost găsit.' })
    }

    const fileName = rows[0].fileName
    const [result] = await pool.execute('DELETE FROM documents WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'Documentul nu a fost găsit.' })
    }

    const candidatePaths = [
      path.join(FILE_STORAGE_DIR, fileName),
      path.join(PROJECT_ROOT, fileName),
    ]

    for (const candidatePath of candidatePaths) {
      try {
        if (fs.existsSync(candidatePath)) {
          fs.unlinkSync(candidatePath)
        }
      } catch (deleteError) {
        console.warn('Unable to delete uploaded document file:', deleteError.message)
      }
    }

    return res.json({ ok: true, message: 'Documentul a fost șters.' })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'A apărut o eroare la ștergerea documentului.',
      error: error.message,
    })
  }
})

app.get('/files/:fileName', (req, res) => {
  try {
    const rawName = decodeURIComponent(req.params.fileName || '')
    const allowedExtensions = new Set(['.pdf', '.doc', '.docx'])
    const extension = path.extname(rawName).toLowerCase()

    if (!rawName || !allowedExtensions.has(extension)) {
      return res.status(400).json({ ok: false, message: 'Tip de fișier nepermis.' })
    }

    const legacyPath = path.resolve(PROJECT_ROOT, rawName)
    const uploadedPath = path.resolve(FILE_STORAGE_DIR, rawName)
    const safeFilePath = fs.existsSync(uploadedPath) ? uploadedPath : legacyPath

    if (!safeFilePath.startsWith(PROJECT_ROOT) || !fs.existsSync(safeFilePath)) {
      return res.status(404).json({ ok: false, message: 'Fișierul nu a fost găsit.' })
    }

    return res.download(safeFilePath)
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Eroare la accesarea fișierului.', error: error.message })
  }
})

app.get('/api/leads', async (req, res) => {
  try {
    const sortValue = String(req.query.sort || 'newest')
    const search = trimText(req.query.search || '', 80)
    const orderBy = getAllowedSort(sortValue, 'created_at DESC')

    let query = `
      SELECT id, company_name AS companyName, contact_name AS contactName, email, phone, requirement, created_at AS createdAt
      FROM leads
    `
    const params = []

    if (search) {
      query += ` WHERE contact_name LIKE ? OR email LIKE ? OR phone LIKE ? OR company_name LIKE ?`
      const pattern = `%${search}%`
      params.push(pattern, pattern, pattern, pattern)
    }

    query += ` ORDER BY ${orderBy}`

    const [rows] = await pool.execute(query, params)

    res.json({ ok: true, data: rows })
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Nu s-au putut încărca lead-urile.',
      error: error.message,
    })
  }
})

app.post('/api/contact', async (req, res) => {
  try {
    const body = req.body || {}
    const fullName = resolveFullName(body.fullName, body.Nume, body.Prenume)
    const email = trimText(body.email || body.EmailFrom, 255)
    const phone = trimText(body.phone || body.Telefon, 50)
    const message = trimText(body.message || body.Mesaj, 2000)

    if (!fullName || fullName.length < 2 || fullName.length > 120) {
      return res.status(400).json({
        ok: false,
        message: 'Numele este obligatoriu și trebuie să aibă între 2 și 120 de caractere.',
      })
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        ok: false,
        message: 'Email invalid.',
      })
    }

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        ok: false,
        message: 'Telefon invalid.',
      })
    }

    if (!message || message.length < 5) {
      return res.status(400).json({
        ok: false,
        message: 'Mesajul este obligatoriu.',
      })
    }

    const [result] = await pool.execute(
      'INSERT INTO leads (company_name, contact_name, email, phone, requirement) VALUES (?, ?, ?, ?, ?)',
      [null, fullName, email, phone || null, message],
    )

    return res.status(201).json({
      ok: true,
      message: 'Mesajul a fost salvat cu succes.',
      id: result.insertId,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'A apărut o eroare la salvarea mesajului.',
      error: error.message,
    })
  }
})

app.post('/api/lead', async (req, res) => {
  try {
    const body = req.body || {}
    const companyName = trimText(body.companyName || body.CompanyName, 255)
    const contactName = trimText(resolveFullName(body.contactName, body.Nume, body.Prenume), 120)
    const email = trimText(body.email || body.EmailFrom, 255)
    const phone = trimText(body.phone || body.Telefon, 50)
    const requirement = trimText(body.requirement || body.Mesaj, 2000)

    if (!contactName || contactName.length < 2 || contactName.length > 120) {
      return res.status(400).json({
        ok: false,
        message: 'Numele este obligatoriu și trebuie să aibă între 2 și 120 de caractere.',
      })
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        ok: false,
        message: 'Email invalid.',
      })
    }

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        ok: false,
        message: 'Telefon invalid.',
      })
    }

    if (!requirement || requirement.length < 5) {
      return res.status(400).json({
        ok: false,
        message: 'Cererea este obligatorie.',
      })
    }

    const [result] = await pool.execute(
      'INSERT INTO leads (company_name, contact_name, email, phone, requirement) VALUES (?, ?, ?, ?, ?)',
      [companyName || null, contactName, email, phone || null, requirement],
    )

    return res.status(201).json({
      ok: true,
      message: 'Solicitarea a fost înregistrată.',
      id: result.insertId,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'A apărut o eroare la salvarea solicitării.',
      error: error.message,
    })
  }
})

const startServer = async () => {
  try {
    await ensureTableExists()
    await ensureAdminUserRecord()
    await seedProjectDocuments()
  } catch (error) {
    console.warn('Database bootstrap unavailable; continuing with filesystem-backed document mode.', error.message)
  }

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`)
  })
}

startServer()
