import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ContactPage from './pages/ContactPage.jsx'
import OfertaPage from './pages/OfertaPage.jsx'
import PlanUrgentaPage from './pages/PlanUrgentaPage.jsx'
import UtilPage from './pages/UtilPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DocumentsPage from './pages/DocumentsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

// Panoul de administrare il vede un singur om, dar pana acum se descarca la
// fiecare vizitator. Incarcat separat, iese din pachetul paginii publice.
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'))

const IncarcareAdmin = () => (
  <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: '#17332d' }}>
    Se încarcă…
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/oferta" element={<OfertaPage />} />
        <Route path="/util" element={<UtilPage />} />
        <Route path="/plan-de-urgenta" element={<PlanUrgentaPage />} />
        <Route path="/documente" element={<DocumentsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/fontegas/login"
          element={
            <Suspense fallback={<IncarcareAdmin />}>
              <AdminPage loginOnly />
            </Suspense>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/fontegas"
            element={
              <Suspense fallback={<IncarcareAdmin />}>
                <AdminPage />
              </Suspense>
            }
          />
        </Route>
        {/* Prinde orice adresa care nu a fost potrivita mai sus. Fara ea,
            React Router nu randa nimic si pagina ramanea alba. */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
