'use client'
import React, { useState, useRef, useEffect } from 'react';
import { SendOutlined, RobotOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI medical assistant. I can help you with questions about health conditions, symptoms, and general medical information. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 
  useEffect(() => {
    checkChatbotStatus();
  }, []);

  const checkChatbotStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/chatbot/status/');
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.gemini_api_key === '✓' && data.pinecone_api_key === '✓');
      }
    } catch (error) {
      console.error('Error checking chatbot status:', error);
      setIsConnected(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage.text }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.answer,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorData = await response.json();
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Sorry, I encountered an error: ${errorData.error || 'Unknown error'}. Please try again.`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting to the server. Please check your internet connection and try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-gray-800 rounded-lg shadow-lg p-8 mt-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-full">
              <RobotOutlined className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Medical Assistant</h2>
              <p className="text-gray-300 text-sm">
                Powered by Google Gemini • {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-gray-900 rounded-lg h-96 overflow-y-auto p-4 mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <RobotOutlined className="text-blue-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <UserOutlined className="text-blue-200 mt-1 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <RobotOutlined className="text-blue-400" />
                    <div className="flex items-center space-x-1">
                      <LoadingOutlined className="animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about health conditions, symptoms, or medical information..."
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={isLoading || !isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading || !isConnected}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SendOutlined />
          </button>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-200 text-sm">
              ⚠️ Chatbot is not connected. Please ensure the backend server is running and API keys are configured.
            </p>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            💡 Try asking questions like: "What are the symptoms of diabetes?" or "How can I manage high blood pressure?"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 