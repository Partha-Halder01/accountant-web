import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { services } from '../data/services';
import './Services.css';

const icons = {
  'individual-tax-return': Receipt,
  'business-tax-return': Building2,
  'payroll': Wallet,
  'book-keeping': BookOpenCheck,
  'new-business-registration': Rocket,
};

const serviceVisuals = {
  'individual-tax-return': {
    image: '/service-images/individual-tax.jpg',
    alt: 'Tax forms and calculator on an office desk',
    chip: 'Personal Filing',
  },
  'business-tax-return': {
    image: '/service-images/business-tax.jpg',
    alt: 'Business team discussing financial reports',
    chip: 'Corporate Tax',
  },
  payroll: {
    image: '/service-images/payroll.jpg',
    alt: 'Payroll and salary review on a laptop',
    chip: 'Monthly Payroll',
  },
  'book-keeping': {
    image: '/service-images/bookkeeping.jpg',
    alt: 'Bookkeeping records and ledger documents',
    chip: 'Daily Bookkeeping',
  },
  'new-business-registration': {
    image: '/service-images/registration.jpg',
    alt: 'Startup registration paperwork with office workspace',
    chip: 'Business Setup',
  },
};

const deliveryPillars = [
  {
    icon: ShieldCheck,
    title: 'Compliance first',
    text: 'Every filing, report, and registration is handled with accuracy and clear review steps.',
  },
  {
    icon: Clock3,
    title: 'Fast turnaround',
    text: 'You get responsive communication, deadline tracking, and steady progress without chasing updates.',
  },
  {
    icon: Users,
    title: 'Personal support',
    text: 'Advice stays simple and human, whether you are filing as an individual or growing a business.',
  },
];

const deliverySteps = [
  {
    icon: Sparkles,
    title: 'Share your situation',
    text: 'Tell us what you need, what is pending, and where you want support right now.',
  },
  {
    icon: FolderCheck,
    title: 'We build the plan',
    text: 'We map the filing path, documents, deadlines, and service scope before work begins.',
  },
  {
    icon: BadgeCheck,
    title: 'Stay fully handled',
    text: 'We complete the work, keep you updated, and make sure the final result is ready to use.',
  },
];

export default function Services() {
  return (
    <>
      <section className="services-offerings section" id="service-offerings">
        <div className="services-offerings__bg" />
        <div className="container services-offerings__inner">
          <div className="services-offerings__head">
            <span className="eyebrow">Core services</span>
            <h2>Comprehensive services and solutions we offer</h2>
            <p>
              Explore the five core services we deliver for individuals, founders, and
              growing businesses that want reliable support and clear advice.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => {
              const Icon = icons[service.slug] || Receipt;
              const visual = serviceVisuals[service.slug] || serviceVisuals['individual-tax-return'];

              return (
                <article className="service-panel" key={service.slug}>
                  <div className="service-panel__media">
                    <img
                      src={visual.image}
                      alt={visual.alt}
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = '/service-images/fallback.jpg';
                      }}
                    />
                    <span className="service-panel__chip">{visual.chip}</span>
                  </div>

                  <div className="service-panel__body">
                    <div className="service-panel__top">
                      <span className="service-panel__icon">
                        <Icon size={20} strokeWidth={1.8} />
                      </span>
                      <span className="service-panel__index">0{index + 1}</span>
                    </div>

                    <h3>{service.title}</h3>
                    <p>{service.description}</p>

                    <ul className="service-panel__features">
                      {service.features.map((feature) => (
                        <li key={feature}>
                          <span>
                            <Check size={14} strokeWidth={2.2} />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link to="/contact" className="service-panel__link">
                      Get service support <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="services-intro">
        <div className="container services-intro__grid">
          <div className="services-intro__content">
            <span className="eyebrow">Why choose us</span>
            <h2>
              Numbers are personal.
              <span className="services-intro__script">We treat them that way.</span>
            </h2>
            <p>
              We combine chartered-accountancy expertise with practical support, so you
              always know what is being handled, what comes next, and where your business
              or filing stands.
            </p>
          </div>

          <div className="services-intro__cards">
            {deliveryPillars.map(({ icon: Icon, title, text }) => (
              <article key={title} className="services-intro__card">
                <span className="services-intro__icon">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="services-process section">
        <div className="container">
          <div className="services-process__head">
            <span className="eyebrow">How it works</span>
            <h2>A smoother path from questions to completed work</h2>
            <p>
              Our process is simple, transparent, and easy to follow from the first call
              to the final filing, report, or registration.
            </p>
          </div>

          <div className="services-process__grid">
            {deliverySteps.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="services-process__card">
                <span className="services-process__index">0{index + 1}</span>
                <span className="services-process__icon">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="services-cta">
        <div className="container services-cta__inner">
          <div className="services-cta__copy">
            <span className="eyebrow services-cta__eyebrow">Need guidance?</span>
            <h2>Not sure which service fits best?</h2>
            <p>
              Tell us your situation and we will recommend the right service path in a
              free consultation call.
            </p>
          </div>

          <div className="services-cta__actions">
            <Link to="/contact" className="btn btn--gold btn--lg">
              Talk to an Expert <ArrowRight size={18} />
            </Link>
            <div className="services-cta__badge">
              <ShieldCheck size={18} strokeWidth={1.8} />
              Trusted guidance for personal and business finance
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
