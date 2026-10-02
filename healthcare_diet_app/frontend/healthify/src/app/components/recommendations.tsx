import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Symptom {
  id: number;
  symptom: string;
  severity: number;
  notes: string;
  occurred_at: string;
  food_log: number;
}

const calorieThresholds = { low: 2000, high: 3000 };

interface RecommendationsProps {
  totalCalories: number;
  loading: boolean;
}

const Recommendations: React.FC<RecommendationsProps> = ({ totalCalories, loading }) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [symptomsLoading, setSymptomsLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      setSymptomsLoading(true);
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/symptoms/');
        setSymptoms(res.data);
      } catch { /* silent */ }
      finally { setSymptomsLoading(false); }
    };
    fetchSymptoms();
  }, []);

  const getSymptomAdvice = () => {
    if (!symptoms.length) return null;
    const recent = symptoms[symptoms.length - 1];
    if (!recent) return null;
    if (recent.severity >= 7) {
      return { icon: '⚠️', text: `Severe symptom recorded: "${recent.symptom}". Consider consulting a healthcare professional if it persists.`, color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)' };
    }
    if (recent.symptom.toLowerCase().includes('headache')) {
      return { icon: '💧', text: 'You logged a headache. Stay hydrated and take screen breaks. Magnesium-rich foods may also help.', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' };
    }
    if (recent.symptom.toLowerCase().includes('stomach')) {
      return { icon: '🥗', text: 'Stomach issues? Try lighter, easily digestible foods and avoid spicy or fatty meals.', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' };
    }
    return { icon: '📋', text: `Recent symptom: "${recent.symptom}". Keep monitoring and stay consistent with your logging.`, color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' };
  };

  const getCalorieAdvice = () => {
    if (typeof totalCalories !== 'number' || isNaN(totalCalories) || totalCalories === 0) {
      return { icon: '🍽️', text: 'No food logged today. Log your meals to get personalized calorie advice!', color: 'var(--text-secondary)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' };
    }
    if (totalCalories < calorieThresholds.low) {
      return { icon: '⚡', text: 'Your calorie intake seems low today. Consider a healthy snack or a balanced meal to meet your energy needs.', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' };
    }
    if (totalCalories > calorieThresholds.high) {
      return { icon: '🚶', text: "You've consumed quite a few calories today. Try lighter meals for dinner or go for a walk to stay on track!", color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)' };
    }
    return { icon: '✅', text: 'Great job! Your calorie intake is within a healthy range today. Keep it up!', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' };
  };

  const isLoading = loading || symptomsLoading;
  type Rec = { icon: string; text: string; color: string; bg: string; border: string };
  const recommendations: Rec[] = [getCalorieAdvice(), getSymptomAdvice()].filter((r): r is Rec => r !== null);

  const tips = [
    { icon: '🥤', text: 'Drink 8 glasses of water daily to stay hydrated and energized.' },
    { icon: '🥦', text: 'Fill half your plate with vegetables and fruits at every meal.' },
    { icon: '😴', text: 'Quality sleep of 7–9 hours helps regulate appetite hormones.' },
    { icon: '🏃', text: 'Aim for 30 minutes of moderate exercise most days of the week.' },
  ];

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div className="animate-fade-in-down" style={{ marginBottom: '1.75rem' }}>
        <span className="pill-badge mb-3 inline-flex">✨ Personalized Advice</span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
          Recommendations
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Based on your food logs and symptom tracking.
        </p>
      </div>

      {/* Dynamic recommendations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
        {isLoading ? (
          [1, 2].map(i => (
            <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '1rem' }} />
          ))
        ) : recommendations.length > 0 ? (
          recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`animate-fade-in-up delay-${(idx + 1) * 100}`}
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '1.25rem',
                borderRadius: '1rem',
                background: rec.bg,
                border: `1px solid ${rec.border}`,
              }}
            >
              <div style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: '0.1rem' }}>{rec.icon}</div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-primary)', margin: 0 }}>
                {rec.text}
              </p>
            </div>
          ))
        ) : (
          <div style={{
            padding: '2rem', textAlign: 'center', borderRadius: '1rem',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            color: 'var(--text-muted)',
          }}>
            Log meals and symptoms to receive personalized recommendations.
          </div>
        )}
      </div>

      {/* Static health tips */}
      <div style={{ marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.03em', marginBottom: '1rem' }}>
          GENERAL HEALTH TIPS
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {tips.map((tip, i) => (
            <div
              key={i}
              className={`animate-fade-in-up delay-${(i + 3) * 100}`}
              style={{
                display: 'flex', gap: '0.875rem',
                padding: '1rem 1.25rem',
                borderRadius: '0.875rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{tip.icon}</span>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
