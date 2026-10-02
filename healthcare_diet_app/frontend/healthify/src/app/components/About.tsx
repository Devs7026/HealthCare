import React, { useEffect, useRef, useState } from "react";

type AboutProps = {
  onBack: () => void;
  onGetStarted?: () => void;
};

const FEATURE_CARDS = [
  {
    icon: '🍽️',
    title: 'Smart Food Logging',
    desc: 'Log every meal with ease. Track breakfast, lunch, dinner and snacks with calorie estimates.',
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.15)',
  },
  {
    icon: '🩺',
    title: 'Symptom Tracking',
    desc: 'Record and monitor symptoms over time. Spot patterns, get insights and take control of your health.',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.15)',
  },
  {
    icon: '🤖',
    title: 'AI Medical Assistant',
    desc: 'Powered by Google Gemini. Ask health questions, get personalized guidance instantly.',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.15)',
  },
];

const About: React.FC<AboutProps> = ({ onBack, onGetStarted }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!glowRef.current) return;
    glowRef.current.style.left = `${pos.x - 200}px`;
    glowRef.current.style.top = `${pos.y - 200}px`;
  }, [pos]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden"
      style={{ background: 'var(--bg-void)' }}>

      {/* Cursor-following glow */}
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          width: 400, height: 400,
          pointerEvents: "none",
          zIndex: 0,
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.08) 50%, transparent 100%)",
          filter: "blur(60px)",
          transition: "left 0.15s ease-out, top 0.15s ease-out",
        }}
      />

      {/* Background mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="aurora-blob" style={{
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
          top: '10%', left: '10%',
          animationDuration: '15s',
        }} />
        <div className="aurora-blob" style={{
          width: 500, height: 300,
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 70%)',
          bottom: '10%', right: '10%',
          animationDuration: '18s',
          animationDelay: '-6s',
        }} />
        <div className="aurora-blob" style={{
          width: 400, height: 300,
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animationDuration: '20s',
          animationDelay: '-10s',
        }} />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center w-full max-w-4xl mx-auto gap-2" style={{ zIndex: 1 }}>

        {/* Badge */}
        <div className="animate-fade-in-up mb-6">
          <span className="pill-badge">
            <span>✦</span>
            AI-Powered Health Platform
          </span>
        </div>

        {/* Main headline */}
        <h2
          className="animate-fade-in-up delay-100 text-center mb-6"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
          }}
        >
          <span className="gradient-text">Take charge</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>of your health journey.</span>
        </h2>

        {/* Sub-headline */}
        <p
          className="animate-fade-in-up delay-200 text-center mb-10"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            maxWidth: '600px',
            lineHeight: 1.7,
          }}
        >
          Log meals, track symptoms, and get personalized AI-powered recommendations —
          all in one beautiful, intuitive interface.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in-up delay-300 mb-16">
          <button
            onClick={onGetStarted}
            className="btn-glow"
            style={{
              padding: '0.9rem 2.5rem',
              fontSize: '1rem',
              borderRadius: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              fontWeight: 700,
            }}
          >
            Get Started
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Feature cards */}
        <div
          className="w-full grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
        >
          {FEATURE_CARDS.map((card, i) => (
            <div
              key={card.title}
              className={`glass-card animate-fade-in-up delay-${(i + 4) * 100}`}
              style={{ padding: '1.75rem' }}
            >
              {/* Icon */}
              <div style={{
                width: '52px', height: '52px',
                borderRadius: '1rem',
                background: `rgba(${card.color === '#22d3ee' ? '34,211,238' : card.color === '#a855f7' ? '168,85,247' : '16,185,129'},0.12)`,
                border: `1px solid ${card.glow.replace('0.15)', '0.3)')}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', marginBottom: '1.25rem',
                boxShadow: `0 0 20px ${card.glow}`,
              }}>
                {card.icon}
              </div>
              <h3 style={{
                fontSize: '1.05rem', fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
              }}>
                {card.title}
              </h3>
              <p style={{
                fontSize: '0.875rem', lineHeight: 1.65,
                color: 'var(--text-secondary)',
              }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="animate-fade-in-up delay-500 mt-12 w-full flex flex-wrap justify-center gap-8">
          {[
            { value: '∞', label: 'Meals Trackable' },
            { value: 'AI', label: 'Powered Insights' },
            { value: '24/7', label: 'Always Available' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className="gradient-text"
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 900,
                }}
              >
                {stat.value}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.06em', fontWeight: 500 }}>
                {stat.label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
