import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Send, MessageCircle, AtSign } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <div className="footer__brand">
            <img src="/logom.png" alt="EasyAcct Logo" className="brand-logo-img" />
            <span>EasyAcct</span>
          </div>
          <p className="footer__tag">
            Trusted accountant helping individuals &amp; businesses file smarter, save more, and grow confidently.
          </p>
          <div className="footer__social">
            <a href="#" aria-label="LinkedIn"><Globe size={18}/></a>
            <a href="#" aria-label="Twitter"><AtSign size={18}/></a>
            <a href="#" aria-label="Messenger"><MessageCircle size={18}/></a>
            <a href="#" aria-label="Telegram"><Send size={18}/></a>
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
        <span>Mohammed Mostafa · Accountant</span>
      </div>
    </footer>
  );
}
