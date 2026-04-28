import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FileText, Check, X, Send, Video, Building2 } from 'lucide-react';
import { services } from '../data/services';
import { API_BASE_URL } from '../config/api';
import './WhatsAppButton.css';
import '../pages/Services.css'; // ensure modal styles are loaded

const defaultWhatsAppNumber = '+1 (617) 412-8999';

const normalizeWhatsAppNumber = (value) => (value || '').replace(/\D/g, '');

const initialForm = { name: '', email: '', phone: '', service: '', message: '' };

function EnquiryModal({ onClose }) {
  const [form, setForm] = useState({ ...initialForm });
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

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
            <div className="modal-header">
              <button className="modal-close" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
              <span className="modal-eyebrow">Apply Now</span>
              <h3 className="modal-title">Get Started with Our Services</h3>
              <p className="modal-sub">Fill in your details and we'll get back to you within one business day.</p>
            </div>

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

export default function WhatsAppButton({ number = defaultWhatsAppNumber }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const normalizedNumber = normalizeWhatsAppNumber(number || defaultWhatsAppNumber);
  
  // URL encoded predefined message: "Hi, I have an enquiry"
  const enquiryText = encodeURIComponent("Hi, I have an enquiry");
  const whatsappUrl = `https://wa.me/${normalizedNumber}?text=${enquiryText}`;

  return (
    <>
      <div className="floating-actions">
        <Link 
          to="/booking"
          className="enquiry-float" 
          aria-label="Open Booking Form"
          data-tooltip="Book Appointment"
        >
          <span className="enquiry-float__icon" aria-hidden="true">
            <FileText size={24} strokeWidth={2.2} />
          </span>
        </Link>

        {normalizedNumber && (
          <a
            className="whatsapp-float"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with us on WhatsApp"
            data-tooltip="Chat on WhatsApp"
          >
            <span className="whatsapp-float__icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </span>
          </a>
        )}
      </div>

      {isModalOpen && <EnquiryModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
