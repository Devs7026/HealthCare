import React from 'react';

const Chatbot: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-gray-800 rounded-lg shadow-lg p-8 mt-12">
      <h2 className="text-2xl font-bold text-white mb-4">AI Medical Chatbot</h2>
      {/* Replace this with your chatbot widget or iframe */}
      <div className="w-full h-96 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400">
        Chatbot will appear here.
      </div>
    </div>
  );
};

export default Chatbot; 