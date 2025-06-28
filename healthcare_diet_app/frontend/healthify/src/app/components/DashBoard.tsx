import { useEffect, useState } from "react";
import axios from "axios";
import { CloseOutlined } from "@ant-design/icons";

type DashboardProps = {
  onClose: () => void;
};

export default function Dashboard({ onClose }: DashboardProps) {
  const [uniqueFoodDays, setUniqueFoodDays] = useState<number>(0);
  const [symptomCount, setSymptomCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [displayFoodDays, setDisplayFoodDays] = useState<number>(0);
  const [displaySymptomCount, setDisplaySymptomCount] = useState<number>(0);
  const [displayStreak, setDisplayStreak] = useState<number>(0);

  // Animation function
  const animateCount = (targetValue: number, setDisplayValue: (value: number) => void) => {
    const duration = 1500; // 1.5 seconds
    const steps = 60; // 60 steps for smooth animation
    const increment = targetValue / steps;
    let currentValue = 0;
    
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(timer);
      }
      setDisplayValue(Math.floor(currentValue));
    }, duration / steps);
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/foodlogs/").then(res => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); 
    
      const daysThisMonth = new Set(
        (res.data as any[])
          .map(log => log.date)
          .filter((dateStr: string) => {
            const d = new Date(dateStr);
            return d.getFullYear() === year && d.getMonth() === month;
          })
      );
      const foodDaysValue = daysThisMonth.size;
      setUniqueFoodDays(foodDaysValue);
      animateCount(foodDaysValue, setDisplayFoodDays);

      // Fix streak calculation
      const allLoggedDays = Array.from(new Set((res.data as any[]).map(log => log.date)))
        .map(dateStr => {
          const date = new Date(dateStr);
          // Normalize to start of day to avoid time comparison issues
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        })
        .sort((a, b) => b.getTime() - a.getTime()); // Sort in descending order

      // Calculate current streak
      let streakCount = 0;
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      // Check if today has a log
      const hasTodayLog = allLoggedDays.some(logDate => 
        logDate.getTime() === todayNormalized.getTime()
      );
      
      if (hasTodayLog) {
        streakCount = 1;
        let currentDate = new Date(todayNormalized);
        currentDate.setDate(currentDate.getDate() - 1); // Start checking from yesterday
        
        // Count consecutive days backwards
        for (let i = 0; i < allLoggedDays.length; i++) {
          const logDate = allLoggedDays[i];
          if (logDate.getTime() === currentDate.getTime()) {
            streakCount++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else if (logDate.getTime() < currentDate.getTime()) {
            // We've gone past the expected date, break
            break;
          }
        }
      } else {
        // No log today, check if yesterday has a log and count backwards
        let currentDate = new Date(todayNormalized);
        currentDate.setDate(currentDate.getDate() - 1); // Start from yesterday
        
        for (let i = 0; i < allLoggedDays.length; i++) {
          const logDate = allLoggedDays[i];
          if (logDate.getTime() === currentDate.getTime()) {
            streakCount++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else if (logDate.getTime() < currentDate.getTime()) {
            break;
          }
        }
      }
      
      setStreak(streakCount);
      animateCount(streakCount, setDisplayStreak);
    });
    axios.get("http://127.0.0.1:8000/api/symptoms/").then(res => {
      const symptomValue = (res.data as any[]).length;
      setSymptomCount(symptomValue);
      animateCount(symptomValue, setDisplaySymptomCount);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2 sm:px-4">
      <div className="relative w-full max-w-4xl mx-auto p-1 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 rounded-2xl shadow-2xl">
        <div className="bg-black border border-black rounded-xl p-4 sm:p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            aria-label="Close dashboard"
          >
            <CloseOutlined style={{ fontSize: 20 }} />
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Dashboard</h2>
          <p className="text-gray-300 mb-6 text-base sm:text-lg">
            Welcome to your dashboard!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 flex flex-col items-start">
              <span className="text-xl sm:text-2xl font-semibold text-pink-400 mb-1">🍽️ {displayFoodDays}</span>
              <span className="text-gray-200 text-sm sm:text-base">Days Food Logged</span>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 flex flex-col items-start">
              <span className="text-xl sm:text-2xl font-semibold text-yellow-300 mb-1">😷 {displaySymptomCount}</span>
              <span className="text-gray-200 text-sm sm:text-base">Symptoms Tracked</span>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 flex flex-col items-start">
              <span className="text-xl sm:text-2xl font-semibold text-blue-400 mb-1">🌱 0</span>
              <span className="text-gray-200 text-sm sm:text-base">Recommendations</span>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 flex flex-col items-start">
              <span className="text-xl sm:text-2xl font-semibold text-green-400 mb-1">📈 {displayStreak}</span>
              <span className="text-gray-200 text-sm sm:text-base">Consistency (Streak)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
