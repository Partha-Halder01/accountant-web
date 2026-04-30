import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <div className="footer__brand">
            <picture>
              <source srcSet="/logo.webp" type="image/webp" />
              <img src="/logo.png" alt="EasyAcct Logo" className="footer__logo-img" width="240" height="80" loading="lazy" decoding="async" />
            </picture>
          </div>
          <p className="footer__tag">
            Trusted accountant helping individuals &amp; businesses file smarter, save more, and grow confidently.
          </p>
          <div className="footer__quick-actions">
            <a href="mailto:info@easyacct.us" className="footer__action-btn" target="_blank" rel="noopener noreferrer">
              <Mail size={16} />
              <span>Email Us</span>
            </a>
            <a href="tel:+16174128999" className="footer__action-btn">
              <Phone size={16} />
              <span>Call Now</span>
            </a>
          </div>
        </div>

        <div>
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div>
          <h4>Services</h4>
          <Link to="/services">Individual Tax Return</Link>
          <Link to="/services">Business Tax Return</Link>
          <Link to="/services">Payroll</Link>
          <Link to="/services">Book Keeping</Link>
          <Link to="/services">New Business Registration</Link>
          <Link to="/services">Immigration Services</Link>
        </div>

        <div>
          <h4>Contact</h4>
          <p className="footer__contact"><MapPin size={16}/> 43 High St, 2nd Floor, Medford, MA 02155</p>
          <p className="footer__contact"><Phone size={16}/> 617-412-8999</p>
          <p className="footer__contact"><Mail size={16}/> info@easyacct.us</p>
          <div className="footer__socials">
            <a href="#" aria-label="Facebook" className="footer__social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="footer__social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="footer__social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="#" aria-label="Google" className="footer__social-link">
              <Globe size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="footer__social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} EasyAcct. All rights reserved.</span>
        <div className="footer__bottom-right">
          <span className="footer__bottom-name">Mohammed Mostafa · Accountant</span>
          <span className="footer__developer">
            Developed By <a href="https://tech2india.com/" target="_blank" rel="noopener noreferrer">tech2india.com</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
