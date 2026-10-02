import React, { useState, useEffect } from 'react';
import Papa, { ParseResult } from 'papaparse';

const CSV_PATH = '/food_calories.csv';

const CalorieLookup: React.FC = () => {
  const [calorieData, setCalorieData] = useState<Record<string, number>>({});
  const [food, setFood] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(CSV_PATH)
      .then(r => { if (!r.ok) throw new Error('CSV not found'); return r.text(); })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: ParseResult<any>) => {
            if (!results.data || !Array.isArray(results.data)) { setError('Invalid CSV format.'); setLoading(false); return; }
            const data: Record<string, number> = {};
            (results.data as any[]).forEach(row => {
              if (row.food && row.calories) data[String(row.food).trim().toLowerCase()] = Number(row.calories);
            });
            setCalorieData(data);
            setError(null);
            setLoading(false);
          },
          error: () => { setError('Failed to parse CSV.'); setLoading(false); },
        });
      })
      .catch(() => { setError('Could not load calorie data.'); setLoading(false); });
  }, []);

  const filteredItems = Object.entries(calorieData)
    .filter(([item]) => item.includes(food.trim().toLowerCase()))
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '640px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div className="animate-fade-in-down" style={{ marginBottom: '1.75rem' }}>
        <span className="pill-badge mb-3 inline-flex">🔥 Calorie Database</span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
          Calorie Lookup
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Search {Object.keys(calorieData).length} food items for calorie information.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '52px', borderRadius: '0.75rem' }} />)}
        </div>
      ) : error ? (
        <div style={{
          padding: '1.5rem', borderRadius: '1rem', textAlign: 'center',
          background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
          color: '#f43f5e', fontSize: '0.9rem',
        }}>
          ⚠️ {error}
        </div>
      ) : (
        <>
          {/* Search input */}
          <div className="animate-fade-in-up" style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <div style={{
              position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }}>
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={food}
              onChange={e => setFood(e.target.value)}
              placeholder="Search food items... (e.g. rice, chicken, apple)"
              className="glass-input"
              style={{ paddingLeft: '2.75rem' }}
            />
            {food && (
              <button
                onClick={() => setFood('')}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  fontSize: '1.1rem', lineHeight: 1,
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Results count */}
          {food && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for "{food}"
            </div>
          )}

          {/* Results list */}
          <div
            className="animate-fade-in-up delay-100"
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '1rem',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {filteredItems.length === 0 ? (
              <div style={{
                padding: '3rem', textAlign: 'center',
                color: 'var(--text-muted)', fontSize: '0.9rem',
              }}>
                {food ? '🔍 No matching items found.' : '⬆️ Start typing to search food items.'}
              </div>
            ) : (
              <>
                {/* Table header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr auto',
                  padding: '0.75rem 1.25rem',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  position: 'sticky', top: 0,
                  background: 'rgba(13, 17, 23, 0.95)',
                  backdropFilter: 'blur(12px)',
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>FOOD ITEM</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>KCAL</span>
                </div>
                {/* Table rows */}
                {filteredItems.map(([item, cal], idx) => (
                  <div
                    key={item}
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr auto',
                      padding: '0.75rem 1.25rem',
                      borderBottom: idx < filteredItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      transition: 'background 0.15s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', textTransform: 'capitalize', fontWeight: 500 }}>
                      {item}
                    </span>
                    <span style={{
                      fontSize: '0.875rem', fontWeight: 700,
                      color: cal > 400 ? '#f43f5e' : cal > 200 ? '#f59e0b' : '#10b981',
                      background: `rgba(${cal > 400 ? '244,63,94' : cal > 200 ? '245,158,11' : '16,185,129'},0.1)`,
                      padding: '0.2rem 0.6rem', borderRadius: '9999px',
                    }}>
                      {cal}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Low (≤200)', color: '#10b981' },
              { label: 'Medium (201–400)', color: '#f59e0b' },
              { label: 'High (>400)', color: '#f43f5e' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CalorieLookup;