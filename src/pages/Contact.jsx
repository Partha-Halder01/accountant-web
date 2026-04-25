import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Check, Send, Sparkles } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', service:'', message:'' });
  const [sent, setSent]   = useState(false);
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = e => { e.preventDefault(); setSent(true); };

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

    document.querySelectorAll('.reveal-up').forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="contact-page">
      <header className="contact-header reveal-up">
        <div className="hc">
          <h1 className="contact-h1">
            Let’s Talk About
            <i className="contact-script">Your Numbers</i>
          </h1>
          <p className="contact-sub">
            Free 20-minute consultation. No obligations, no sales pitch — just clear advice from certified professionals.
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
                  <div className="info-icon"><MapPin size={24}/></div>
                  <div className="info-text">
                    <b>Our Office</b>
                    <span>43 High St, 2nd Floor, Medford, MA 02155</span>
                  </div>
                </div>
              </div>

              <div className="bcard contact-info-card">
                <div className="bcard__bg-num">02</div>
                <div className="contact-info-item">
                  <div className="info-icon"><Phone size={24}/></div>
                  <div className="info-text">
                    <b>Direct Line</b>
                    <span>617-412-8999</span>
                  </div>
                </div>
              </div>

              <div className="bcard contact-info-card">
                <div className="bcard__bg-num">03</div>
                <div className="contact-info-item">
                  <div className="info-icon"><Mail size={24}/></div>
                  <div className="info-text">
                    <b>Email Support</b>
                    <span>info@easyacct.us</span>
                  </div>
                </div>
              </div>

              <div className="bcard contact-info-card">
                <div className="bcard__bg-num">04</div>
                <div className="contact-info-item">
                  <div className="info-icon"><Clock size={24}/></div>
                  <div className="info-text">
                    <b>Working Hours</b>
                    <span>Mon–Fri · 9:00 AM – 6:00 PM</span>
                  </div>
                </div>
              </div>
            </aside>

            <div className="contact-form-container reveal-up">
              <form className="premium-form" onSubmit={onSubmit}>
                {sent ? (
                  <div className="form-success">
                    <div className="success-icon"><Check size={40}/></div>
                    <h3>Message Sent!</h3>
                    <p>Thanks, {form.name}! We've received your inquiry and will reach out within 24 working hours.</p>
                    <button type="button" onClick={() => setSent(false)} className="hero__btn-primary">Send Another</button>
                  </div>
                ) : (
                  <>
                    <div className="form-header">
                      <h3>Send Secure Message</h3>
                      <p>Your data is encrypted and handled with care.</p>
                    </div>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input name="name" required value={form.name} onChange={onChange} placeholder="Jane Doe"/>
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input name="phone" required value={form.phone} onChange={onChange} placeholder="+1 (555) 000-0000"/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <input name="email" type="email" required value={form.email} onChange={onChange} placeholder="jane@example.com"/>
                    </div>

                    <div className="form-group">
                      <label>Service of Interest</label>
                      <select name="service" value={form.service} onChange={onChange} required>
                        <option value="">Select a service…</option>
                        <option>Individual Tax Return</option>
                        <option>Business Tax Return</option>
                        <option>Payroll & Bookkeeping</option>
                        <option>New Business Registration</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>How can we help?</label>
                      <textarea name="message" rows="4" value={form.message} onChange={onChange}
                        placeholder="Tell us about your situation…" required/>
                    </div>

                    <button type="submit" className="hero__btn-primary full-width">
                      Send Secure Message
                      <Send size={18} />
                    </button>
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
