import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

interface SymptomForm {
  symptom: string;
  severity: string;
  notes: string;
  occurred_at: string;
  food_log: string;
}

interface Symptom {
  id: number;
  symptom: string;
  severity: number;
  notes: string;
  occurred_at: string;
  food_log: number;
}

interface FoodLog {
  id: number;
  food: string;
  meal: string;
  date: string;
}

const getSeverityConfig = (severity: number) => {
  if (severity >= 8) return { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)', label: 'Severe' };
  if (severity >= 5) return { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Moderate' };
  return { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Mild' };
};

const SymptomsLog: React.FC = () => {
  const [symptoms,        setSymptoms]        = useState<Symptom[]>([]);
  const [foodLogs,        setFoodLogs]        = useState<FoodLog[]>([]);
  const [loading,         setLoading]         = useState(false);
  const [formLoading,     setFormLoading]     = useState(false);
  const [showModal,       setShowModal]       = useState(false);
  const [editingSymptom,  setEditingSymptom]  = useState<Symptom | null>(null);
  const [form, setForm] = useState<SymptomForm>({
    symptom: '', severity: '', notes: '', occurred_at: '', food_log: '',
  });

  useEffect(() => { fetchSymptoms(); fetchFoodLogs(); }, []);

  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/symptoms/');
      setSymptoms(res.data);
    } catch { toast.error('Failed to fetch symptoms!'); }
    finally { setLoading(false); }
  };

  const fetchFoodLogs = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/foodlogs/');
      setFoodLogs(res.data);
    } catch { toast.error('Failed to fetch food logs!'); }
  };

  const openModal = (symptom: Symptom | null = null) => {
    setEditingSymptom(symptom);
    setForm(symptom
      ? { symptom: symptom.symptom, severity: String(symptom.severity), notes: symptom.notes, occurred_at: symptom.occurred_at.slice(0, 16), food_log: String(symptom.food_log) }
      : { symptom: '', severity: '', notes: '', occurred_at: '', food_log: '' }
    );
    setShowModal(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.symptom || !form.severity || !form.occurred_at || !form.food_log) {
      toast.error('Please fill all required fields.');
      return;
    }
    setFormLoading(true);
    try {
      const payload = { ...form, severity: Number(form.severity), food_log: Number(form.food_log) };
      if (editingSymptom) {
        await axios.put(`http://127.0.0.1:8000/api/symptoms/${editingSymptom.id}/`, payload);
        toast.success('Symptom updated!');
      } else {
        await axios.post('http://127.0.0.1:8000/api/symptoms/', payload);
        toast.success('Symptom logged!');
      }
      setShowModal(false);
      setEditingSymptom(null);
      setForm({ symptom: '', severity: '', notes: '', occurred_at: '', food_log: '' });
      fetchSymptoms();
    } catch (error: any) {
      toast.error(error.response?.data ? Object.values(error.response.data).join(' ') : 'Error saving symptom!');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this symptom record?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/symptoms/${id}/`);
      toast.success('Symptom deleted!');
      fetchSymptoms();
    } catch { toast.error('Failed to delete symptom!'); }
  };

  const downloadCSV = () => {
    const headers = ['Symptom', 'Severity', 'Notes', 'Occurred At', 'Food Log'];
    const rows = symptoms.map(s => {
      const food = foodLogs.find(f => f.id === s.food_log);
      return [s.symptom, s.severity, s.notes, s.occurred_at.replace('T', ' ').slice(0, 16),
        food ? `${food.food} (${food.meal} on ${food.date})` : s.food_log];
    });
    const csv = [headers, ...rows].map(r => r.map(f => '"' + String(f).replace(/"/g, '""') + '"').join(',')).join('\r\n');
    saveAs(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'symptoms_log.csv');
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div className="animate-fade-in-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span className="pill-badge mb-3 inline-flex">🩺 Symptom Tracker</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
            Symptoms Log
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Track symptoms and connect them to your meals.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button onClick={downloadCSV} style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.55rem 1.1rem', borderRadius: '0.625rem',
            border: '1px solid rgba(16,185,129,0.3)',
            background: 'rgba(16,185,129,0.1)',
            color: '#10b981', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
          }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <button onClick={() => openModal()} style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.55rem 1.25rem', borderRadius: '0.625rem',
            border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: 'white', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Log Symptom
          </button>
        </div>
      </div>

      {/* Symptoms list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '88px', borderRadius: '0.875rem' }} />)}
        </div>
      ) : symptoms.length === 0 ? (
        <div style={{
          padding: '3rem', textAlign: 'center', borderRadius: '1.25rem',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🩺</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>No symptoms logged yet</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Start tracking symptoms to get personalized health insights.</div>
          <button onClick={() => openModal()} style={{
            padding: '0.65rem 1.5rem', borderRadius: '0.75rem',
            border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
          }}>
            Log Your First Symptom
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {symptoms.slice().reverse().map((symp, i) => {
            const sev  = getSeverityConfig(symp.severity);
            const food = foodLogs.find(f => f.id === symp.food_log);
            return (
              <div
                key={symp.id}
                className={`animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '0.875rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; }}
              >
                {/* Severity badge */}
                <div style={{
                  flexShrink: 0,
                  width: '44px', height: '44px',
                  borderRadius: '0.75rem',
                  background: sev.bg,
                  border: `1px solid ${sev.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: 800, color: sev.color,
                }}>
                  {symp.severity}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                      {symp.symptom}
                    </span>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, color: sev.color,
                      background: sev.bg, padding: '0.15rem 0.5rem',
                      borderRadius: '9999px', border: `1px solid ${sev.color}30`,
                    }}>
                      {sev.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {symp.notes && <span>{symp.notes} · </span>}
                    {symp.occurred_at.replace('T', ' ').slice(0, 16)}
                    {food && <span> · 🍽️ {food.food} ({food.meal})</span>}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => openModal(symp)} style={{
                    padding: '0.35rem 0.875rem', borderRadius: '0.5rem',
                    border: '1px solid rgba(99,102,241,0.3)',
                    background: 'rgba(99,102,241,0.1)',
                    color: '#6366f1', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(symp.id)} style={{
                    padding: '0.35rem 0.875rem', borderRadius: '0.5rem',
                    border: '1px solid rgba(244,63,94,0.3)',
                    background: 'rgba(244,63,94,0.1)',
                    color: '#f43f5e', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
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
            maxWidth: '500px', width: '92vw',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {editingSymptom ? '✏️ Edit Symptom' : '🩺 Log Symptom'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem', color: 'var(--text-secondary)',
                width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem',
              }}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Symptom + Severity row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    SYMPTOM *
                  </label>
                  <input type="text" name="symptom" value={form.symptom} onChange={handleChange} required placeholder="e.g. Headache, Fatigue..." className="glass-input" />
                </div>
                <div style={{ width: '90px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    SEVERITY *
                  </label>
                  <input type="number" name="severity" min="1" max="10" value={form.severity} onChange={handleChange} required placeholder="1–10" className="glass-input" />
                </div>
              </div>

              {/* Severity visual indicator */}
              {form.severity && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ flex: 1, height: '6px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(Number(form.severity) / 10) * 100}%`,
                      borderRadius: '9999px',
                      background: getSeverityConfig(Number(form.severity)).color,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: getSeverityConfig(Number(form.severity)).color, fontWeight: 700, minWidth: '55px' }}>
                    {getSeverityConfig(Number(form.severity)).label}
                  </span>
                </div>
              )}

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  NOTES
                </label>
                <textarea
                  name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Any additional context..."
                  className="glass-input" style={{ resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              {/* Occurred at */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  OCCURRED AT *
                </label>
                <input
                  type="datetime-local" name="occurred_at" value={form.occurred_at} onChange={handleChange} required
                  className="glass-input" style={{ colorScheme: 'dark' } as React.CSSProperties}
                />
              </div>

              {/* Food log */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  RELATED FOOD LOG *
                </label>
                <select name="food_log" value={form.food_log} onChange={handleChange} required className="glass-input">
                  <option value="">Select a food log entry...</option>
                  {foodLogs.map(log => (
                    <option key={log.id} value={log.id}>
                      {log.food} ({log.meal} on {log.date})
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit" disabled={formLoading}
                  style={{
                    flex: 1, padding: '0.75rem', borderRadius: '0.75rem',
                    border: 'none', background: formLoading ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                    color: 'white', fontWeight: 700, cursor: formLoading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  }}
                >
                  {formLoading ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Saving...
                    </>
                  ) : editingSymptom ? 'Update Symptom' : 'Log Symptom'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} disabled={formLoading} style={{
                  flex: 1, padding: '0.75rem', borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer',
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomsLog;
