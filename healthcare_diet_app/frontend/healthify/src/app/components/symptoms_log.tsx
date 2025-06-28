import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import '../css/symptoms_log.css';
import { SmileOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

const SymptomsLog: React.FC = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);
  const [form, setForm] = useState<SymptomForm>({
    symptom: '',
    severity: '',
    notes: '',
    occurred_at: '',
    food_log: '',
  });

  useEffect(() => {
    fetchSymptoms();
    fetchFoodLogs();
  }, []);

  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/symptoms/');
      setSymptoms(res.data);
    } catch (error) {
      toast.error('Failed to fetch symptoms!');
    } finally {
      setLoading(false);
    }
  };

  const fetchFoodLogs = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/foodlogs/');
      setFoodLogs(res.data);
    } catch (error) {
      toast.error('Failed to fetch food logs!');
    }
  };

  const openModal = (symptom: Symptom | null = null) => {
    setEditingSymptom(symptom);
    setForm(
      symptom
        ? {
            symptom: symptom.symptom,
            severity: String(symptom.severity),
            notes: symptom.notes,
            occurred_at: symptom.occurred_at.slice(0, 16),
            food_log: String(symptom.food_log),
          }
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
      if (editingSymptom) {
        await axios.put(`http://127.0.0.1:8000/api/symptoms/${editingSymptom.id}/`, {
          ...form,
          severity: Number(form.severity),
          food_log: Number(form.food_log),
        });
        toast.success('Symptom updated!');
      } else {
        await axios.post('http://127.0.0.1:8000/api/symptoms/', {
          ...form,
          severity: Number(form.severity),
          food_log: Number(form.food_log),
        });
        toast.success('Symptom logged!');
      }
      setShowModal(false);
      setEditingSymptom(null);
      setForm({ symptom: '', severity: '', notes: '', occurred_at: '', food_log: '' });
      fetchSymptoms();
    } catch (error: any) {
      toast.error(
        error.response?.data
          ? Object.values(error.response.data).join(' ')
          : 'Error saving symptom! Please try again'
      );
      console.error(error.response?.data || error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/symptoms/${id}/`);
      toast.success('Symptom deleted!');
      fetchSymptoms();
    } catch (error) {
      toast.error('Failed to delete symptom!');
    }
  };

  
  const downloadCSV = () => {
    const headers = ['Symptom', 'Severity', 'Notes', 'Occurred At', 'Food Log'];
    const rows = symptoms.map(symp => [
      symp.symptom,
      symp.severity,
      symp.notes,
      symp.occurred_at.replace('T', ' ').slice(0, 16),
      (() => {
        const food = foodLogs.find(f => f.id === symp.food_log);
        return food ? `${food.food} (${food.meal} on ${food.date})` : symp.food_log;
      })()
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => '"' + String(field).replace(/"/g, '""') + '"').join(','))
      .join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'symptoms_log.csv');
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 sm:px-4 md:px-8 py-8 mt-5"
      style={{
        backgroundImage: "url('./symp.jpeg')",
        borderRadius: '100px'
      }}
    >
      <div className="p-1 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 rounded-2xl shadow-2xl w-full max-w-4xl">
        <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl font-sans">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 text-gray-800 tracking-tight flex items-center justify-center gap-2">
            <SmileOutlined /> SYMPTOMS LOG
          </h1>
          <div className="flex justify-center mb-4">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mr-2"
              onClick={downloadCSV}
              type="button"
              style={{ marginRight: 8 }}
            >
              Download CSV
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={() => openModal()}
            >
              <PlusOutlined /> New Record
            </button>
          </div>
          {loading ? (
            <div className="w-full flex justify-center items-center py-12">
              <Spin size="large" />
            </div>
          ) : symptoms.length === 0 ? (
            <div className="w-full p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center text-gray-400 font-medium text-lg">
              No symptoms recorded yet.
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Symptom</th>
                    <th>Severity</th>
                    <th>Notes</th>
                    <th>Occurred At</th>
                    <th>Food Log</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {symptoms.map((symp) => (
                    <tr key={symp.id}>
                      <td data-label="Symptom">{symp.symptom}</td>
                      <td data-label="Severity">{symp.severity}</td>
                      <td data-label="Notes">{symp.notes}</td>
                      <td data-label="Occurred At">
                        {symp.occurred_at.replace('T', ' ').slice(0, 16)}
                      </td>
                      <td data-label="Food Log">
                        {foodLogs.find(f => f.id === symp.food_log)
                          ? `${foodLogs.find(f => f.id === symp.food_log)?.food} (${foodLogs.find(f => f.id === symp.food_log)?.meal} on ${foodLogs.find(f => f.id === symp.food_log)?.date})`
                          : symp.food_log}
                      </td>
                      <td data-label="Actions">
                        <button
                          className="action-btn edit"
                          onClick={() => openModal(symp)}
                          title="Edit"
                        >
                          <EditOutlined />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(symp.id)}
                          title="Delete"
                        >
                          <DeleteOutlined />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-responsive">
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingSymptom ? 'Edit Symptom' : 'New Symptom'}
            </h2>
            <form onSubmit={handleSubmit} className="symptom-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="block mb-1 font-medium">
                    Symptom<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="symptom"
                    value={form.symptom}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block mb-1 font-medium">
                    Severity (1-10)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="severity"
                    min="1"
                    max="10"
                    value={form.severity}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="block mb-1 font-medium">Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    rows={2}
                  />
                </div>
                <div className="form-group">
                  <label className="block mb-1 font-medium">
                    Occurred At<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="occurred_at"
                    value={form.occurred_at}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group w-full">
                  <label className="block mb-1 font-medium">
                    Food Log<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="food_log"
                    value={form.food_log}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Food Log</option>
                    {foodLogs.map((log) => (
                      <option key={log.id} value={log.id}>
                        {log.food} ({log.meal} on {log.date})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className="flex items-center gap-2">
                      Saving <Spin size="small" />
                    </span>
                  ) : editingSymptom ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SymptomsLog;
