import { NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PhoneCall, Menu, X, Home, Briefcase, Info, Mail } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isHome = location.pathname === '/';
  const isHomeTop = isHome && !scrolled;

  const navLinks = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/services', label: 'Services', icon: Briefcase },
    { to: '/about', label: 'About Us', icon: Info },
    { to: '/contact', label: 'Contact Us', icon: Mail },
  ];

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${isHomeTop ? 'nav--home-top' : ''}`}>
      <div className="nav__wrap">
        <div className="nav__inner">
          <Link to="/" className="nav__brand" onClick={close} aria-label="EasyAcct home">
            <picture>
              <source srcSet="/logo.webp" type="image/webp" />
              <img src="/logo.png" alt="EasyAcct Logo" className="brand-logo-img" width="240" height="80" decoding="async" fetchpriority="high" />
            </picture>
          </Link>

          <nav
            id="primary-navigation"
            className={`nav__menu ${open ? 'is-open' : ''}`}
            aria-label="Primary"
          >
            <div className="nav__menu-header">
              <span className="nav__menu-title">Menu</span>
              <button className="nav__menu-close" onClick={close}>
                <X size={24} />
              </button>
            </div>
            
            <div className="nav__links">
              {navLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={close}
                  className={({ isActive }) => `nav__link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="nav__link-icon" size={20} />
                  <span className="nav__link-text">{label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="nav__actions">
            <Link to="/contact" className="nav__cta" onClick={close}>
              <PhoneCall size={16} strokeWidth={2.3} />
              <span>Get a Consult</span>
            </Link>

            <button
              type="button"
              className={`nav__toggle ${open ? 'is-open' : ''}`}
              onClick={() => setOpen((current) => !current)}
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="primary-navigation"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`nav__backdrop ${open ? 'is-open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />
    </header>
  );
}
