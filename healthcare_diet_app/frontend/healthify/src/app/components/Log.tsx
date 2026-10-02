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

type Tab = "food" | "history" | "symptoms" | "recommendations" | "calorie";

const TABS: { id: Tab; label: string; icon: string; color: string }[] = [
  { id: "food",            label: "Food Log",       icon: "🍽️", color: "#22d3ee" },
  { id: "history",         label: "History",        icon: "📅", color: "#f59e0b" },
  { id: "symptoms",        label: "Symptoms",       icon: "🩺", color: "#f43f5e" },
  { id: "recommendations", label: "Advice",         icon: "✨", color: "#10b981" },
  { id: "calorie",         label: "Calorie Lookup", icon: "🔥", color: "#a855f7" },
];

export default function Log_data() {
  const [activeTab, setActiveTab] = useState<Tab>("food");
  const [foodLogs,      setFoodLogs]      = useState<FoodLog[]>([]);
  const [foodCalories,  setFoodCalories]  = useState<FoodCalories>({});
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const foodRes = await fetch(`http://127.0.0.1:8000/api/foodlogs/?date=${today}`);
        const foodData = await foodRes.json();
        setFoodLogs(foodData);

        const response = await fetch('/food_calories.csv');
        const csvText  = await response.text();
        const lines    = csvText.split('\n');
        const caloriesData: FoodCalories = {};
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const [food, calories] = line.split(',');
            if (food && calories) caloriesData[food.toLowerCase()] = parseInt(calories);
          }
        }
        setFoodCalories(caloriesData);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let total = 0;
    foodLogs.forEach(log => {
      const getCaloriesForFood = (name: string): number => {
        const n = name.toLowerCase().trim();
        if (foodCalories[n]) return foodCalories[n];
        for (const [food, cal] of Object.entries(foodCalories)) {
          if (n.includes(food) || food.includes(n)) return cal;
        }
        return 0;
      };
      const cal = getCaloriesForFood(log.food) * 6;
      if (cal > 0) {
        const qty = log.quantity.toLowerCase();
        let m = 1;
        if (qty.includes('2') || qty.includes('two'))       m = 2;
        else if (qty.includes('3') || qty.includes('three')) m = 3;
        else if (qty.includes('4') || qty.includes('four'))  m = 4;
        else if (qty.includes('5') || qty.includes('five'))  m = 5;
        else if (qty.includes('1/2') || qty.includes('0.5')) m = 0.5;
        else if (qty.includes('1/4') || qty.includes('0.25')) m = 0.25;
        total += cal * m;
      }
    });
    setTotalCalories(Math.round(total));
  }, [foodLogs, foodCalories]);

  return (
    <div className="flex flex-col w-full" style={{ minHeight: '70vh' }}>

      {/* Sticky pill tab bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(5, 8, 16, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0.75rem 1rem',
      }}>
        <div style={{
          display: 'flex',
          gap: '0.375rem',
          maxWidth: '800px',
          margin: '0 auto',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: `1px solid ${isActive ? tab.color + '40' : 'rgba(255,255,255,0.08)'}`,
                  background: isActive
                    ? `rgba(${tab.id === 'food' ? '34,211,238' : tab.id === 'history' ? '245,158,11' : tab.id === 'symptoms' ? '244,63,94' : tab.id === 'recommendations' ? '16,185,129' : '168,85,247'},0.12)`
                    : 'rgba(255,255,255,0.04)',
                  color: isActive ? tab.color : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.01em',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? `0 0 16px rgba(${tab.id === 'food' ? '34,211,238' : tab.id === 'history' ? '245,158,11' : tab.id === 'symptoms' ? '244,63,94' : tab.id === 'recommendations' ? '16,185,129' : '168,85,247'},0.2)` : 'none',
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 animate-fade-in-up" style={{ padding: '0' }}>
        {activeTab === "food"            && <Food />}
        {activeTab === "history"         && <History />}
        {activeTab === "symptoms"        && <Symptoms />}
        {activeTab === "recommendations" && <Recommendations totalCalories={totalCalories} loading={loading} />}
        {activeTab === "calorie"         && <CalorieLookup />}
      </div>
    </div>
  );
}