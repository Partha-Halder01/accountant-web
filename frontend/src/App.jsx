import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import { API_BASE_URL } from './config/api';

const Admin = lazy(() => import('./pages/Admin'));

const defaultWhatsAppNumber = '+1 (617) 412-8999';
const SETTINGS_CACHE_KEY = 'easyacct.publicSettings.v1';
const SETTINGS_TTL_MS = 24 * 60 * 60 * 1000;

function readCachedSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (!ts || Date.now() - ts > SETTINGS_TTL_MS) return null;
    return data;
  } catch { return null; }
}

function writeCachedSettings(data) {
  try { localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch { /* ignore */ }
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

function AppLayout() {
  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith('/admin');
  const cached = typeof window !== 'undefined' ? readCachedSettings() : null;
  const [siteSettings, setSiteSettings] = useState({
    whatsapp_number: cached?.whatsapp_number || defaultWhatsAppNumber,
  });

  useEffect(() => {
    let ignore = false;

    const fetchPublicSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/settings/public`, {
          headers: { Accept: 'application/json' },
        });
        const payload = await response.json();
        if (!response.ok || ignore) return;
        const next = {
          whatsapp_number: payload.settings?.whatsapp_number || defaultWhatsAppNumber,
        };
        setSiteSettings(next);
        writeCachedSettings(next);
      } catch {
        if (!ignore) {
          setSiteSettings({ whatsapp_number: defaultWhatsAppNumber });
        }
      }
    };

    fetchPublicSettings();
    return () => { ignore = true; };
  }, []);

  return (
    <>
      <ScrollToTop />
      {!isAdminPage && <Navbar />}
      <main className={isAdminPage ? 'admin-main' : undefined}>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about"    element={<About />} />
          <Route path="/contact"  element={<Contact whatsappNumber={siteSettings.whatsapp_number} />} />
          <Route path="/admin"    element={<Suspense fallback={<div style={{padding:'2rem',textAlign:'center'}}>Loading…</div>}><Admin /></Suspense>} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppButton number={siteSettings.whatsapp_number} />}
    </>
  );
}
