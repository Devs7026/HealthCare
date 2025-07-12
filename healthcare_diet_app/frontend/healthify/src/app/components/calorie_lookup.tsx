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
      .then(response => {
        if (!response.ok) throw new Error('CSV file not found');
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: ParseResult<any>) => {
            if (!results.data || !Array.isArray(results.data)) {
              setError('Invalid CSV format.');
              setLoading(false);
              return;
            }
            const data: Record<string, number> = {};
            (results.data as any[]).forEach((row) => {
              if (row.food && row.calories) {
                data[String(row.food).trim().toLowerCase()] = Number(row.calories);
              }
            });
            setCalorieData(data);
            setError(null);
            setLoading(false);
          },
          error: () => {
            setError('Failed to parse CSV.');
            setLoading(false);
          }
        });
      })
      .catch(() => {
        setError('Could not load calorie CSV file.');
        setLoading(false);
      });
  }, []);


  const filteredItems = Object.entries(calorieData)
    .filter(([item]) => item.includes(food.trim().toLowerCase()))
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 sm:px-4 md:px-8 py-8 mt-5" style={{ backgroundImage: "url('./food.jpg')", borderRadius: '100px' }}>
      <div className="p-1 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl font-sans">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 text-gray-800 tracking-tight">
            Calorie Lookup
          </h1>
          {loading ? (
            <div className="text-center text-lg text-gray-500">Loading calorie data...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-600">{error}</div>
          ) : (
            <>
              <div className="mb-6">
                <label className="form-tags block mb-1 sm:mb-2 text-base sm:text-md font-semibold text-gray-700">
                  Search Food Item
                </label>
                <input
                  type="text"
                  value={food}
                  onChange={e => setFood(e.target.value)}
                  placeholder="Type to search..."
                  className="form-phlder w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition duration-200 text-gray-800 text-base bg-gray-50"
                />
              </div>
              {/* Table of filtered food items */}
              <div className="mt-2">
                <h2 className="text-xl font-bold mb-3 text-gray-800 text-center">Food Items</h2>
                {Object.keys(calorieData).length === 0 ? (
                  <div className="text-center text-gray-500">No food items found in the CSV.</div>
                ) : (
                  <div
                    style={{ maxHeight: 340, minHeight: 340, overflowY: 'auto' }}
                    className="rounded-2xl border border-gray-200 bg-white shadow-lg flex flex-col justify-center"
                  >
                    {filteredItems.length === 0 ? (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-base">
                        No matching food items found.
                      </div>
                    ) : (
                      <table className="min-w-full text-sm text-left">
                        <thead className="sticky top-0 z-10 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100">
                          <tr>
                            <th className="px-5 py-3 font-bold text-gray-700 text-base border-b border-gray-200">Food Item</th>
                            <th className="px-5 py-3 font-bold text-gray-700 text-base border-b border-gray-200">Calories (kcal)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map(([item, cal], idx) => (
                            <tr
                              key={item}
                              className={
                                `transition-colors duration-150 ${
                                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-purple-50'
                                } hover:bg-purple-100`
                              }
                            >
                              <td className="px-5 py-2 capitalize font-medium text-gray-800">{item}</td>
                              <td className="px-5 py-2 text-gray-700">{cal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalorieLookup; 