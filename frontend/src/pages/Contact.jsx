import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Check, Send } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import Seo from '../components/Seo';
import './Contact.css';

const CONTACT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  url: 'https://easyacct.us/contact',
  about: {
    '@type': 'AccountingService',
    name: 'EasyAcct',
    telephone: '+1-617-412-8999',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '43 High St, 2nd Floor',
      addressLocality: 'Medford',
      addressRegion: 'MA',
      postalCode: '02155',
      addressCountry: 'US',
    },
  },
};

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
};

export default function Contact({ whatsappNumber = '+1 (617) 412-8999' }) {
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onChange = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setSent(false);
    setError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload?.errors) {
          const firstError = Object.values(payload.errors).flat()[0];
          throw new Error(firstError || 'Unable to send your message right now.');
        }

        throw new Error(payload?.message || 'Unable to send your message right now.');
      }

      setSent(true);
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong while sending the message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-up').forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="contact-page">
      <Seo
        title="Contact EasyAcct | Accountant in Medford, MA"
        description="Reach EasyAcct in Medford, MA for tax, payroll, bookkeeping, and business registration. Call +1 (617) 412-8999 or schedule a free 20-minute consultation."
        path="/contact"
        jsonLd={CONTACT_JSON_LD}
      />
      <header className="contact-header reveal-up">
        <div className="hc">
          <h1 className="contact-h1">
            Let's Talk About
            <i className="contact-script">Your Numbers</i>
          </h1>
          <p className="contact-sub">
            Free 20-minute consultation. No obligations, no sales pitch, just clear advice
            from certified professionals.
          </p>
        </div>
      </header>

      <section className="sec" id="form">
        <div className="hc">
          <div className="contact-main-grid">
            <aside className="contact-sidebar reveal-up">
              <div className="bcard contact-info-card">
                <div className="bcard__bg-num">01</div>
                <div className="contact-info-item">
                  <div className="info-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="info-text">
                    <b>Our Office</b>
                    <span>43 High St, 2nd Floor, Medford, MA 02155</span>
                  </div>
                </div>
              </div>

              <div className="bcard contact-info-card">
                <div className="bcard__bg-num">02</div>
                <div className="contact-info-item">
                  <div className="info-icon">
                    <Phone size={24} />
                  </div>
                  <div className="info-text">
                    <b>Direct Line</b>
                    <span>{whatsappNumber}</span>
                  </div>
                </div>
              </div>

              <div className="bcard contact-info-card">
                <div className="bcard__bg-num">03</div>
                <div className="contact-info-item">
                  <div className="info-icon">
                    <Mail size={24} />
                  </div>
                  <div className="info-text">
                    <b>Email Support</b>
                    <span>info@easyacct.us</span>
                  </div>
                </div>
              </div>

              <div className="bcard contact-info-card">
                <div className="bcard__bg-num">04</div>
                <div className="contact-info-item">
                  <div className="info-icon">
                    <Clock size={24} />
                  </div>
                  <div className="info-text">
                    <b>Working Hours</b>
                    <span>Mon-Fri | 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </aside>

            <div className="contact-form-container reveal-up">
              <form className="premium-form" onSubmit={onSubmit}>
                {sent ? (
                  <div className="form-success">
                    <div className="success-icon">
                      <Check size={40} />
                    </div>
                    <h3>Message Sent!</h3>
                    <p>
                      Thanks for reaching out. Your inquiry has been saved in our admin panel and
                      the team will respond within 24 working hours.
                    </p>
                    <button type="button" onClick={resetForm} className="hero__btn-primary">
                      Send Another
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="form-header">
                      <h3>Send Secure Message</h3>
                      <p>Your data is encrypted and handled with care.</p>
                    </div>

                    {error ? (
                      <div className="form-error" role="alert">
                        {error}
                      </div>
                    ) : null}

                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          id="name"
                          name="name"
                          required
                          value={form.name}
                          onChange={onChange}
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          id="phone"
                          name="phone"
                          required
                          value={form.phone}
                          onChange={onChange}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={onChange}
                        placeholder="jane@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="service">Service of Interest</label>
                      <select
                        id="service"
                        name="service"
                        value={form.service}
                        onChange={onChange}
                      >
                        <option value="">Select a service (optional)...</option>
                        <option value="Individual Tax Return">Individual Tax Return</option>
                        <option value="Business Tax Return">Business Tax Return</option>
                        <option value="Payroll and Bookkeeping">Payroll and Bookkeeping</option>
                        <option value="New Business Registration">New Business Registration</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">How can we help?</label>
                      <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={form.message}
                        onChange={onChange}
                        placeholder="Tell us about your situation..."
                        required
                      />
                    </div>

                    <button type="submit" className="hero__btn-primary full-width" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Secure Message'}
                      <Send size={18} />
                    </button>
                    <p className="form-status">
                      Backend endpoint: <span>{API_BASE_URL}/api/contact</span>
                    </p>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
