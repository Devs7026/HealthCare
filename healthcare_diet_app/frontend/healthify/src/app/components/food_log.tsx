import React, { useState, ChangeEvent, FormEvent } from 'react';

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
    // Handle form submission logic here
    alert('Food logged!');
    setForm({ food: '', quantity: '', meal: '', date: '' });
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '40px auto',
      padding: '2rem',
      borderRadius: '16px',
      background: '#fff',
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>FOOD LOG</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem', color: '#444' }}>Food Item</label>
          <input
            type="text"
            name="food"
            value={form.food}
            onChange={handleChange}
            placeholder="e.g. Apple"
            required
            style={{
              width: '100%',
              padding: '.7rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '1rem'
            }}
          />
        </div>
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem', color: '#444' }}>Quantity</label>
          <input
            type="text"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="e.g. 2 pieces, 100g"
            required
            style={{
              width: '100%',
              padding: '.7rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '1rem'
            }}
          />
        </div>
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem', color: '#444' }}>Meal</label>
          <select
            name="meal"
            value={form.meal}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '.7rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '1rem',
              background: '#f9f9f9'
            }}
          >
            <option value="">Select meal</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '.5rem', color: '#444' }}>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '.7rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '1rem'
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '.9rem',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(90deg, #7f53ac 0%, #647dee 100%)',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            letterSpacing: '1px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(100, 125, 222, 0.15)'
          }}
        >
          Log Food
        </button>
      </form>
    </div>
  );
};

export default Food;
