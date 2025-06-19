'use client'
import { useState } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Food from "./components/food_log";
import History from "./components/history_log";
import Symptoms from "./components/symptoms_log";
import Recommendations from "./components/recommendations";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Home() {
  // Track which tab is open: "food", "history", "symptoms", "recommendations"
  const [activeTab, setActiveTab] = useState<"food" | "history" | "symptoms" | "recommendations" | null>(null);

  // Content for each tab
  const tabContent = {
    food: (<Food/>),
    history: (<History/>),
    symptoms: (<Symptoms/>),
    recommendations: (<Recommendations/>),
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      {/* Main Content: Four Big Buttons */}
      <main className="flex-1 flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center md:items-start mt-8 md:mt-12 px-2 sm:px-4 max-w-6xl mx-auto w-full">
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

        <button
          onClick={() => setActiveTab("history")}
          className={`w-full md:flex-1 bg-gradient-to-br from-purple-800 to-gray-800 hover:from-purple-700 hover:to-gray-700 transition-all text-white rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col items-center justify-center focus:outline-none focus:ring-4 focus:ring-purple-500 min-h-[180px] sm:min-h-[220px] ${
            activeTab === "history" ? "ring-4 ring-purple-400" : ""
          }`}
        >
          <span className="text-xl sm:text-2xl font-bold mb-2">Food History Log</span>
          <span className="text-gray-300 text-base text-center">
            How have you been eating lately?
          </span>
        </button>

        <button
          onClick={() => setActiveTab("symptoms")}
          className={`w-full md:flex-1 bg-gradient-to-br from-purple-800 to-gray-800 hover:from-purple-700 hover:to-gray-700 transition-all text-white rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col items-center justify-center focus:outline-none focus:ring-4 focus:ring-pink-500 min-h-[180px] sm:min-h-[220px] ${
            activeTab === "symptoms" ? "ring-4 ring-pink-400" : ""
          }`}
        >
          <span className="text-xl sm:text-2xl font-bold mb-2">Symptoms Log</span>
          <span className="text-gray-300 text-base text-center">
            Any new symptoms/flareups?
          </span>
        </button>

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
      </main>

      {/* Render the selected tab's content below the buttons */}
      <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
        {activeTab && tabContent[activeTab]}
      </div>

      <Footer />
    </div>
  );
}
