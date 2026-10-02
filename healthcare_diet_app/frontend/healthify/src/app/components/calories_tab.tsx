import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface FoodLog {
  id: number;
  food: string;
  quantity: string;
  meal: string;
  date: string;
}

interface FoodCalories {
  [key: string]: number;
}

const MEAL_COLORS: Record<string, { color: string; bg: string; icon: string }> = {
  breakfast: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '🌅' },
  lunch:     { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  icon: '☀️' },
  dinner:    { color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  icon: '🌙' },
  snack:     { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: '🍎' },
};

const CaloriesTab: React.FC = () => {
  const [todayFoodLogs, setTodayFoodLogs] = useState<FoodLog[]>([]);
  const [foodCalories, setFoodCalories] = useState<FoodCalories>({});
  const [loading, setLoading] = useState(true);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const loadCaloriesData = async () => {
      try {
        const response = await fetch('/food_calories.csv');
        const csvText  = await response.text();
        const lines    = csvText.split('\n');
        const data: FoodCalories = {};
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const [food, calories] = line.split(',');
            if (food && calories) data[food.toLowerCase()] = parseInt(calories);
          }
        }
        setFoodCalories(data);
      } catch {
        toast.error('Error loading calorie data');
      }
    };
    loadCaloriesData();
  }, []);

  useEffect(() => {
    const fetchTodayFoodLogs = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const res   = await axios.get(`http://127.0.0.1:8000/api/foodlogs/?date=${today}`);
        setTodayFoodLogs(res.data);
      } catch {
        toast.error("Error fetching today's food logs");
      } finally {
        setLoading(false);
      }
    };
    fetchTodayFoodLogs();
  }, []);

  const getCaloriesForFood = (foodName: string): number => {
    const n = foodName.toLowerCase().trim();
    if (foodCalories[n]) return foodCalories[n];
    for (const [food, cal] of Object.entries(foodCalories)) {
      if (n.includes(food) || food.includes(n)) return cal;
    }
    return 0;
  };

  useEffect(() => {
    let total = 0;
    todayFoodLogs.forEach(log => {
      const cal = getCaloriesForFood(log.food) * 5;
      if (cal > 0) {
        const qty = log.quantity.toLowerCase();
        let m = 1;
        if (qty.includes('2') || qty.includes('two'))        m = 2;
        else if (qty.includes('3') || qty.includes('three')) m = 3;
        else if (qty.includes('4') || qty.includes('four'))  m = 4;
        else if (qty.includes('5') || qty.includes('five'))  m = 5;
        else if (qty.includes('1/2') || qty.includes('0.5')) m = 0.5;
        else if (qty.includes('1/4') || qty.includes('0.25')) m = 0.25;
        total += cal * m;
      }
    });
    setTotalCalories(Math.round(total));
  }, [todayFoodLogs, foodCalories]);

  const DAILY_GOAL = 2500;
  const progress   = Math.min((totalCalories / DAILY_GOAL) * 100, 100);
  const progressColor = progress > 120 ? '#f43f5e' : progress > 80 ? '#10b981' : '#6366f1';

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '680px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div className="animate-fade-in-down" style={{ marginBottom: '1.75rem' }}>
        <span className="pill-badge mb-3 inline-flex">🔥 Today</span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
          Daily Calories
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          📅 {today}
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="skeleton" style={{ height: '140px', borderRadius: '1.25rem' }} />
          <div className="skeleton" style={{ height: '80px', borderRadius: '1rem' }} />
          <div className="skeleton" style={{ height: '80px', borderRadius: '1rem' }} />
        </div>
      ) : (
        <>
          {/* Calorie summary card */}
          <div
            className="animate-fade-in-up glass-card"
            style={{ padding: '1.75rem', marginBottom: '1.25rem', textAlign: 'center' }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              TOTAL CONSUMED TODAY
            </div>
            <div style={{
              fontSize: 'clamp(3rem, 10vw, 4.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              backgroundImage: `linear-gradient(135deg, ${progressColor}, ${progressColor}99)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.25rem',
            }}>
              {totalCalories}
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              kcal out of {DAILY_GOAL} goal
            </div>

            {/* Progress bar */}
            <div style={{
              marginTop: '1.25rem',
              height: '8px', borderRadius: '9999px',
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: '9999px',
                background: `linear-gradient(90deg, ${progressColor}80, ${progressColor})`,
                transition: 'width 1s ease',
                boxShadow: `0 0 10px ${progressColor}50`,
              }} />
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {progress.toFixed(0)}% of daily goal
            </div>
          </div>

          {/* Food log list */}
          {todayFoodLogs.length === 0 ? (
            <div style={{
              padding: '3rem', textAlign: 'center',
              borderRadius: '1.25rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🍽️</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                No meals logged today
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Head to the Food Log tab to start tracking your meals.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                TODAY'S MEALS
              </h3>
              {todayFoodLogs.map((log, i) => {
                const cal  = getCaloriesForFood(log.food) * 6;
                const meal = MEAL_COLORS[log.meal] || { color: '#6366f1', bg: 'rgba(99,102,241,0.08)', icon: '🍴' };
                return (
                  <div
                    key={log.id}
                    className={`animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.875rem 1.25rem',
                      borderRadius: '0.875rem',
                      background: meal.bg,
                      border: `1px solid ${meal.color}25`,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{meal.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                          {log.food}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                          {log.quantity} · <span style={{ color: meal.color, textTransform: 'capitalize' }}>{log.meal}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.9rem', fontWeight: 700,
                      color: cal > 0 ? meal.color : 'var(--text-muted)',
                      background: cal > 0 ? `${meal.color}15` : 'transparent',
                      padding: '0.25rem 0.75rem', borderRadius: '9999px',
                    }}>
                      {cal > 0 ? `${cal} kcal` : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Disclaimer */}
          <div style={{
            marginTop: '1.5rem', padding: '0.875rem 1rem',
            borderRadius: '0.875rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6,
          }}>
            💡 <strong style={{ color: 'var(--text-secondary)' }}>Note:</strong> Calorie estimates are based on standard serving sizes. Actual calories may vary.
          </div>
        </>
      )}
    </div>
  );
};

export default CaloriesTab;