import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ContactPage from './pages/ContactPage.jsx'
import OfertaPage from './pages/OfertaPage.jsx'
import PlanUrgentaPage from './pages/PlanUrgentaPage.jsx'
import UtilPage from './pages/UtilPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DocumentsPage from './pages/DocumentsPage.jsx'

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
        <Route path="/fontegas/login" element={<AdminPage loginOnly />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/fontegas" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
