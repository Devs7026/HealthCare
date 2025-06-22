import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import '../css/food_log.css';
import { SignatureOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FoodForm {
  food: string;
  quantity: string;
  meal: string;
  date: string;
}

const Food: React.FC = () => {
  const [form, setForm] = useState<FoodForm>({
    food: '',
    quantity: '',
    meal: '',
    date: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/foodlogs/', form);
      toast.success('Food has been logged!');
      setForm({ food: '', quantity: '', meal: '', date: '' });
    } catch (error) {
      toast.error('Error logging food! Please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 sm:px-4 md:px-8 py-8 mt-5"
      style={{
        backgroundImage: "url('./Board.jpeg')",
        borderRadius: '100px'
      }}
    >
      {/* Gradient border wrapper */}
      <div className="p-1 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Card */}
        <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl font-sans">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 text-gray-800 tracking-tight">
            <SignatureOutlined /> FOOD LOG
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Food Item */}
            <div>
              <label className="form-tags block mb-1 sm:mb-2 text-base sm:text-md font-semibold text-gray-700">
                Food Item
              </label>
              <input
                type="text"
                name="food"
                value={form.food}
                onChange={handleChange}
                placeholder="e.g. Roti, Beans, Dal"
                required
                className="form-phlder w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 text-gray-800 text-base bg-gray-50"
              />
            </div>
            {/* Quantity */}
            <div>
              <label className="form-tags block mb-1 sm:mb-2 text-base sm:text-md font-semibold text-gray-700">
                Quantity
              </label>
              <input
                type="text"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 2 pieces, 100g"
                required
                className="form-phlder w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 text-gray-800 text-base bg-gray-50"
              />
            </div>
            {/* Meal */}
            <div>
              <label className="form-tags block mb-1 sm:mb-2 text-base sm:text-md font-semibold text-gray-700">
                Meal
              </label>
              <select
                name="meal"
                value={form.meal}
                onChange={handleChange}
                required
                className="form-phlder w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 text-gray-800 text-base bg-gray-50"
              >
                <option value="">Select meal</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            {/* Date */}
            <div>
              <label className="form-tags block mb-1 sm:mb-2 text-base sm:text-md font-semibold text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="form-phlder w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 text-gray-800 text-base bg-gray-50"
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 sm:py-3 mt-2 rounded-lg bg-black text-white font-bold text-lg shadow-lg hover:scale-104 hover:shadow-black transition-transform duration-150"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  Logging <Spin size="small" />
                </span>
              ) : (
                'Log Food'
              )}
            </button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Food;
