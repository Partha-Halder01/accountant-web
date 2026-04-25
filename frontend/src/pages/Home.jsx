import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  Receipt,
  Building2,
  Wallet,
  BookOpenCheck,
  Rocket,
  Plane,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Award,
  Star,
  TrendingUp,
  Users,
  Sparkles,
  PhoneCall,
  Quote,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { services } from '../data/services';
import Seo from '../components/Seo';
import './Home.css';

const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://easyacct.us/#website',
      url: 'https://easyacct.us/',
      name: 'EasyAcct',
      inLanguage: 'en-US',
      publisher: { '@id': 'https://easyacct.us/#business' },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://easyacct.us/#home',
      url: 'https://easyacct.us/',
      name: 'EasyAcct — Accountant in Medford, MA',
      isPartOf: { '@id': 'https://easyacct.us/#website' },
      about: { '@id': 'https://easyacct.us/#business' },
      inLanguage: 'en-US',
    },
  ],
};

const serviceIcons = {
  'individual-tax-return': Receipt,
  'business-tax-return': Building2,
  payroll: Wallet,
  'book-keeping': BookOpenCheck,
  'new-business-registration': Rocket,
  'immigration-services': Plane,
};

const SERVICE_VISUALS = {
  'individual-tax-return': {
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    alt: 'Tax forms and calculator on an office desk',
    chip: 'Personal Filing',
  },
  'business-tax-return': {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    alt: 'Business team discussing financial reports',
    chip: 'Corporate Tax',
  },
  payroll: {
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    alt: 'Payroll and salary review on a laptop',
    chip: 'Monthly Payroll',
  },
  'book-keeping': {
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80',
    alt: 'Bookkeeping records and ledger documents',
    chip: 'Daily Bookkeeping',
  },
  'new-business-registration': {
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    alt: 'Startup registration paperwork with office workspace',
    chip: 'Company Setup',
  },
  'immigration-services': {
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    alt: 'Airplane flying — immigration services',
    chip: 'Immigration',
  },
};

const TRUST = [
  'Individual Tax Return',
  'Business Tax Return',
  'Payroll Services',
  'Book Keeping',
  'New Business Registration',
  'Individual Tax Return',
  'Business Tax Return',
  'Payroll Services',
  'Book Keeping',
  'New Business Registration',
];

const TESTIMONIALS = [
  {
    name: 'James R.',
    role: 'Small Business Owner',
    service: 'Audit Support',
    tag: 'Books cleaned up',
    highlight: '2 years reconciled',
    quote:
      'Mohammed helped us clean two years of books and navigate a tricky audit. The process felt sharp, calm, and totally under control.',
    image:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&h=720&q=80',
    alt: 'Business owner reviewing financial reports and invoices at a desk',
    imagePosition: 'center',
  },
  {
    name: 'Sarah L.',
    role: 'Freelancer + W-2',
    service: 'Personal Tax',
    tag: 'Refund unlocked',
    highlight: '$4.8k back',
    quote:
      "I ended up with a refund I didn't know I was owed, and filing finally felt effortless instead of overwhelming.",
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&h=720&q=80',
    alt: 'Freelancer working on tax documents with laptop and coffee',
    imagePosition: 'center',
  },
  {
    name: 'David P.',
    role: 'LLC Director',
    service: 'Bookkeeping',
    tag: 'Finance partner',
    highlight: 'Payroll on track',
    quote:
      'Monthly bookkeeping, payroll, and tax guidance now run like clockwork. It feels like having a real finance partner in the business.',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&h=720&q=80',
    alt: 'Business team discussing payroll and bookkeeping reports',
    imagePosition: 'center',
  },
  {
    name: 'Priya S.',
    role: 'Medical Practice Manager',
    service: 'Business Advisory',
    tag: 'Quarter-end ready',
    highlight: 'Zero last-minute rush',
    quote:
      'Our books are cleaner, our reports are faster, and quarter-end no longer turns into a stressful scramble for the whole team.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&h=720&q=80',
    alt: 'Professional financial consultation with charts and business planning notes',
    imagePosition: 'center',
  },
  {
    name: 'Elena M.',
    role: 'Family Tax Client',
    service: 'Family Filing',
    tag: 'Smooth filing',
    highlight: 'Stress-free season',
    quote:
      'Every question was answered clearly, every document was handled quickly, and the whole experience felt surprisingly easy.',
    image:
      'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=900&h=720&q=80',
    alt: 'Tax preparation workspace with forms, calculator, and financial documents',
    imagePosition: 'center',
  },
];

