import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Receipt,
  Building2,
  Wallet,
  BookOpenCheck,
  Rocket,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock3,
  BadgeCheck,
  Sparkles,
  Users,
  FolderCheck,
  X,
  Send,
  Plane,
  Video,
} from 'lucide-react';
import { services } from '../data/services';
import { API_BASE_URL } from '../config/api';
import Seo from '../components/Seo';
import './Services.css';

const SERVICES_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Accounting Services — EasyAcct',
  itemListElement: [
    { '@type': 'Service', position: 1, name: 'Individual Tax Return Preparation', areaServed: 'Massachusetts, US', provider: { '@type': 'AccountingService', name: 'EasyAcct' } },
    { '@type': 'Service', position: 2, name: 'Business Tax Return Preparation', areaServed: 'Massachusetts, US', provider: { '@type': 'AccountingService', name: 'EasyAcct' } },
    { '@type': 'Service', position: 3, name: 'Payroll Services', areaServed: 'Massachusetts, US', provider: { '@type': 'AccountingService', name: 'EasyAcct' } },
    { '@type': 'Service', position: 4, name: 'Bookkeeping', areaServed: 'Massachusetts, US', provider: { '@type': 'AccountingService', name: 'EasyAcct' } },
    { '@type': 'Service', position: 5, name: 'New Business Registration', areaServed: 'Massachusetts, US', provider: { '@type': 'AccountingService', name: 'EasyAcct' } },
    { '@type': 'Service', position: 6, name: 'Immigration Services', areaServed: 'United States', provider: { '@type': 'AccountingService', name: 'EasyAcct' } },
  ],
};

const icons = {
  'individual-tax-return': Receipt,
  'business-tax-return': Building2,
  payroll: Wallet,
  'book-keeping': BookOpenCheck,
  'new-business-registration': Rocket,
  'immigration-services': Plane,
};

const fallbackImages = {
  'individual-tax-return': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  'business-tax-return': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  payroll: 'https://images.unsplash.com/photo-1553729459-uj8gh0e6e3li?auto=format&fit=crop&w=800&q=80',
  'book-keeping': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  'new-business-registration': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
  'immigration-services': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
};

const deliveryPillars = [
  { icon: ShieldCheck, title: 'Compliance First', text: 'Every filing, report, and registration handled with accuracy and full regulatory review.' },
  { icon: Clock3, title: 'Fast Turnaround', text: 'Responsive communication, deadline tracking, and steady progress without chasing updates.' },
  { icon: Users, title: 'Personal Support', text: 'Advice stays simple and human â€” whether you are an individual or a growing business.' },
];

const deliverySteps = [
  { icon: Sparkles, title: 'Share Your Situation', text: 'Tell us what you need, what is pending, and where you want support right now.' },
  { icon: FolderCheck, title: 'We Build the Plan', text: 'We map the filing path, documents, deadlines, and service scope before work begins.' },
  { icon: BadgeCheck, title: 'Stay Fully Handled', text: 'We complete the work, keep you updated, and make sure the final result is ready to use.' },
];

const initialForm = { name: '', email: '', phone: '', service: '', message: '', meeting_type: 'Google Meet' };

