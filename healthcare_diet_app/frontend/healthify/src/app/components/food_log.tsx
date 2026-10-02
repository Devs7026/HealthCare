import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface FoodForm {
  food: string;
  quantity: string;
  meal: string;
  date: string;
}

const MEAL_OPTIONS = [
  { value: 'breakfast', label: '🌅 Breakfast', color: '#f59e0b' },
  { value: 'lunch',     label: '☀️ Lunch',     color: '#22d3ee' },
  { value: 'dinner',    label: '🌙 Dinner',    color: '#6366f1' },
  { value: 'snack',     label: '🍎 Snack',     color: '#10b981' },
];

const Food: React.FC = () => {
  const [form, setForm] = useState<FoodForm>({ food: '', quantity: '', meal: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/foodlogs/', form);
      toast.success('Food logged successfully! 🎉');
      setForm({ food: '', quantity: '', meal: '', date: '' });
      setSelectedMeal('');
    } catch {
      toast.error('Error logging food. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '560px', margin: '0 auto', width: '100%' }}>
      
      {/* Header */}
      <div className="animate-fade-in-down" style={{ marginBottom: '1.75rem' }}>
        <span className="pill-badge mb-3 inline-flex">🍽️ Food Log</span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
          Log a Meal
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Track what you eat to build healthy habits.
        </p>
      </div>

      <div className="animate-fade-in-up delay-100">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Food Item */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
              FOOD ITEM
            </label>
            <input
              type="text"
              name="food"
              value={form.food}
              onChange={handleChange}
              placeholder="e.g. Roti, Beans, Dal, Salad..."
              required
              className="glass-input"
            />
          </div>

          {/* Quantity */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
              QUANTITY
            </label>
            <input
              type="text"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 2 pieces, 100g, 1 bowl..."
              required
              className="glass-input"
            />
          </div>

          {/* Meal — pill selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
              MEAL TYPE
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {MEAL_OPTIONS.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => { setSelectedMeal(m.value); setForm(f => ({ ...f, meal: m.value })); }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: `1px solid ${selectedMeal === m.value ? m.color + '60' : 'rgba(255,255,255,0.1)'}`,
                    background: selectedMeal === m.value ? m.color + '20' : 'rgba(255,255,255,0.04)',
                    color: selectedMeal === m.value ? m.color : 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    fontWeight: selectedMeal === m.value ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedMeal === m.value ? `0 0 12px ${m.color}30` : 'none',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {/* Hidden select for form validation */}
            <input type="hidden" name="meal" value={form.meal} required />
          </div>

          {/* Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
              DATE
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              onClick={e => e.currentTarget.showPicker?.()}
              required
              className="glass-input"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !form.meal}
            style={{
              marginTop: '0.5rem',
              padding: '0.875rem',
              borderRadius: '0.875rem',
              border: 'none',
              background: loading || !form.meal
                ? 'rgba(99,102,241,0.2)'
                : 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: loading || !form.meal ? 'var(--text-muted)' : 'white',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: loading || !form.meal ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: !loading && form.meal ? '0 4px 20px rgba(99,102,241,0.3)' : 'none',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Logging...
              </>
            ) : (
              <>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Log Food
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Food;
