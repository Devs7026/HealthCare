'use client'
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Header from "./components/header";
import Footer from "./components/footer";
import About from "./components/About";
import Dashboard from "./components/DashBoard";
import Log_data from "./components/Log";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Chatbot = dynamic(() => import("./components/chatbot"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--accent-indigo)', borderTopColor: 'transparent' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading AI Assistant...</span>
      </div>
    </div>
  ),
  ssr: false,
});

const HealthLinks = dynamic(() => import("./components/health_links"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--accent-cyan)', borderTopColor: 'transparent' }} />
    </div>
  ),
  ssr: false,
});

const CaloriesTab = dynamic(() => import("./components/calories_tab"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--accent-emerald)', borderTopColor: 'transparent' }} />
    </div>
  ),
  ssr: false,
});

/* ── Icons ─────────────────────────────────────────────── */

const HomeIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const LogIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ChatIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const LinksIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CaloriesIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

type View = 'home' | 'dashboard' | 'log' | 'chatbot' | 'links' | 'calories';

interface NavItem {
  id: View;
  label: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',      label: 'Home',         icon: <HomeIcon />,      color: '#6366f1', glowColor: 'rgba(99,102,241,0.3)' },
  { id: 'dashboard', label: 'Dashboard',    icon: <DashboardIcon />, color: '#a855f7', glowColor: 'rgba(168,85,247,0.3)' },
  { id: 'log',       label: 'Health Log',   icon: <LogIcon />,       color: '#22d3ee', glowColor: 'rgba(34,211,238,0.3)' },
  { id: 'chatbot',   label: 'AI Assistant', icon: <ChatIcon />,      color: '#10b981', glowColor: 'rgba(16,185,129,0.3)' },
  { id: 'links',     label: 'Resources',    icon: <LinksIcon />,     color: '#f59e0b', glowColor: 'rgba(245,158,11,0.3)' },
  { id: 'calories',  label: 'Calories',     icon: <CaloriesIcon />,  color: '#f43f5e', glowColor: 'rgba(244,63,94,0.3)' },
];

export default function Home() {
  const [activeView, setActiveView] = useState<View>('home');
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<View | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [pageKey, setPageKey] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX <= 12) {
        setSidePanelOpen(true);
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
      } else if (sidePanelOpen) {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        closeTimeout.current = setTimeout(() => setSidePanelOpen(false), 900);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, [sidePanelOpen]);

  const handleNavClick = (view: View) => {
    setActiveView(view);
    setPageKey(k => k + 1);
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => setSidePanelOpen(false), 300);
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'var(--bg-void)' }}>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 h-full z-50 flex flex-col"
        style={{
          width: sidePanelOpen ? '220px' : '0px',
          background: 'rgba(13, 17, 23, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: sidePanelOpen ? '1px solid rgba(255,255,255,0.07)' : 'none',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          boxShadow: sidePanelOpen ? '4px 0 40px rgba(0,0,0,0.5)' : 'none',
        }}
        onMouseEnter={() => {
          if (closeTimeout.current) clearTimeout(closeTimeout.current);
          setSidePanelOpen(true);
        }}
        onMouseLeave={() => {
          closeTimeout.current = setTimeout(() => setSidePanelOpen(false), 400);
        }}
      >
        {/* Sidebar header */}
        <div style={{ padding: '2rem 1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', minWidth: '220px' }}>
          <div className="flex items-center gap-2.5">
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              boxShadow: '0 0 8px rgba(99,102,241,0.6)',
            }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              NAVIGATION
            </span>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: '1rem 0.75rem', minWidth: '220px' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            const isHovered = hoveredNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  marginBottom: '0.25rem',
                  position: 'relative',
                  background: isActive
                    ? `rgba(${item.id === 'home' ? '99,102,241' : item.id === 'dashboard' ? '168,85,247' : item.id === 'log' ? '34,211,238' : item.id === 'chatbot' ? '16,185,129' : item.id === 'links' ? '245,158,11' : '244,63,94'},0.12)`
                    : isHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
                  boxShadow: isActive ? `0 0 20px ${item.glowColor}` : 'none',
                }}
              >
                {/* Active indicator bar */}
                <div style={{
                  position: 'absolute',
                  left: 0, top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: isActive ? '60%' : '0%',
                  borderRadius: '0 3px 3px 0',
                  background: item.color,
                  transition: 'height 0.25s ease',
                }} />
                
                {/* Icon */}
                <span style={{
                  color: isActive ? item.color : isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  display: 'flex', alignItems: 'center',
                }}>
                  {item.icon}
                </span>

                {/* Label */}
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sidebar footer branding */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', minWidth: '220px' }}>
          <div className="flex items-center gap-2">
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a855f7, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Healthify</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>v2.0 · Premium</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Edge trigger hint */}
      <div
        className="fixed left-0 top-1/2 z-40 cursor-pointer"
        style={{
          width: '4px',
          height: '60px',
          transform: 'translateY(-50%)',
          background: sidePanelOpen ? 'transparent' : 'linear-gradient(180deg, #6366f1, #a855f7)',
          borderRadius: '0 4px 4px 0',
          opacity: sidePanelOpen ? 0 : 0.7,
          transition: 'opacity 0.3s ease',
          boxShadow: '2px 0 12px rgba(99,102,241,0.4)',
        }}
        onClick={() => setSidePanelOpen(true)}
      />

      {/* ── Main content ─────────────────────────────────── */}
      <Header />

      <main key={pageKey} className="flex-1 flex flex-col animate-fade-in-up">
        {activeView === 'home'      && <About onBack={() => {}} onGetStarted={() => handleNavClick('log')} />}
        {activeView === 'dashboard' && <Dashboard onClose={() => handleNavClick('home')} />}
        {activeView === 'log'       && <Log_data />}
        {activeView === 'chatbot'   && <Chatbot />}
        {activeView === 'links'     && <HealthLinks />}
        {activeView === 'calories'  && <CaloriesTab />}
      </main>

      <Footer />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderLeft: '3px solid var(--accent-indigo)',
          color: 'var(--text-primary)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
        }}
      />
    </div>
  );
}
