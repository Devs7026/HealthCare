import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

interface FoodLog {
  id: number;
  food: string;
  quantity: string;
  meal: string;
  date: string;
}

const MEAL_COLORS: Record<string, { color: string; bg: string; icon: string }> = {
  breakfast: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '🌅' },
  lunch:     { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  icon: '☀️' },
  dinner:    { color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  icon: '🌙' },
  snack:     { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: '🍎' },
};

const groupByDate = (logs: FoodLog[]) =>
  logs.reduce((acc: Record<string, FoodLog[]>, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});

const History: React.FC = () => {
  const [foodLogs,     setFoodLogs]     = useState<FoodLog[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [filterDate,   setFilterDate]   = useState('');
  const [filteredLogs, setFilteredLogs] = useState<FoodLog[]>([]);
  const [deleteId,     setDeleteId]     = useState<number | null>(null);
  const [editLog,      setEditLog]      = useState<FoodLog | null>(null);
  const [editForm,     setEditForm]     = useState({ food: '', quantity: '', meal: '', date: '' });
  const [infoMsg,      setInfoMsg]      = useState<string | null>(null);

  const fetchFoodLogs = async (date?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/foodlogs/', {
        params: date ? { date } : undefined,
      });
      setFoodLogs(response.data);
      setFilteredLogs(response.data);
    } catch {
      setError('Failed to fetch food history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setFilterDate(today);
    fetchFoodLogs(today);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/foodlogs/${id}/`);
      setFoodLogs(prev => prev.filter(l => l.id !== id));
      setFilteredLogs(prev => prev.filter(l => l.id !== id));
      setDeleteId(null);
    } catch {
      setError('Failed to delete food log');
    }
  };

  const handleEditClick = (log: FoodLog) => {
    setEditLog(log);
    setEditForm({ food: log.food, quantity: log.quantity, meal: log.meal, date: log.date });
    setInfoMsg(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLog) return;
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/foodlogs/${editLog.id}/`, editForm);
      setFoodLogs(prev => prev.map(l => l.id === editLog.id ? response.data : l));
      setFilteredLogs(prev => prev.map(l => l.id === editLog.id ? response.data : l));
      setEditLog(null);
      setInfoMsg('Food log updated successfully!');
      setTimeout(() => setInfoMsg(null), 3000);
    } catch {
      setError('Failed to update food log');
    }
  };

  const handleFilter = () => fetchFoodLogs(filterDate || undefined);

  const downloadCSV = () => {
    const headers = ['Food Item', 'Quantity', 'Meal', 'Date'];
    const rows    = filteredLogs.map(l => [l.food, l.quantity, l.meal, l.date]);
    const csv     = [headers, ...rows]
      .map(row => row.map(f => '"' + String(f).replace(/"/g, '""') + '"').join(','))
      .join('\r\n');
    saveAs(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'food_log_history.csv');
  };

  const logsByDate  = groupByDate(filteredLogs);
  const sortedDates = Object.keys(logsByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div className="animate-fade-in-down" style={{ marginBottom: '1.5rem' }}>
        <span className="pill-badge mb-3 inline-flex">📅 Food History</span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
          Meal History
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Browse, edit and export your food log records.
        </p>
      </div>

      {/* Filter bar */}
      <div
        className="animate-fade-in-up"
        style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.625rem',
          padding: '1rem 1.25rem',
          borderRadius: '1rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          marginBottom: '1.25rem',
          alignItems: 'center',
        }}
      >
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          style={{ colorScheme: 'dark' }}
          className="glass-input"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.625rem',
            color: 'var(--text-primary)',
            padding: '0.5rem 0.875rem',
            fontSize: '0.875rem',
            outline: 'none',
            colorScheme: 'dark',
          } as React.CSSProperties}
        />
        <button
          onClick={handleFilter}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '0.625rem',
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: 'white',
            fontSize: '0.85rem', fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Filter
        </button>
        <button
          onClick={() => { setFilterDate(''); fetchFoodLogs(); }}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '0.625rem',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem', fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={downloadCSV}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.625rem',
            border: '1px solid rgba(16,185,129,0.3)',
            background: 'rgba(16,185,129,0.1)',
            color: '#10b981',
            fontSize: '0.85rem', fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Status messages */}
      {infoMsg && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', fontSize: '0.875rem' }}>
          ✅ {infoMsg}
        </div>
      )}
      {error && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#f43f5e', fontSize: '0.875rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '72px', borderRadius: '0.875rem' }} />)}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div style={{
          padding: '3rem', textAlign: 'center', borderRadius: '1.25rem',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            No food history found
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Try a different date or log some meals first.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {sortedDates.map(date => (
            <div key={date}>
              {/* Date header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                marginBottom: '0.75rem',
              }}>
                <div style={{
                  padding: '0.3rem 0.875rem',
                  borderRadius: '9999px',
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  fontSize: '0.8rem', fontWeight: 700,
                  color: 'var(--accent-indigo)',
                }}>
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {logsByDate[date].length} item{logsByDate[date].length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Entries */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {logsByDate[date].map(log => {
                  const meal = MEAL_COLORS[log.meal] || { color: '#6366f1', bg: 'rgba(99,102,241,0.08)', icon: '🍴' };
                  return (
                    <div key={log.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.875rem 1.25rem',
                      borderRadius: '0.875rem',
                      background: meal.bg,
                      border: `1px solid ${meal.color}25`,
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                        <span style={{ fontSize: '1.1rem' }}>{meal.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                            {log.food}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {log.quantity} · <span style={{ color: meal.color, textTransform: 'capitalize' }}>{log.meal}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditClick(log)}
                          style={{
                            padding: '0.35rem 0.875rem', borderRadius: '0.5rem',
                            border: '1px solid rgba(99,102,241,0.3)',
                            background: 'rgba(99,102,241,0.1)',
                            color: '#6366f1', fontSize: '0.8rem', fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(log.id)}
                          style={{
                            padding: '0.35rem 0.875rem', borderRadius: '0.5rem',
                            border: '1px solid rgba(244,63,94,0.3)',
                            background: 'rgba(244,63,94,0.1)',
                            color: '#f43f5e', fontSize: '0.8rem', fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      {/* Delete confirm */}
                      {deleteId === log.id && (
                        <div style={{
                          position: 'fixed', inset: 0, zIndex: 100,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                        }}>
                          <div style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid rgba(244,63,94,0.3)',
                            borderRadius: '1.25rem',
                            padding: '2rem',
                            maxWidth: '380px', width: '90vw',
                            textAlign: 'center',
                          }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🗑️</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Delete this record?</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                              "{log.food}" — {log.meal} on {date}
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                              <button onClick={() => handleDelete(log.id)} style={{
                                padding: '0.6rem 1.5rem', borderRadius: '0.75rem',
                                border: 'none', background: '#f43f5e',
                                color: 'white', fontWeight: 700, cursor: 'pointer',
                              }}>Delete</button>
                              <button onClick={() => setDeleteId(null)} style={{
                                padding: '0.6rem 1.5rem', borderRadius: '0.75rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.06)',
                                color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer',
                              }}>Cancel</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editLog && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
        }}>
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '1.5rem',
            padding: '2rem',
            maxWidth: '420px', width: '90vw',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              ✏️ Edit Food Log
            </h2>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(['food', 'quantity'] as const).map(field => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    {field.toUpperCase()}
                  </label>
                  <input
                    type="text" name={field}
                    value={editForm[field]}
                    onChange={handleEditChange}
                    required className="glass-input"
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  MEAL
                </label>
                <select
                  name="meal" value={editForm.meal} onChange={handleEditChange} required
                  className="glass-input"
                >
                  <option value="">Select meal</option>
                  {['breakfast','lunch','dinner','snack'].map(m => (
                    <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  DATE
                </label>
                <input
                  type="date" name="date"
                  value={editForm.date}
                  onChange={handleEditChange}
                  required className="glass-input"
                  style={{ colorScheme: 'dark' } as React.CSSProperties}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" style={{
                  flex: 1, padding: '0.75rem', borderRadius: '0.75rem',
                  border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  color: 'white', fontWeight: 700, cursor: 'pointer',
                }}>Save Changes</button>
                <button type="button" onClick={() => setEditLog(null)} style={{
                  flex: 1, padding: '0.75rem', borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer',
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
