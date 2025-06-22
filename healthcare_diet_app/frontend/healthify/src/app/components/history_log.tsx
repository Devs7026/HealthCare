import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/history_log.css';
import { HistoryOutlined } from '@ant-design/icons';

// Food log type definition
interface FoodLog {
  id: number;
  food: string;
  quantity: string;
  meal: string;
  date: string;
}


const groupByDate = (logs: FoodLog[]) => {
  return logs.reduce((acc: Record<string, FoodLog[]>, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});
};

const History: React.FC = () => {
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');
  const [filteredLogs, setFilteredLogs] = useState<FoodLog[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editLog, setEditLog] = useState<FoodLog | null>(null);
  const [editForm, setEditForm] = useState({ food: '', quantity: '', meal: '', date: '' });
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoodLogs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/foodlogs/');
        setFoodLogs(response.data);
        setFilteredLogs(response.data);
      } catch (err) {
        setError('Failed to fetch food history.');
      } finally {
        setLoading(false);
      }
    };
    fetchFoodLogs();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/foodlogs/${id}/`);
      setFoodLogs((prev) => prev.filter((log) => log.id !== id));
      setFilteredLogs((prev) => prev.filter((log) => log.id !== id));
      setDeleteId(null);
    } catch (err) {
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
      setFoodLogs((prev) => prev.map((log) => log.id === editLog.id ? response.data : log));
      setFilteredLogs((prev) => prev.map((log) => log.id === editLog.id ? response.data : log));
      setEditLog(null);
      setInfoMsg('Food log updated successfully!');
      setTimeout(() => setInfoMsg(null), 3000);
    } catch (err) {
      setError('Failed to update food log');
    }
  };

  const handleFilter = () => {
    if (filterDate) {
      setFilteredLogs(foodLogs.filter(log => log.date === filterDate));
    } else {
      setFilteredLogs(foodLogs);
    }
  };

  const logsByDate = groupByDate(filteredLogs);
  const sortedDates = Object.keys(logsByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 sm:px-4 md:px-8 py-8 mt-5"
      style={{
        backgroundImage: "url('./Board.jpeg')",
        borderRadius: '100px'
      }}
    >
      <div className="p-1 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 rounded-2xl shadow-2xl w-full max-w-4xl">
        <div className="history-log-card">
          <h1 className="history-log-heading">
            <span style={{ verticalAlign: 'middle', marginRight: 8 }}>
              <HistoryOutlined />
            </span>
            HISTORY OF FOOD EATEN
          </h1>
          {/* Filter Bar */}
          <div className="history-log-filterbar">
            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="border rounded px-3 py-2 text-gray-700"
              style={{ minWidth: 120 }}
            />
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={handleFilter}
            >
              Filter
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              onClick={() => { setFilterDate(''); setFilteredLogs(foodLogs); }}
            >
              Reset
            </button>
          </div>
          {infoMsg && (
            <div className="mb-4 text-green-700">{infoMsg}</div>
          )}
          {error && (
            <div className="mb-4 text-red-700">{error}</div>
          )}
          {/* SCROLLABLE CONTENT */}
          <div
            className="space-y-8"
            style={{
              maxHeight: '340px', 
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              paddingRight: '2px'
            }}
          >
            {loading ? (
              <div className="w-full p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center text-gray-400 font-medium text-lg">
                Loading food history...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="w-full p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center text-gray-400 font-medium text-lg">
                No food history found for this date.
              </div>
            ) : (
              sortedDates.map(date => (
                <div key={date} className="w-full mb-2">
                  <div className="history-log-date">{date}</div>
                  <div className="overflow-x-auto">
                    <table className="history-log-table">
                      <thead>
                        <tr>
                          <th>Food Item</th>
                          <th>Quantity</th>
                          <th>Meal</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logsByDate[date].map(log => (
                          <tr key={log.id}>
                            <td className="font-semibold">{log.food}</td>
                            <td>{log.quantity}</td>
                            <td>{log.meal}</td>
                            <td>
                              <div className="history-log-action-btns" style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(log)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteId(log.id)}
                                >
                                  Delete
                                </button>
                              </div>
                              {deleteId === log.id && (
                                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                                  <div className="bg-white p-8 rounded shadow-xl flex flex-col items-center" style={{ width: '95vw', maxWidth: 400 }}>
                                    <p className="mb-4 text-lg font-semibold">Delete this record?</p>
                                    <div className="flex gap-4 flex-wrap justify-center">
                                      <button className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition" onClick={() => handleDelete(log.id)}>Yes</button>
                                      <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={() => setDeleteId(null)}>No</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Edit Modal */}
          {editLog && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white p-8 rounded shadow-xl w-full max-w-md flex flex-col items-center text-black" style={{ width: '95vw', maxWidth: 400 }}>
                <h2 className="text-xl font-bold mb-4">Edit Food Log</h2>
                <form onSubmit={handleEditSubmit} className="w-full space-y-4">
                  <div>
                    <label className="block mb-1 font-semibold">Food Item</label>
                    <input
                      type="text"
                      name="food"
                      value={editForm.food}
                      onChange={handleEditChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Quantity</label>
                    <input
                      type="text"
                      name="quantity"
                      value={editForm.quantity}
                      onChange={handleEditChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Meal</label>
                    <select
                      name="meal"
                      value={editForm.meal}
                      onChange={handleEditChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Select meal</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={editForm.date}
                      onChange={handleEditChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div className="flex gap-4 justify-center mt-4 flex-wrap">
                    <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition">Save</button>
                    <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-red-300 transition" onClick={() => setEditLog(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
