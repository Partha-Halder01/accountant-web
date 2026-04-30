import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  Target,
  Handshake,
  Lock,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Award,
  Clock,
  Shield,
  Star,
  Quote
} from 'lucide-react';
import Seo from '../components/Seo';
import './About.css';

const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: 'https://easyacct.us/about',
  name: 'About EasyAcct',
  about: {
    '@type': 'Person',
    name: 'Mohammed Mostafa',
    jobTitle: 'Accountant',
    worksFor: { '@type': 'AccountingService', name: 'EasyAcct' },
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

const AnimatedNumber = ({ end, prefix = '', suffix = '' }) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        const duration = 1800;
        const startTime = performance.now();

        const update = (currentTime) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(end * eased);

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            setValue(end);
          }
        };

        requestAnimationFrame(update);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end]);

  return (
    <strong ref={ref}>
      {prefix}
      {Math.floor(value)}
      {suffix}
    </strong>
  );
};

export default function About() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 120px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');
    elements.forEach((el) => {
      el.style.transitionDelay = '0ms';
      observer.observe(el);
    });

    const handleScroll = () => {
      const ctaSection = document.querySelector('.about-cta');
      const ctaBg = document.querySelector('.about-cta__bg');
      if (ctaSection && ctaBg) {
        const rect = ctaSection.getBoundingClientRect();
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const clamped = Math.max(0, Math.min(progress, 1));
        ctaBg.style.transform = `translate3d(0, ${(clamped - 0.5) * 90}px, 0) scale(1.15)`;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const stats = [
    { value: 10, suffix: '+', label: 'Years of Experience', icon: Clock },
    { value: 1200, suffix: '+', label: 'Clients Served', icon: Users },
    { value: 98, suffix: '%', label: 'Client Retention', icon: Star },
    { value: 2, prefix: '$', suffix: 'B+', label: 'Assets Managed', icon: TrendingUp },
  ];

  const values = [
    {
      Icon: Target,
      title: 'Precision',
      description: 'Every number checked twice. Every filing on time. We treat your finances with the same care we would our own.',
      accent: 'var(--forest-600)',
      num: '01',
    },
    {
      Icon: Handshake,
      title: 'Partnership',
      description: 'We are an extension of your team — not a once-a-year transaction. We grow with your business, every step of the way.',
      accent: 'var(--gold-500)',
      num: '02',
    },
    {
      Icon: Lock,
      title: 'Confidentiality',
      description: 'Your data stays encrypted, your conversations stay private. Bank-grade security for everything we touch.',
      accent: 'var(--forest-400)',
      num: '03',
    },
  ];

  return (
    <div className="about-page">
      <Seo
        title="About EasyAcct | Mohammed Mostafa, Accountant in Medford, MA"
        description="Meet the team behind EasyAcct in Medford, MA. Personalized accounting and tax expertise for individuals and small businesses across the Boston area."
        path="/about"
        jsonLd={ABOUT_JSON_LD}
      />

      {/* ── BANNER ── */}
      <header className="about-header reveal-up">
        <div className="hc">
            <h1 className="about-h1">
              A modern firm with
              <i className="about-script">old-school values.</i>
            </h1>
          <p className="about-sub">
            Ten years of experience, a team of dedicated professionals,
            and a promise: your finances, handled with absolute precision and care.
          </p>
        </div>
      </header>

      {/* ── STATS BAR ── */}
      <section className="about-stats-bar">
        <div className="hc">
          <div className="stats-row">
            {stats.map(({ value, prefix, suffix, label, icon: Icon }) => (
              <div className="stat-item reveal-up" key={label}>
                <div className="stat-icon-wrap">
                  <Icon size={20} />
                </div>
                <div className="stat-value">
                  <AnimatedNumber end={value} prefix={prefix} suffix={suffix} />
                </div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="about-sec about-sec--white">
        <div className="hc">
          <div className="story-grid">
            <div className="story-text reveal-left">
              <span className="about-eyebrow">Our Story</span>
              <h2 className="about-h2">
                Built for individuals &amp; businesses{' '}
                <em className="script-em">across the US</em>
              </h2>
              <p className="about-body">
                EasyAcct was founded with a single mission: make accounting approachable,
                transparent, and technology-driven. We serve clients from coast to coast —
                from salaried professionals to growing small business owners.
              </p>
              <p className="about-body">
                We believe that financial clarity shouldn't be a luxury reserved for large
                corporations. Every engagement begins by listening. The best financial advice
                is personal — built around your life stage, your goals, and your bottom line.
              </p>
              <div className="story-badges">
                {['Licensed & Bonded', 'Cloud-Native Workflows', 'Year-Round Support'].map(b => (
                  <div className="story-badge" key={b}>
                    <CheckCircle2 size={16} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="story-visual reveal-right">
              <div className="story-img-frame">
                <img
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"
                  alt="Professional consultation"
                  className="story-img"
                />
                <div className="story-img-badge">
                  <Award size={18} />
                  <span>Top Rated Firm 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="about-sec about-sec--soft">
        <div className="hc">
          <div className="about-sec-head reveal-up">
            <span className="about-eyebrow">What We Stand For</span>
            <h2 className="about-h2">Our values shape every engagement</h2>
            <p className="about-sec-sub">
              Three principles that guide every decision we make, every day.
            </p>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div className="value-card reveal-up" key={v.title} style={{ '--card-accent': v.accent }}>
                <div className="value-card__num">{v.num}</div>
                <div className="value-card__icon">
                  <v.Icon size={26} />
                </div>
                <h3 className="value-card__title">{v.title}</h3>
                <p className="value-card__desc">{v.description}</p>
                <div className="value-card__bar" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP ── */}
      <section className="about-sec about-sec--white">
        <div className="hc">
          <div className="about-sec-head reveal-up">
            <span className="about-eyebrow">Leadership</span>
            <h2 className="about-h2">Meet the team behind your books</h2>
          </div>
          <div className="leadership-layout">
            <article className="leader-card reveal-left">
              <div className="leader-card__img-wrap">
                <img
                  src="/owner.jpeg"
                  alt="Mohammed Mostafa"
                  className="leader-card__img"
                />
                <div className="leader-card__overlay">
                  
                </div>
              </div>
              <div className="leader-card__body">
                <span className="leader-card__role">Accountant &amp; Founder</span>
                <h3 className="leader-card__name">Mohammed Mostafa</h3>
                <p className="leader-card__bio">
                  With over 10 years of experience in tax law and corporate finance,
                  Mohammed leads our firm with a vision of transparency and excellence.
                  His client-first philosophy has driven EasyAcct's growth into a
                  nationally recognized practice.
                </p>
                <div className="leader-card__tags">
                  {['Tax Law', 'Corporate Finance', 'IRS Representation', 'Audit Defense'].map(t => (
                    <span className="leader-tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
            <div className="leader-side reveal-right">
              <div className="leader-side__quote">
                <Quote size={28} className="leader-side__quote-icon" />
                <blockquote>
                  "My goal has always been simple: give every client the same quality of
                  financial guidance that only the largest companies used to afford."
                </blockquote>
                <cite>— Mohammed Mostafa, Founder</cite>
              </div>
              <div className="leader-side__creds">
                {[
                  { label: 'Licensed CPA', sub: 'All 50 States' },
                  { label: 'IRS Enrolled Agent', sub: 'Federal Representation' },
                  { label: 'Master of Commerce in Accounting', sub: '' },
                ].map(c => (
                  <div className="leader-cred" key={c.label}>
                    <CheckCircle2 size={18} className="leader-cred__icon" />
                    <div>
                      <div className="leader-cred__label">{c.label}</div>
                      <div className="leader-cred__sub">{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-cta__bg" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2400&q=80")'
        }} />
        <div className="hc about-cta__inner reveal-up">
          <span className="about-eyebrow about-eyebrow--light">Ready to Start?</span>
          <h2 className="about-cta__h2">Let's build your financial story together.</h2>
          <p className="about-cta__p">Every great outcome starts with a conversation. Let's talk about your goals today.</p>
          <div className="about-cta__actions">
            <Link to="/contact" className="cta-btn-primary">
              Schedule a Call <ArrowRight size={18} />
            </Link>
            <Link to="/services" className="cta-btn-ghost">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

