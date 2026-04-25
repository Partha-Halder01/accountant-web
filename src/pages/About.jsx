import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { 
  Target, 
  Handshake, 
  Lock, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';
import './About.css';

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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-up, .reveal-fade');
    elements.forEach((element) => observer.observe(element));

    const handleScroll = () => {
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

  return (
    <div className="about-page">
      <header className="about-header reveal-up">
        <div className="hc">
          <h1 className="about-h1">
            A modern firm with
            <i className="about-script">old-school values.</i>
          </h1>
          <p className="about-sub">
            Fifteen years of experience, a team of dedicated professionals, 
            and a promise: your finances, handled with absolute precision and care.
          </p>
        </div>
      </header>

      <section className="sec sec--cream">
        <div className="hc">
          <div className="sec__head--split reveal-up">
            <div>
              <span className="sec__label">Our Story</span>
              <h2 className="sec__h2">Built for individuals &amp; businesses <em className="script-accent--inline">across the US</em></h2>
            </div>
            <p className="sec__note">
              EasyAcct was founded with a single mission: make accounting
              approachable, transparent, and technology-driven.
            </p>
          </div>

          <div className="about-content grid-2 reveal-up">
            <div className="about-text">
              <p>
                We serve clients across the country — from salaried professionals to 
                growing small business owners. We believe that financial clarity 
                shouldn't be a luxury reserved for large corporations.
              </p>
              <p>
                Every engagement begins by listening. We believe the best financial advice 
                is personal — built around your life stage, your goals, and your bottom line.
              </p>
              <div className="about-highlights">
                <div className="highlight-item">
                  <CheckCircle2 className="highlight-icon" size={20} />
                  <span>Licensed & Bonded</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle2 className="highlight-icon" size={20} />
                  <span>Cloud-Native Workflows</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle2 className="highlight-icon" size={20} />
                  <span>Year-Round Support</span>
                </div>
              </div>
            </div>
            <div className="about-image-wrap">
              <img 
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80" 
                alt="Professional consultation" 
                className="about-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="hc">
          <div className="sec__head reveal-up">
            <span className="sec__label">What We Stand For</span>
            <h2 className="sec__h2">Our values shape every engagement</h2>
          </div>

          <div className="grid-3 reveal-up">
            {[
              {I:Target, t:'Precision', d:'Every number checked twice. Every filing on time. Every detail documented.'},
              {I:Handshake, t:'Partnership', d:'We are an extension of your team — not a once-a-year transaction.'},
              {I:Lock, t:'Confidentiality', d:'Your data stays encrypted, your conversations stay private. Always.'},
            ].map((v, i) => (
              <div className="bcard" key={v.t}>
                <div className="bcard__bg-num">0{i+1}</div>
                <div className="bcard__top">
                  <div className="bcard__icon"><v.I size={24}/></div>
                </div>
                <h3 className="bcard__title" style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>{v.t}</h3>
                <p className="bcard__desc" style={{ color: 'var(--ink-600)', lineHeight: '1.6' }}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--cream">
        <div className="hc">
          <div className="sec__head reveal-up">
            <span className="sec__label">Leadership</span>
            <h2 className="sec__h2">Meet the team behind your books</h2>
          </div>
          
          <div className="team-grid reveal-up">
            {[
              {
                n:'Mohammed Mostafa', 
                r:'Accountant & Founder', 
                d: 'With over 15 years of experience in tax law and corporate finance, Mohammed leads our firm with a vision of transparency and excellence.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80'
              },
            ].map(p=>(
              <article className="team-card" key={p.n}>
                <div className="team-card__image-wrap">
                  <img src={p.image} alt={p.n} className="team-card__image" />
                </div>
                <div className="team-card__body">
                  <h3>{p.n}</h3>
                  <span className="team-card__role">{p.r}</span>
                  <p className="team-card__desc">{p.d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta__bg" style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2400&q=80")' 
        }} />
        <div className="hc cta__inner reveal-up">
          <div className="cta__content">
            <h2 className="cta__h2">Let’s build your financial story together.</h2>
            <p className="cta__p">Every great outcome starts with a conversation. Let's talk about your goals today.</p>
            <div className="cta__actions">
              <Link to="/contact" className="hero__btn-primary">
                Schedule a Call <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