const TESTIMONIAL_AUTOPLAY_MS = 4200;

const getVisibleTestimonials = (width) => {
  if (width < 700) return 1;
  if (width < 1100) return 2;
  return 3;
};

const AnimatedNumber = ({ end, prefix = '', suffix = '' }) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 2000;
          const startTime = performance.now();

          const update = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setValue(end * easeOut);
            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              setValue(end);
            }
          };

          requestAnimationFrame(update);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
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

export default function Home() {
  const testimonialViewportRef = useRef(null);
  const testimonialScrollTimeoutRef = useRef(null);
  const servicesViewportRef = useRef(null);
  const servicesScrollTimeoutRef = useRef(null);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeService, setActiveService] = useState(0);

  const [visibleTestimonials, setVisibleTestimonials] = useState(
    typeof window === 'undefined' ? 3 : getVisibleTestimonials(window.innerWidth)
  );
  const [visibleServices, setVisibleServices] = useState(
    typeof window === 'undefined' ? 3 : (window.innerWidth < 992 ? 1 : 3)
  );

  const [testimonialsPaused, setTestimonialsPaused] = useState(false);
  const [servicesPaused, setServicesPaused] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-up, .reveal-fade');
    elements.forEach((element) => observer.observe(element));

    const handleScroll = () => {
      const heroBg = document.querySelector('.hero__bg');
      if (heroBg) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
      }

      const testimonialSection = document.querySelector('.testimonial-showcase');
      const testimonialBg = document.querySelector('.testimonial-showcase__bg');

      if (testimonialSection && testimonialBg) {
        const rect = testimonialSection.getBoundingClientRect();
        const progress =
          (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const clampedProgress = Math.max(0, Math.min(progress, 1));
        const parallaxOffset = (clampedProgress - 0.5) * 110;
        testimonialBg.style.transform = `translate3d(0, ${parallaxOffset}px, 0) scale(1.12)`;
      }

      const ctaSection = document.querySelector('.cta');
      const ctaBg = document.querySelector('.cta__bg');
      if (ctaSection && ctaBg) {
        const rect = ctaSection.getBoundingClientRect();
        const progress =
          (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const clampedProgress = Math.max(0, Math.min(progress, 1));
        const parallaxOffset = (clampedProgress - 0.5) * 90;
        ctaBg.style.transform = `translate3d(0, ${parallaxOffset}px, 0) scale(1.15)`;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const syncVisibleTestimonials = () => {
      setVisibleTestimonials(getVisibleTestimonials(window.innerWidth));
    };

    syncVisibleTestimonials();
    window.addEventListener('resize', syncVisibleTestimonials);

    return () => {
      window.removeEventListener('resize', syncVisibleTestimonials);
    };
  }, []);

  useEffect(() => {
    const syncVisibleServices = () => {
      setVisibleServices(window.innerWidth < 992 ? 1 : 3);
    };
    syncVisibleServices();
    window.addEventListener('resize', syncVisibleServices);
    return () => window.removeEventListener('resize', syncVisibleServices);
  }, []);

  const testimonialStopCount = Math.max(
    TESTIMONIALS.length - visibleTestimonials + 1,
    1
  );
  const serviceStopCount = services.length;

  useEffect(() => {
    if (activeTestimonial > testimonialStopCount - 1) {
      setActiveTestimonial(testimonialStopCount - 1);
    }
  }, [activeTestimonial, testimonialStopCount]);

  // Service carousel scroll effect
  useEffect(() => {
    const viewport = servicesViewportRef.current;
    if (!viewport || window.innerWidth >= 992) return;

    const cards = viewport.querySelectorAll('.service-tile');
    const targetCard = cards[activeService];
    if (!targetCard) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetLeft = targetCard.offsetLeft - (viewport.offsetWidth - targetCard.offsetWidth) / 2;

    if (Math.abs(viewport.scrollLeft - targetLeft) < 10) return;

    viewport.scrollTo({
      left: targetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [activeService]);

  // Service carousel autoplay
  useEffect(() => {
    if (window.innerWidth >= 992 || servicesPaused) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveService((current) => (current + 1) % serviceStopCount);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [servicesPaused, serviceStopCount]);

  const syncActiveServiceFromScroll = () => {
    const viewport = servicesViewportRef.current;
    if (!viewport || window.innerWidth >= 992) return;

    const cards = Array.from(viewport.querySelectorAll('.service-tile'));
    if (!cards.length) return;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const viewportCenter = viewport.scrollLeft + viewport.offsetWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveService(closestIndex);
  };

  const handleServiceScroll = () => {
    if (servicesScrollTimeoutRef.current) window.clearTimeout(servicesScrollTimeoutRef.current);
    servicesScrollTimeoutRef.current = window.setTimeout(() => {
      syncActiveServiceFromScroll();
      servicesScrollTimeoutRef.current = null;
    }, 150);
  };

  useEffect(() => {
    const viewport = testimonialViewportRef.current;
    if (!viewport) return;

    const cards = viewport.querySelectorAll('.tshowcase__card');
    const targetCard = cards[activeTestimonial];
    if (!targetCard) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const targetLeft = targetCard.offsetLeft;

    if (Math.abs(viewport.scrollLeft - targetLeft) < 4) return;

    viewport.scrollTo({
      left: targetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [activeTestimonial, visibleTestimonials]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || testimonialsPaused || testimonialStopCount <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonialStopCount);
    }, TESTIMONIAL_AUTOPLAY_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [testimonialsPaused, testimonialStopCount]);

  useEffect(() => {
    return () => {
      if (testimonialScrollTimeoutRef.current) {
        window.clearTimeout(testimonialScrollTimeoutRef.current);
      }
    };
  }, []);

  const syncActiveTestimonialFromScroll = () => {
    const viewport = testimonialViewportRef.current;
    if (!viewport) return;

    const cards = Array.from(viewport.querySelectorAll('.tshowcase__card'));
    if (!cards.length) return;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - viewport.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    const nextIndex = Math.min(closestIndex, testimonialStopCount - 1);
    setActiveTestimonial((current) => (current === nextIndex ? current : nextIndex));
  };

  const handleTestimonialScroll = () => {
    if (testimonialScrollTimeoutRef.current) {
      window.clearTimeout(testimonialScrollTimeoutRef.current);
    }

    testimonialScrollTimeoutRef.current = window.setTimeout(() => {
      syncActiveTestimonialFromScroll();
      testimonialScrollTimeoutRef.current = null;
    }, 120);
  };

  return (
    <>
      <Seo
        title="EasyAcct | Accountant in Medford, MA — Tax, Payroll & Bookkeeping"
        description="Trusted accountant in Medford, MA serving the Boston area. Individual & business tax returns, payroll, bookkeeping, and new business registration."
        path="/"
        jsonLd={HOME_JSON_LD}
      />
      <div className="hero-stage">
        <section className="hero">
        <div className="hero__bg" />
        <div className="hero__overlay" />

        <div className="hc hero__grid">
          <div className="hero__copy reveal-up">
            

            <h1 className="hero__h1">
              Your numbers,
              <em className="hero__script-line">handled with care.</em>
            </h1>

            <p className="hero__sub">
              From personal tax returns to full business compliance - we make
              finance simple, transparent, and built around your goals.
            </p>

            <div className="hero__actions">
              <Link to="/contact" className="hero__btn-primary">
                Book a Free Consult <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="hero__btn-ghost">
                Our Services <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          <div className="hero__card-wrap">
            <div className="hero__card hero__card--enter">
              <div className="hcard__header">
                <span className="hcard__dot" />
                <span className="hcard__title">Finance Overview</span>
                <span className="hcard__live">EASYACCT</span>
              </div>

              <div className="hcard__kpi">
                <span>Net Refund This Year</span>
                <strong>$12,800</strong>
              </div>

              <div className="hcard__rows">
                <div className="hcard__row">
                  <div className="hcard__row-top">
                    <span>Tax Saved</span>
                    <strong>$34,500</strong>
                  </div>
                  <div className="hcard__bar">
                    <div className="hcard__bar-fill" />
                  </div>
                </div>
                <div className="hcard__row">
                  <div className="hcard__row-top">
                    <span>Compliance</span>
                    <strong>98/100</strong>
                  </div>
                  <div className="hcard__bar">
                    <div className="hcard__bar-fill hcard__bar-fill--gold" />
                  </div>
                </div>
              </div>

              <div className="hcard__badges">
                <span className="hcard__badge">
                  <TrendingUp size={13} /> +24% refund vs last year
                </span>
                <span className="hcard__badge hcard__badge--gold">
                  <ShieldCheck size={13} /> 100% Compliant
                </span>
              </div>
            </div>

            <div className="hero__ring" />
          </div>
        </div>

        <div className="hero__stats reveal-up">
          <div className="hc hero__stats-row">
            <div className="hero__stat">
              <AnimatedNumber end={10} suffix="+" />
              <span>Years Experience</span>
            </div>
            <div className="hero__stat">
              <AnimatedNumber end={500} suffix="+" />
              <span>Happy Clients</span>
            </div>
            <div className="hero__stat">
              <AnimatedNumber end={1} prefix="$" suffix="M+" />
              <span>Tax Saved</span>
            </div>
            <div className="hero__stat">
              <AnimatedNumber end={98} suffix="%" />
              <span>Client Retention</span>
            </div>
          </div>
        </div>

        </section>

      {/* Services marquee — outside hero so it's never clipped */}
      <div className="trust">
        <div className="trust__track">
          <div className="trust__tape">
            {[...TRUST, ...TRUST].map((item, index) => (
              <span key={index} className="trust__item">
                <span className="trust__sep" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      </div>

      <section className="services-showcase">
        <div className="services-showcase__bg" />
        <div className="hc services-showcase__inner">
          <header className="services-showcase__head reveal-up">
            <div className="services-showcase__headline">
              <h2 className="services-showcase__title">
                Comprehensive Services &amp; Solutions We Offer <em className="script-accent--inline"></em>
              </h2>
            </div>
          </header>

          {/* Static 3×2 grid */}
          <div className="home-srv-grid">
            {services.map((service, index) => {
              const Icon = serviceIcons[service.slug] || Receipt;
              const visual = SERVICE_VISUALS[service.slug] || SERVICE_VISUALS['individual-tax-return'];

              return (
                <Link
                  to="/services"
                  state={{ scrollTo: service.slug }}
                  key={service.slug}
                  className="home-srv-card reveal-up"
                  style={{ '--card-color': service.color || 'var(--forest-600)' }}
                >
                  <div className="home-srv-card__media">
                    <img
                      src={visual.image}
                      alt={visual.alt}
                      className="home-srv-card__img"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="home-srv-card__overlay" />
                    <span className="home-srv-card__chip">{visual.chip}</span>
                    <span className="home-srv-card__num">0{index + 1}</span>
                  </div>

                  <div className="home-srv-card__body">
                    <div className="home-srv-card__icon">
                      <Icon size={18} strokeWidth={1.8} />
                    </div>
                    {index === 0 && (
                      <span className="home-srv-card__badge">Most Popular</span>
                    )}
                    <h3 className="home-srv-card__title">{service.title}</h3>
                    <p className="home-srv-card__desc">{service.short}</p>
                    <span className="home-srv-card__link">
                      Explore <ArrowUpRight size={14} />
                    </span>
                  </div>

                  <div className="home-srv-card__bar" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="why">
        {/* ── Left: photo panel ── */}
        <div className="why__media reveal-fade">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80"
            alt="EasyAcct team in a client consultation"
            className="why__photo"
            loading="lazy"
          />
          <div className="why__media-overlay" />

          {/* Floating trust badge */}
          <div className="why__float why__float--trust">
            <ShieldCheck size={20} className="why__float-icon" />
            <div>
              <strong>Trusted by 500+</strong>
              <span>Families &amp; businesses</span>
            </div>
          </div>

          {/* Floating rating chip */}
          <div className="why__float why__float--rating">
            <div className="why__float-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <span>4.9 · Google Rating</span>
          </div>
        </div>

        {/* ── Right: content panel ── */}
        <div className="why__content reveal-up">
          <p className="sec__label sec__label--gold">Why choose us</p>
          <h2 className="why__h2">
            Numbers are personal.
            <em className="script-accent script-accent--light">
              We treat them that way.
            </em>
          </h2>
          <p className="why__body">
            We blend deep chartered-accountancy expertise with modern tooling —
            accuracy, speed, and advice you can actually understand.
          </p>

          <ul className="why__list">
            {[
              'Certified Chartered Accountants',
              'Secure digital onboarding',
              'Dedicated relationship manager',
              'On-time filing guarantee',
            ].map((item) => (
              <li key={item}>
                <CheckCircle2 size={16} /> {item}
              </li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="why__stats">
            {[
              { value: '98%', label: 'Client Retention' },
              { value: '24h', label: 'Avg. Response' },
              { value: 'A+', label: 'Compliance' },
              { value: '$0', label: 'Hidden Fees' },
            ].map(({ value, label }) => (
              <div key={label} className="wstat">
                <strong className="wstat__num">{value}</strong>
                <span className="wstat__label">{label}</span>
              </div>
            ))}
          </div>

          <Link to="/about" className="why__cta">
            About Our Firm <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="sec sec--cream">
        <div className="hc">
          <div className="sec__head reveal-up">
            <h2 className="sec__h2 sec__h2--process">
              A simple, <em className="script-accent script-accent--inline">four-step</em>{' '}
              process
            </h2>
          </div>

          <div className="steps">
            <div className="steps__line" />
            {[
              {
                number: '01',
                title: 'Discovery Call',
                description:
                  'A free 20-min call to understand your goals and current situation.',
              },
              {
                number: '02',
                title: 'Document Collection',
                description:
                  'Upload documents to our secure client portal - no paperwork headaches.',
              },
              {
                number: '03',
                title: 'Plan & Execute',
                description:
                  'We analyse, file, and optimise across every applicable benefit.',
              },
              {
                number: '04',
                title: 'Year-round Support',
                description:
                  'Stay compliant with ongoing advisory, reminders, and reviews.',
              },
            ].map((step) => (
              <div className="step reveal-up" key={step.number}>
                <div className="step__circle">{step.number}</div>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec testimonial-showcase">
        <div className="hc testimonial-showcase__shell">
          <div className="testimonial-showcase__intro reveal-up">
            <div className="testimonial-showcase__heading">
              <p className="sec__label">Kind words</p>
              <h2 className="sec__h2 testimonial-showcase__title">
                Loved by founders,
                <em className="script-accent">
                  families &amp; growing teams.
                </em>
              </h2>
              <p className="testimonial-showcase__copy">
                Real client stories, real numbers, and a review experience built
                to feel premium on every screen.
              </p>
            </div>

            <aside className="testimonial-showcase__summary">
              <div className="rating rating--showcase">
                <div className="rating__stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={18} fill="currentColor" />
                  ))}
                </div>
                <strong>4.9 / 5</strong>
                <span>from 480+ Google reviews</span>
              </div>

              <span className="testimonial-showcase__badge">
                <Sparkles size={14} />
                Auto-swiping every 4.2s
              </span>
            </aside>
          </div>

          <div
            className="tshowcase reveal-fade delay-100"
            aria-roledescription="carousel"
            onMouseEnter={() => setTestimonialsPaused(true)}
            onMouseLeave={() => setTestimonialsPaused(false)}
            onTouchStart={() => setTestimonialsPaused(true)}
            onTouchEnd={() => setTestimonialsPaused(false)}
            onFocusCapture={() => setTestimonialsPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setTestimonialsPaused(false);
              }
            }}
          >
            <div
              className="tshowcase__viewport"
              ref={testimonialViewportRef}
              onScroll={handleTestimonialScroll}
            >
              <div className="tshowcase__track">
                {TESTIMONIALS.map((testimonial, index) => (
                  <article
                    key={testimonial.name}
                    className={`tshowcase__card tshowcase__card--${(index % 5) + 1}`}
                  >
                    <div className="tshowcase__media">
                      <img
                        src={testimonial.image}
                        alt={testimonial.alt}
                        loading="lazy"
                        style={{ objectPosition: testimonial.imagePosition || 'center' }}
                      />

                      <div className="tshowcase__stars">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star key={starIndex} size={13} fill="currentColor" />
                        ))}
                      </div>

                      <div className="tshowcase__metric">
                        <span>{testimonial.tag}</span>
                        <strong>{testimonial.highlight}</strong>
                      </div>
                    </div>

                    <div className="tshowcase__body">
                      <Quote size={28} className="tshowcase__quote-mark" />
                      <p className="tshowcase__quote">{testimonial.quote}</p>

                      <div className="tshowcase__meta">
                        <div className="tshowcase__person">
                          <strong>{testimonial.name}</strong>
                          <span>{testimonial.role}</span>
                        </div>
                        <span className="tshowcase__service">
                          {testimonial.service}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="tshowcase__footer">
              <div className="tshowcase__dots" aria-label="Choose testimonial group">
                {Array.from({ length: testimonialStopCount }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`tshowcase__dot${
                      activeTestimonial === index ? ' is-active' : ''
                    }`}
                    onClick={() => setActiveTestimonial(index)}
                    aria-label={`Show testimonial group ${index + 1}`}
                    aria-pressed={activeTestimonial === index}
                  />
                ))}
              </div>

              <span className="tshowcase__hint">
                {testimonialsPaused
                  ? 'Paused while you read'
                  : 'Auto-rotating every 4.2 seconds'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta__bg" />
        <div className="cta__overlay" />
        <div className="cta__glow" />
        <div className="cta__fade-bottom" />

        <div className="hc cta__inner reveal-up">
          <p className="sec__label sec__label--gold">Ready when you are</p>
          <h2 className="cta__h2">
            Let&apos;s make your numbers
            <em className="script-accent script-accent--gold">work harder.</em>
          </h2>
          <p className="cta__sub">
            Book a free, no-obligation consultation — we&apos;ll map out a
            personalised plan in just 20 minutes.
          </p>

          <div className="cta__trust">
            <span className="cta__trust-item">
              <CheckCircle2 size={15} />
              No commitment required
            </span>
            <span className="cta__trust-item">
              <CheckCircle2 size={15} />
              Response within 24 hours
            </span>
            <span className="cta__trust-item">
              <CheckCircle2 size={15} />
              500+ clients served
            </span>
          </div>

          <div className="cta__btns">
            <Link to="/contact" className="cta__btn-primary">
              <PhoneCall size={16} /> Get Started Today
            </Link>
            <Link to="/services" className="cta__ghost">
              Explore Services <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
