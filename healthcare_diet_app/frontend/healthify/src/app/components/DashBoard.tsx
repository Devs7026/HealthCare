import { useEffect, useState } from "react";
import axios from "axios";

type DashboardProps = {
  onClose: () => void;
};

interface StatCard {
  label: string;
  icon: string;
  color: string;
  glow: string;
  value: number;
  displayValue: number;
  suffix?: string;
  description: string;
}

export default function Dashboard({ onClose }: DashboardProps) {
  const [uniqueFoodDays,    setUniqueFoodDays]    = useState(0);
  const [symptomCount,      setSymptomCount]      = useState(0);
  const [streak,            setStreak]            = useState(0);
  const [displayFoodDays,   setDisplayFoodDays]   = useState(0);
  const [displaySymptomCount, setDisplaySymptomCount] = useState(0);
  const [displayStreak,     setDisplayStreak]     = useState(0);
  const [loading,           setLoading]           = useState(true);

  const animateCount = (targetValue: number, setDisplayValue: (v: number) => void) => {
    const duration = 1500;
    const steps = 60;
    const increment = targetValue / steps;
    let currentValue = 0;
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(timer);
      }
      setDisplayValue(Math.floor(currentValue));
    }, duration / steps);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [foodRes, symptomRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/foodlogs/"),
          axios.get("http://127.0.0.1:8000/api/symptoms/"),
        ]);

        const today = new Date();
        const year  = today.getFullYear();
        const month = today.getMonth();

        const daysThisMonth = new Set(
          (foodRes.data as any[])
            .map((log: any) => log.date)
            .filter((dateStr: string) => {
              const d = new Date(dateStr);
              return d.getFullYear() === year && d.getMonth() === month;
            })
        );
        const foodDaysValue = daysThisMonth.size;
        setUniqueFoodDays(foodDaysValue);
        animateCount(foodDaysValue, setDisplayFoodDays);

        const allLoggedDays = Array.from(new Set((foodRes.data as any[]).map((log: any) => log.date)))
          .map((dateStr: unknown) => {
            const date = new Date(dateStr as string);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
          })
          .sort((a, b) => b.getTime() - a.getTime());

        let streakCount = 0;
        const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const hasTodayLog = allLoggedDays.some(d => d.getTime() === todayNormalized.getTime());

        if (hasTodayLog) {
          streakCount = 1;
          let cur = new Date(todayNormalized);
          cur.setDate(cur.getDate() - 1);
          for (const logDate of allLoggedDays) {
            if (logDate.getTime() === cur.getTime()) { streakCount++; cur.setDate(cur.getDate() - 1); }
            else if (logDate.getTime() < cur.getTime()) break;
          }
        } else {
          let cur = new Date(todayNormalized);
          cur.setDate(cur.getDate() - 1);
          for (const logDate of allLoggedDays) {
            if (logDate.getTime() === cur.getTime()) { streakCount++; cur.setDate(cur.getDate() - 1); }
            else if (logDate.getTime() < cur.getTime()) break;
          }
        }
        setStreak(streakCount);
        animateCount(streakCount, setDisplayStreak);

        const symptomValue = (symptomRes.data as any[]).length;
        setSymptomCount(symptomValue);
        animateCount(symptomValue, setDisplaySymptomCount);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const STATS = [
    {
      icon: '🍽️',
      label: 'Days Food Logged',
      description: 'Days you tracked meals this month',
      value: displayFoodDays,
      color: '#22d3ee',
      bg: 'rgba(34,211,238,0.08)',
      border: 'rgba(34,211,238,0.2)',
      glow: 'rgba(34,211,238,0.15)',
    },
    {
      icon: '🩺',
      label: 'Symptoms Tracked',
      description: 'Total symptoms you have recorded',
      value: displaySymptomCount,
      color: '#f43f5e',
      bg: 'rgba(244,63,94,0.08)',
      border: 'rgba(244,63,94,0.2)',
      glow: 'rgba(244,63,94,0.15)',
    },
    {
      icon: '✨',
      label: 'Recommendations',
      description: 'Personalized dietary insights',
      value: 0,
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.08)',
      border: 'rgba(168,85,247,0.2)',
      glow: 'rgba(168,85,247,0.15)',
    },
    {
      icon: '🔥',
      label: 'Current Streak',
      description: 'Consecutive days of logging',
      value: displayStreak,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.2)',
      glow: 'rgba(245,158,11,0.15)',
    },
  ];

  return (
    <div className="flex-1 flex flex-col px-4 py-10" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div className="animate-fade-in-down flex items-center justify-between mb-8">
        <div>
          <div className="pill-badge mb-2">📊 Overview</div>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}>
            Your Dashboard
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Track your health progress at a glance
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.75rem',
            color: 'var(--text-secondary)',
            padding: '0.6rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
      </div>

      {/* Divider */}
      <div className="divider mb-8" />

      {/* Stats Grid */}
      <div
        className="grid gap-4 mb-10"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`animate-fade-in-up delay-${(i + 1) * 100}`}
            style={{
              background: stat.bg,
              border: `1px solid ${stat.border}`,
              borderRadius: '1.25rem',
              padding: '1.5rem',
              transition: 'all 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${stat.glow}`;
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            {/* Icon */}
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{stat.icon}</div>
            {/* Value */}
            {loading ? (
              <div className="skeleton" style={{ height: '2rem', width: '60%', marginBottom: '0.5rem' }} />
            ) : (
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: stat.color,
                lineHeight: 1,
                marginBottom: '0.5rem',
                letterSpacing: '-0.03em',
              }}>
                {stat.value}
              </div>
            )}
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {stat.description}
            </div>
            {/* Subtle glow dot top-right */}
            <div style={{
              position: 'absolute', top: '1rem', right: '1rem',
              width: '8px', height: '8px', borderRadius: '50%',
              background: stat.color,
              boxShadow: `0 0 8px ${stat.color}`,
              opacity: 0.7,
            }} />
          </div>
        ))}
      </div>

      {/* Weekly activity section */}
      <div
        className="animate-fade-in-up delay-500 glass-card"
        style={{ padding: '1.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Weekly Activity</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Your logging consistency this week</p>
          </div>
          <span className="pill-badge">This Week</span>
        </div>
        {/* Day bars */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: '64px' }}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
            const height = Math.max(20, Math.floor(Math.random() * 100));
            return (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{
                  width: '100%',
                  height: `${height}%`,
                  borderRadius: '4px 4px 0 0',
                  background: i < (new Date().getDay() || 7) ? 'linear-gradient(180deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.06)',
                  transition: 'height 0.5s ease',
                  minHeight: '6px',
                }} />
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