function ApplyModal({ selectedService, onClose }) {
  const [form, setForm] = useState({ ...initialForm, service: selectedService || '' });
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    setForm(f => ({ ...f, service: selectedService || '' }));
  }, [selectedService]);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const firstError = payload?.errors ? Object.values(payload.errors).flat()[0] : null;
        throw new Error(firstError || payload?.message || 'Unable to send your message right now.');
      }
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className="modal-panel">

        {sent ? (
          <div className="modal-success">
            <div className="modal-success__icon">
              <Check size={36} />
            </div>
            <h3>Application Sent!</h3>
            <p>Thanks! Your inquiry has been received and the team will respond within 24 working hours.</p>
            <button className="modal-submit-btn" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            {/* Dark premium header */}
            <div className="modal-header">
              <button className="modal-close" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
              <span className="modal-eyebrow">Apply Now</span>
              <h3 className="modal-title">Get Started with Our Services</h3>
              <p className="modal-sub">Fill in your details and we'll get back to you within one business day.</p>
            </div>

            {/* Form body */}
            <div className="modal-form-body">
              {error && <div className="modal-error" role="alert">{error}</div>}

              <form className="modal-form" onSubmit={onSubmit}>
                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label htmlFor="modal-name">Full Name</label>
                    <input id="modal-name" name="name" required value={form.name} onChange={onChange} placeholder="Jane Doe" />
                  </div>
                  <div className="modal-form-group">
                    <label htmlFor="modal-phone">Phone Number</label>
                    <input id="modal-phone" name="phone" required value={form.phone} onChange={onChange} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div className="modal-form-group">
                  <label htmlFor="modal-email">Email Address</label>
                  <input id="modal-email" name="email" type="email" required value={form.email} onChange={onChange} placeholder="jane@example.com" />
                </div>

                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label htmlFor="modal-service">Service of Interest</label>
                    <select id="modal-service" name="service" value={form.service} onChange={onChange} required>
                      <option value="">Select a service...</option>
                      {services.map(s => (
                        <option key={s.slug} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-form-group" style={{ marginTop: '0.5rem' }}>
                  <label>Meeting Type</label>
                  <div className="meeting-type-grid">
                    <div 
                      className={`meeting-type-card ${form.meeting_type === 'Google Meet' ? 'selected' : ''}`}
                      onClick={() => setForm({...form, meeting_type: 'Google Meet'})}
                    >
                      <Video size={20} />
                      <span>Google Meet</span>
                    </div>
                    <div 
                      className={`meeting-type-card ${form.meeting_type === 'Office Visit' ? 'selected' : ''}`}
                      onClick={() => setForm({...form, meeting_type: 'Office Visit'})}
                    >
                      <Building2 size={20} />
                      <span>Office Visit</span>
                    </div>
                  </div>
                </div>

                <div className="modal-form-group">
                  <label htmlFor="modal-message">How can we help?</label>
                  <textarea id="modal-message" name="message" rows="3" value={form.message} onChange={onChange} placeholder="Tell us about your situation..." required />
                </div>

                <button type="submit" className="modal-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Submit Application'}
                  <Send size={16} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>

  );
}

export default function Services() {
  const [modalService, setModalService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (serviceName) => {
    setModalService(serviceName);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalService(null);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.srv-reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 70}ms`;
      observer.observe(el);
    });

    const handleScroll = () => {
      const ctaSection = document.querySelector('.srv-cta');
      const ctaBg = document.querySelector('.srv-cta__bg');
      if (ctaSection && ctaBg) {
        const rect = ctaSection.getBoundingClientRect();
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const clamped = Math.max(0, Math.min(progress, 1));
        const parallaxOffset = (clamped - 0.5) * 100;
        ctaBg.style.transform = `translate3d(0, ${parallaxOffset}px, 0) scale(1.15)`;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to specific service card if navigated from home with a slug
  const location = useLocation();
  useEffect(() => {
    const slug = location.state?.scrollTo;
    if (!slug) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-slug="${slug}"]`);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
        el.style.outline = '3px solid var(--gold-400)';
        el.style.outlineOffset = '4px';
        setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 2000);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [location.state]);


  return (
    <>
      {/* ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ SERVICE CARDS GRID ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ */}
      <Seo
        title="Accounting Services in Medford, MA | Tax, Payroll, Bookkeeping"
        description="Tax preparation, payroll, bookkeeping, business registration, and immigration filings for individuals and businesses in Medford, MA and the Boston area."
        path="/services"
        jsonLd={SERVICES_JSON_LD}
      />
      <section className="srv-section srv-section--soft" id="service-offerings" style={{ paddingTop: 'calc(72px + clamp(1.5rem, 4vw, 3rem))' }}>
        <div className="srv-container">
          {/* Page Header */}
          <div className="srv-page-head srv-reveal">
            <h1 className="srv-page-h1">
              Comprehensive services &amp;
              <span className="srv-page-h1__script">solutions we offer</span>
            </h1>
            <p className="srv-page-sub">
              Explore all six core services we deliver for individuals, founders, and growing
              businesses that want reliable support and clear financial advice.
            </p>
          </div>
          <div className="srv-grid">
            {services.map((service, index) => {
              const Icon = icons[service.slug] || Receipt;
              const img = fallbackImages[service.slug];

              return (
                <article className="srv-card srv-reveal" key={service.slug}
                  data-slug={service.slug}
                  style={{ '--card-color': service.color || 'var(--forest-600)' }}>


                  {/* Image */}
                  <div className="srv-card__media">
                    <img
                      src={img}
                      alt={service.title}
                      loading="lazy"
                      onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImages['individual-tax-return']; }}
                    />
                    <div className="srv-card__media-overlay" />
                    <span className="srv-card__chip">{service.chip}</span>
                    <span className="srv-card__num">0{index + 1}</span>
                  </div>

                  {/* Body */}
                  <div className="srv-card__body">
                    <div className="srv-card__icon">
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                    <h3 className="srv-card__title">{service.title}</h3>
                    <p className="srv-card__desc">{service.description}</p>

                    <ul className="srv-card__features">
                      {service.features.map(f => (
                        <li key={f}>
                          <span className="srv-card__check"><Check size={12} strokeWidth={2.5} /></span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="srv-card__footer">
                      <button
                        className="srv-apply-btn"
                        onClick={() => openModal(service.title)}
                      >
                        Book Appointment <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Hover accent bar */}
                  <div className="srv-card__accent-bar" />
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="srv-cta">
        <div className="srv-cta__bg" />
        <div className="srv-cta__overlay" />
        <div className="srv-cta__dots" />
        <div className="srv-container srv-cta__inner">
          <div className="srv-cta__left srv-reveal">
            <span className="srv-eyebrow srv-eyebrow--light">Need Guidance?</span>
            <h2 className="srv-cta__h2">Not sure which service fits best?</h2>
            <p className="srv-cta__p">
              Tell us your situation and we will recommend the right service path in a
              free consultation call.
            </p>
          </div>
          <div className="srv-cta__actions srv-reveal">
            <button className="srv-cta-btn" onClick={() => openModal('')}>
              Talk to an Expert <ArrowRight size={18} />
            </button>
            <div className="srv-cta-badge">
              <ShieldCheck size={18} />
              Trusted guidance for personal &amp; business finance
            </div>
          </div>
        </div>
      </section>

      {/* APPLY MODAL */}
      {modalOpen && (
        <ApplyModal selectedService={modalService} onClose={closeModal} />
      )}
    </>
  );
}
