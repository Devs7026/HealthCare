import { useState, useEffect } from "react";
import Food from "./food_log";
import History from "./history_log";
import Symptoms from "./symptoms_log";
import Recommendations from "./recommendations";
import CalorieLookup from "./calorie_lookup";

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

export default function Log_data() {
  const [activeTab, setActiveTab] = useState<"food" | "history" | "symptoms" | "recommendations" | "calorie" | null>(null);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [foodCalories, setFoodCalories] = useState<FoodCalories>({});
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
  
        const today = new Date().toISOString().split('T')[0];
        const foodRes = await fetch(`http://127.0.0.1:8000/api/foodlogs/?date=${today}`);
        const foodData = await foodRes.json();
        setFoodLogs(foodData);
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
      } catch (err) {
   
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
   
    let total = 0;
    foodLogs.forEach(log => {
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
  }, [foodLogs, foodCalories]);

  return (
    <>
      <main className="flex-1 flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center md:items-start mt-8 md:mt-12 px-2 sm:px-4 max-w-6xl mx-auto w-full">
        {/* Food Logging Button */}
        <button
          onClick={() => setActiveTab("food")}
          className={`w-full md:flex-1 bg-gradient-to-br from-blue-800 to-gray-800 hover:from-blue-700 hover:to-gray-700 transition-all text-white rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-500 min-h-[180px] sm:min-h-[220px] ${
            activeTab === "food" ? "ring-4 ring-blue-400" : ""
          }`}
        >
          <span className="text-xl sm:text-2xl font-bold mb-2">Food Logging</span>
          <span className="text-gray-300 text-base text-center">
            Log your meals here.
          </span>
        </button>
        {/* Food History Log Button */}
        <button
          onClick={() => setActiveTab("history")}
          className={`w-full md:flex-1 bg-gradient-to-br from-yellow-800 to-gray-800 hover:from-yellow-700 hover:to-gray-700 transition-all text-white rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col items-center justify-center focus:outline-none focus:ring-4 focus:ring-yellow-500 min-h-[180px] sm:min-h-[220px] ${
            activeTab === "history" ? "ring-4 ring-yellow-400" : ""
          }`}
        >
          <span className="text-xl sm:text-2xl font-bold mb-2">Food History</span>
          <span className="text-gray-300 text-base text-center">
            View your food log history.
          </span>
        </button>
        {/* Symptoms Log Button */}
        <button
          onClick={() => setActiveTab("symptoms")}
          className={`w-full md:flex-1 bg-gradient-to-br from-red-800 to-gray-800 hover:from-red-700 hover:to-gray-700 transition-all text-white rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col items-center justify-center focus:outline-none focus:ring-4 focus:ring-red-500 min-h-[180px] sm:min-h-[220px] ${
            activeTab === "symptoms" ? "ring-4 ring-red-400" : ""
          }`}
        >
          <span className="text-xl sm:text-2xl font-bold mb-2">Symptoms Log</span>
          <span className="text-gray-300 text-base text-center">
            Track your symptoms here.
          </span>
        </button>
        {/* Recommendations Button */}
        <button
          onClick={() => setActiveTab("recommendations")}
          className={`w-full md:flex-1 bg-gradient-to-br from-green-800 to-gray-800 hover:from-green-700 hover:to-gray-700 transition-all text-white rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col items-center justify-center focus:outline-none focus:ring-4 focus:ring-green-500 min-h-[180px] sm:min-h-[220px] ${
            activeTab === "recommendations" ? "ring-4 ring-green-400" : ""
          }`}
        >
          <span className="text-xl sm:text-2xl font-bold mb-2">Recommendations</span>
          <span className="text-gray-300 text-base text-center">
            Personalized dietary advice will appear here.
          </span>
        </button>
        {/* Calorie Lookup Button */}
        <button
          onClick={() => setActiveTab("calorie")}
          className={`w-full md:flex-1 bg-gradient-to-br from-purple-800 to-gray-800 hover:from-purple-700 hover:to-gray-700 transition-all text-white rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col items-center justify-center focus:outline-none focus:ring-4 focus:ring-purple-500 min-h-[180px] sm:min-h-[220px] ${
            activeTab === "calorie" ? "ring-4 ring-purple-400" : ""
          }`}
        >
          <span className="text-xl sm:text-2xl font-bold mb-2">Calorie Lookup</span>
          <span className="text-gray-300 text-base text-center">
            Find calories for any food item.
          </span>
        </button>
      </main>
      <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
        {activeTab === "food" && <Food />}
        {activeTab === "history" && <History />}
        {activeTab === "symptoms" && <Symptoms />}
        {activeTab === "recommendations" && <Recommendations totalCalories={totalCalories} loading={loading} />}
        {activeTab === "calorie" && <CalorieLookup />}
      </div>
    </>
  );
} 