import React, { useEffect, useState } from 'react';
import '../css/food_log.css';
import { BulbOutlined, FireOutlined, SmileOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import axios from 'axios';

interface Symptom {
  id: number;
  symptom: string;
  severity: number;
  notes: string;
  occurred_at: string;
  food_log: number;
}

const calorieThresholds = {
  low: 2000,
  high: 3000,
};

interface RecommendationsProps {
  totalCalories: number;
  loading: boolean;
}

const Recommendations: React.FC<RecommendationsProps> = ({ totalCalories, loading }) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [symptomsLoading, setSymptomsLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      setSymptomsLoading(true);
      try {
        const sympRes = await axios.get('http://127.0.0.1:8000/api/symptoms/');
        setSymptoms(sympRes.data);
      } catch (err) {
      
      } finally {
        setSymptomsLoading(false);
      }
    };
    fetchSymptoms();
  }, []);

  const getSymptomAdvice = () => {
    if (symptoms.length === 0) return null;
    const recent = symptoms[symptoms.length - 1];
    if (!recent) return null;
    if (recent.severity >= 7) {
      return {
        icon: <WarningOutlined className="text-red-500" />, 
        text: `You reported a severe symptom: "${recent.symptom}". Consider consulting a healthcare professional if it persists.`
      };
    }
    if (recent.symptom.toLowerCase().includes('headache')) {
      return {
        icon: <SmileOutlined className="text-yellow-500" />,
        text: 'You logged a headache. Make sure to stay hydrated and take breaks from screens.'
      };
    }
    if (recent.symptom.toLowerCase().includes('stomach')) {
      return {
        icon: <SmileOutlined className="text-green-500" />,
        text: 'Stomach issues? Try eating lighter, easily digestible foods and avoid spicy meals.'
      };
    }
    return {
      icon: <SmileOutlined className="text-blue-500" />,
      text: `Recent symptom: "${recent.symptom}". Keep monitoring and take care!`
    };
  };

  const getCalorieAdvice = () => {
    if (typeof totalCalories !== 'number' || isNaN(totalCalories)) {
      return {
        icon: <FireOutlined className="text-gray-400" />,
        text: 'No food logged today. Log your meals to get personalized advice!'
      };
    }
    if (totalCalories < calorieThresholds.low) {
      return {
        icon: <FireOutlined className="text-yellow-500" />,
        text: 'Your calorie intake seems low today. Consider a healthy snack or a balanced meal to meet your energy needs.'
      };
    }
    if (totalCalories > calorieThresholds.high) {
      return {
        icon: <FireOutlined className="text-red-500" />,
        text: 'You have consumed quite a few calories today. Try lighter meals for dinner or go for a walk!'
      };
    }
    return {
      icon: <CheckCircleOutlined className="text-green-500" />,
      text: 'Great job! Your calorie intake is within a healthy range.'
    };
  };

  type Recommendation = { icon: React.ReactElement; text: string };
  const recommendations: Recommendation[] = [getCalorieAdvice(), getSymptomAdvice()].filter((rec): rec is Recommendation => rec !== null && typeof rec === 'object' && !!rec.icon && typeof rec.text === 'string');

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 sm:px-4 md:px-8 py-8 mt-5"
      style={{
        backgroundImage: "url('./recomm.jpeg')",
        borderRadius: '100px'
      }}
    >
      <div className="p-1 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl font-sans">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 text-gray-800 tracking-tight flex items-center justify-center gap-2">
            <BulbOutlined /> RECOMMENDATIONS TAB
          </h1>
          <div className="space-y-4">
            {loading || symptomsLoading ? (
              <div className="w-full flex justify-center items-center py-8">
                <Spin size="large" />
              </div>
            ) : (
              recommendations.length > 0 ? (
                recommendations.map((rec, idx) => (
                  <div key={idx} className="w-full p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center text-gray-700 font-medium text-lg flex items-center gap-3 justify-center">
                    {rec.icon}
                    {rec.text}
                  </div>
                ))
              ) : (
                <div className="w-full p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center text-gray-400 font-medium text-lg">
                  No recommendations yet.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
