import React from 'react';

const healthcareLinks = [
  {
    name: 'World Health Organization',
    abbr: 'WHO',
    url: 'https://www.who.int/',
    description: 'International public health authority providing trusted health information and resources.',
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.08)',
    border: 'rgba(34,211,238,0.2)',
  },
  {
    name: 'Centers for Disease Control',
    abbr: 'CDC',
    url: 'https://www.cdc.gov/',
    description: 'US-based authority on disease control, prevention, and health education.',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.08)',
    border: 'rgba(244,63,94,0.2)',
  },
  {
    name: 'National Institutes of Health',
    abbr: 'NIH',
    url: 'https://www.nih.gov/',
    description: 'Medical research agency providing health information and research updates.',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.2)',
  },
  {
    name: 'Mayo Clinic',
    abbr: 'MC',
    url: 'https://www.mayoclinic.org/',
    description: 'Trusted source for patient care, medical research, and health information.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
  },
  {
    name: 'WebMD',
    abbr: 'WMD',
    url: 'https://www.webmd.com/',
    description: 'Popular site for health news, symptom checkers, and medical information.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    name: 'MedlinePlus',
    abbr: 'MLP',
    url: 'https://medlineplus.gov/',
    description: 'Reliable health information from the US National Library of Medicine.',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.2)',
  },
  {
    name: 'Healthline',
    abbr: 'HL',
    url: 'https://www.healthline.com/',
    description: 'Evidence-based health and wellness information.',
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.08)',
    border: 'rgba(34,211,238,0.2)',
  },
  {
    name: 'Cleveland Clinic',
    abbr: 'CC',
    url: 'https://my.clevelandclinic.org/',
    description: 'Comprehensive health information and patient care resources.',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.2)',
  },
  {
    name: 'MoHFW — India',
    abbr: 'MoH',
    url: 'https://www.mohfw.gov.in/',
    description: 'Official government portal for health policies, updates, and resources in India.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    name: 'Indian Council of Medical Research',
    abbr: 'ICMR',
    url: 'https://www.icmr.gov.in/',
    description: "India's apex body for biomedical research formulation and coordination.",
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
  },
  {
    name: 'National Health Portal — India',
    abbr: 'NHP',
    url: 'https://www.nhp.gov.in/',
    description: 'Comprehensive health information and services for Indian citizens.',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.08)',
    border: 'rgba(244,63,94,0.2)',
  },
  {
    name: 'AIIMS',
    abbr: 'AIIMS',
    url: 'https://www.aiims.edu/en.html',
    description: 'Premier medical institute in India providing health information and patient care.',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.2)',
  },
];

const HealthLinks: React.FC = () => (
  <div style={{ padding: '2.5rem 1rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

    {/* Section header */}
    <div className="animate-fade-in-down" style={{ marginBottom: '2rem' }}>
      <span className="pill-badge mb-3 inline-flex">🔗 Curated Directory</span>
      <h2 style={{
        fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
        fontWeight: 900,
        letterSpacing: '-0.03em',
        color: 'var(--text-primary)',
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
      }}>
        Trusted Healthcare Resources
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        Hand-picked sources from leading global and Indian health organizations.
      </p>
      <div className="divider mt-4" />
    </div>

    {/* Links grid */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
      }}
    >
      {healthcareLinks.map((link, i) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`animate-fade-in-up delay-${Math.min((i + 1) * 50, 500)}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1.25rem',
            borderRadius: '1.1rem',
            background: link.bg,
            border: `1px solid ${link.border}`,
            textDecoration: 'none',
            transition: 'all 0.25s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.transform = 'translateY(-4px)';
            el.style.boxShadow = `0 8px 30px ${link.bg.replace('0.08', '0.25')}`;
            el.style.borderColor = link.color + '60';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.transform = 'translateY(0)';
            el.style.boxShadow = 'none';
            el.style.borderColor = link.border;
          }}
        >
          {/* Abbr badge + external icon */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
            <div style={{
              padding: '0.3rem 0.7rem',
              borderRadius: '0.5rem',
              background: `${link.color}20`,
              border: `1px solid ${link.color}40`,
              fontSize: '0.72rem',
              fontWeight: 800,
              color: link.color,
              letterSpacing: '0.05em',
            }}>
              {link.abbr}
            </div>
            <div style={{
              width: '28px', height: '28px',
              borderRadius: '0.5rem',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)',
            }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
          
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem', lineHeight: 1.35 }}>
            {link.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55, flex: 1 }}>
            {link.description}
          </div>

          {/* Visit pill — appears on bottom */}
          <div style={{
            marginTop: '0.875rem',
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            fontSize: '0.75rem', fontWeight: 600,
            color: link.color,
          }}>
            Visit →
          </div>
        </a>
      ))}
    </div>
  </div>
);

export default HealthLinks;