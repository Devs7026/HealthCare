import { useState } from "react";
import Food from "./food_log";
import History from "./history_log";
import Symptoms from "./symptoms_log";
import Recommendations from "./recommendations";
import CalorieLookup from "./calorie_lookup";

const tabContent = {
  food: (<Food />),
  history: (<History />),
  symptoms: (<Symptoms />),
  recommendations: (<Recommendations />),
  calorie: (<CalorieLookup />),
};

export default function Log_data() {
  const [activeTab, setActiveTab] = useState<"food" | "history" | "symptoms" | "recommendations" | "calorie" | null>(null);
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
        {activeTab && tabContent[activeTab]}
      </div>
    </>
  );
} 