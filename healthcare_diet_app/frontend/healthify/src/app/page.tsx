'use client'
import { useState, useEffect, useRef } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Food from "./components/food_log";
import History from "./components/history_log";
import Symptoms from "./components/symptoms_log";
import Recommendations from "./components/recommendations";
import About from "./components/About";
import Dashboard from "./components/DashBoard";
import Log_data from "./components/Log";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// You can use any dashboard icon, here is a simple SVG for demonstration
const DashboardIcon = () => (
  <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor"/>
    <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor"/>
    <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor"/>
    <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor"/>
  </svg>
);

const LogIcon = () => (
  <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16v2H4zm0 4h16v2H4zm0 4h10v2H4zm0 4h10v2H4z" />
  </svg>
);

export default function Home() {
  // Tab management
  const [activeTab, setActiveTab] = useState<"food" | "history" | "symptoms" | "recommendations" | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  // Sidepanel state
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX <= 10) { // 10px from the left edge
        setSidePanelOpen(true);
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
      } else if (sidePanelOpen) {
        // Start a timer to close if mouse leaves panel
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        closeTimeout.current = setTimeout(() => setSidePanelOpen(false), 1000);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, [sidePanelOpen]);

  // Sidepanel content
  const SidePanel = (
    <div
      className={`fixed top-0 left-0 h-full z-40 bg-gray-900 shadow-2xl transition-transform duration-300
        ${sidePanelOpen ? 'translate-x-0' : '-translate-x-full'}
        w-20 flex flex-col items-center pt-8`}
      onMouseEnter={() => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        setSidePanelOpen(true);
      }}
      onMouseLeave={() => {
        closeTimeout.current = setTimeout(() => setSidePanelOpen(false), 500);
      }}
    >
      <button
        className={`mb-6 p-3 rounded-full hover:bg-gray-700 transition-colors ${showDashboard ? "bg-blue-700" : ""}`}
        title="Dashboard"
        onClick={() => { setShowDashboard(true); setShowLog(false); }}
      >
        <DashboardIcon />
      </button>
      <button
        className={`mb-6 p-3 rounded-full hover:bg-gray-700 transition-colors ${showLog ? "bg-green-700" : ""}`}
        title="Log"
        onClick={() => { setShowLog(true); setShowDashboard(false); }}
      >
        <LogIcon />
      </button>
      {/* Add more icons/buttons here if needed */}
    </div>
  );


  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      {SidePanel}
      <Header />
      {showDashboard ? (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto mt-12">
          <Dashboard onClose={() => setShowDashboard(false)} />
        </div>
      ) : showLog ? (
        <Log_data />
      ) : (
        <About onBack={() => {}} />
      )}
      <Footer />
    </div>
  );
}
