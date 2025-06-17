import React, { useState, ChangeEvent, FormEvent } from 'react';
import '../css/food_log.css';

const Food = () => {
  const [form, setForm] = useState({
    food: '',
    quantity: '',
    meal: '',
    date: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Food logged!');
    setForm({ food: '', quantity: '', meal: '', date: '' });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 sm:px-4 md:px-8 py-8"
      style={{
        backgroundImage: "url('./Board.jpeg')",
      }}
    >
      {/* Gradient border wrapper */}
      <div className="p-1 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Card */}
        <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl font-sans">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 text-gray-800 tracking-tight">FOOD LOG</h1>
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Food Item */}
            <div>
              <label className="form-tags block mb-1 sm:mb-2 text-base sm:text-md font-semibold text-gray-700">Food Item</label>
              <input
                type="text"
                name="food"
                value={form.food}
                onChange={handleChange}
                placeholder="e.g. Apple"
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 text-gray-800 text-base bg-gray-50"
              />
            </div>
            {/* Quantity */}
            <div>
              <label className="form-tags block mb-1 sm:mb-2 text-base sm:text-md font-semibold text-gray-700">Quantity</label>
              <input
                type="text"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 2 pieces, 100g"
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 text-gray-800 text-base bg-gray-50"
              />
            </div>
            {/* Meal */}
            <div>
              <label className="form-tags block mb-1 sm:mb-2 text-base sm:text-md font-semibold text-gray-700">Meal</label>
              <select
                name="meal"
                value={form.meal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 text-gray-800 text-base bg-gray-50"
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
              <label className="form-tags block mb-1 sm:mb-2 text-base sm:text-md font-semibold text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 text-gray-800 text-base bg-gray-50"
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 sm:py-3 mt-2 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-150"
            >
              Log Food
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Food;
