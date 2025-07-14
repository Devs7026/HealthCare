import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FireOutlined, CalendarOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FoodLog {
  id: number;
  food: string;
  quantity: string;
  meal: string;
  date: string;
}

interface FoodCalories {
  [key: string]: number;
}

const CaloriesTab: React.FC = () => {
  const [todayFoodLogs, setTodayFoodLogs] = useState<FoodLog[]>([]);
  const [foodCalories, setFoodCalories] = useState<FoodCalories>({});
  const [loading, setLoading] = useState(true);
  const [totalCalories, setTotalCalories] = useState(0);

  // Load food calories data
  useEffect(() => {
    const loadCaloriesData = async () => {
      try {
        const response = await fetch('/food_calories.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n');
        const caloriesData: FoodCalories = {};
        
       
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const [food, calories] = line.split(',');
            if (food && calories) {
              caloriesData[food.toLowerCase()] = parseInt(calories);
            }
          }
        }
        setFoodCalories(caloriesData);
      } catch (error) {
        console.error('Error loading calories data:', error);
        toast.error('Error loading calories data');
      }
    };

    loadCaloriesData();
  }, []);

 
  useEffect(() => {
    const fetchTodayFoodLogs = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get(`http://127.0.0.1:8000/api/foodlogs/?date=${today}`);
        setTodayFoodLogs(response.data);
      } catch (error) {
        console.error('Error fetching food logs:', error);
        toast.error('Error fetching today\'s food logs');
      } finally {
        setLoading(false);
      }
    };

    fetchTodayFoodLogs();
  }, []);

 
  useEffect(() => {
    let total = 0;
    todayFoodLogs.forEach(log => {
      const calories = getCaloriesForFood(log.food) * 6; 
      if (calories > 0) {
       
        const quantity = log.quantity.toLowerCase();
        let multiplier = 1;
        
        
        if (quantity.includes('2') || quantity.includes('two')) multiplier = 2;
        else if (quantity.includes('3') || quantity.includes('three')) multiplier = 3;
        else if (quantity.includes('4') || quantity.includes('four')) multiplier = 4;
        else if (quantity.includes('5') || quantity.includes('five')) multiplier = 5;
        else if (quantity.includes('1/2') || quantity.includes('0.5')) multiplier = 0.5;
        else if (quantity.includes('1/4') || quantity.includes('0.25')) multiplier = 0.25;
        
        total += calories * multiplier;
      }
    });
    setTotalCalories(Math.round(total));
  }, [todayFoodLogs, foodCalories]);

  const getCaloriesForFood = (foodName: string): number => {
    const normalizedName = foodName.toLowerCase().trim();
    
   
    if (foodCalories[normalizedName]) {
      return foodCalories[normalizedName];
    }
    
   
    for (const [food, calories] of Object.entries(foodCalories)) {
      if (normalizedName.includes(food) || food.includes(normalizedName)) {
        return calories;
      }
    }
    
    return 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 sm:px-4 md:px-8 py-8 mt-5"
        style={{
          backgroundImage: "url('./Board.jpeg')",
          borderRadius: '100px'
        }}>
        <div className="p-1 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 rounded-2xl shadow-2xl w-full max-w-lg">
          <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl font-sans flex items-center justify-center">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 sm:px-4 md:px-8 py-8 mt-5"
      style={{
        backgroundImage: "url('./Board.jpeg')",
        borderRadius: '100px'
      }}
    >
      <div className="p-1 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl font-sans">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 text-gray-800 tracking-tight">
            <FireOutlined /> Today's Calories
          </h1>
          
          <div className="mb-6 text-center">
            <div className="text-sm text-gray-600 mb-2">
              <CalendarOutlined /> {formatDate(new Date().toISOString())}
            </div>
            <div className="text-4xl font-bold text-blue-600">
              {totalCalories} calories
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Total consumed today
            </div>
          </div>

          {todayFoodLogs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg mb-2">No food logged today</div>
              <div className="text-gray-400 text-sm">Log your meals to see calorie information</div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Food Log</h2>
              {todayFoodLogs.map((log) => {
                const calories = getCaloriesForFood(log.food) * 6; 
                return (
                  <div key={log.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{log.food}</div>
                        <div className="text-sm text-gray-600">
                          {log.quantity} • {log.meal}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">
                          {calories > 0 ? `${calories} cal` : 'Unknown'}
                        </div>
                        {calories === 0 && (
                          <div className="text-xs text-gray-400">Not in database</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <strong>Note:</strong> Calorie estimates are based on standard serving sizes. 
              Actual calories may vary based on preparation method and portion size.
            </div>
          </div>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default CaloriesTab; 