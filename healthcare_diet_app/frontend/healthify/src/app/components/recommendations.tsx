import React from 'react';
import '../css/food_log.css';
import { BulbOutlined } from '@ant-design/icons';

const Recommendations = () => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 sm:px-4 md:px-8 py-8 mt-5"
      style={{
        backgroundImage: "url('./recomm.jpeg')",
        borderRadius: '100px'
      }}
    >
      {/* Gradient border wrapper */}
      <div className="p-1 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Card */}
        <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl font-sans">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 text-gray-800 tracking-tight flex items-center justify-center gap-2">
            <BulbOutlined /> RECOMMENDATIONS TAB
          </h1>
          {/* Recommendations framework */}
          <div className="space-y-4">
            <div className="w-full p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center text-gray-400 font-medium text-lg">
              No recommendations yet.
            </div>
            {/* 
             Recommendations yet to be configured
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
