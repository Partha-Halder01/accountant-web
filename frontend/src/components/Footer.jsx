import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
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
        </div>
      </div>
      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} EasyAcct. All rights reserved.</span>
        <div className="footer__bottom-right">
          <span className="footer__bottom-name">Mohammed Mostafa · Accountant</span>
          <span className="footer__developer">
            Developed By <a href="https://tech2india.com/" target="_blank" rel="noopener noreferrer">Tech2india</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
