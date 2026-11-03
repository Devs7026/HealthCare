'use client'
import React, { useState, useRef, useEffect } from 'react';
import { SendOutlined } from '@ant-design/icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const SUGGESTIONS = [
  "What are symptoms of diabetes?",
  "How to lower blood pressure?",
  "What foods boost immunity?",
];

const renderFormattedContent = (text: string, isUser: boolean) => {
  if (isUser) {
    return (
      <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#ffffff', margin: 0, whiteSpace: 'pre-wrap' }}>
        {text}
      </p>
    );
  }

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul
          key={`ul-${elements.length}`}
          style={{
            margin: '0.4rem 0',
            paddingLeft: '1.25rem',
            listStyleType: 'disc',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  const parseInline = (str: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} style={{ fontWeight: 700, color: '#e0e7ff' }}>
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={match.index} style={{ fontStyle: 'italic', color: '#c7d2fe' }}>
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = match.index + token.length;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }
    return parts;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      elements.push(<div key={`gap-${index}`} style={{ height: '0.35rem' }} />);
      return;
    }

    const bulletMatch = trimmed.match(/^[*•-]\s+(.*)$/);
    if (bulletMatch) {
      currentList.push(
        <li key={`li-${index}`} style={{ fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--text-primary)' }}>
          {parseInline(bulletMatch[1])}
        </li>
      );
    } else {
      flushList();
      elements.push(
        <p key={`p-${index}`} style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-primary)', margin: '0.3rem 0' }}>
          {parseInline(trimmed)}
        </p>
      );
    }
  });

  flushList();
  return <div style={{ wordBreak: 'break-word' }}>{elements}</div>;
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI medical assistant powered by Google Gemini. Ask me anything about health conditions, symptoms, nutrition, or general medical information. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText,   setInputText]   = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => { checkChatbotStatus(); }, []);

  const checkChatbotStatus = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/chatbot/status/');
      if (res.ok) {
        const data = await res.json();
        setIsConnected(data.gemini_api_key === '✓' && data.pinecone_api_key === '✓');
      }
    } catch { setIsConnected(false); }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/chatbot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.text }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: res.ok ? data.answer : `Sorry, I encountered an error: ${data.error || 'Unknown error'}. Please try again.`,
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to the server. Please check your connection and try again.",
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } finally { setIsLoading(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    /*
     * Outer wrapper: fills the available content area and centres
     * the chat window both horizontally and vertically.
     */
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '1.25rem 1rem',
        /* Subtract the header (~120 px) + footer (~44 px) from viewport */
        minHeight: 'calc(100vh - 170px)',
        boxSizing: 'border-box',
      }}
    >
      {/*
       * Fixed-size chat window.
       * 680 px wide, 640 px tall — constant on every screen.
       * On screens narrower than ~700 px it fills the viewport instead.
       */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'min(680px, 100%)',
          height: 'min(640px, calc(100vh - 200px))',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.5rem',
          background: 'rgba(13,17,23,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)',
          overflow: 'hidden',
        }}
      >

        {/* ── Header bar ─────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            flexShrink: 0,
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          {/* Bot avatar */}
          <div
            style={{
              width: '40px', height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', flexShrink: 0,
              boxShadow: '0 0 16px rgba(99,102,241,0.35)',
              animation: 'pulse 3s ease-in-out infinite',
            }}
          >
            🤖
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              AI Medical Assistant
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Powered by Google Gemini
            </div>
          </div>

          {/* Connection badge */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              background: isConnected ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
              border: `1px solid ${isConnected ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
              fontSize: '0.72rem', fontWeight: 600,
              color: isConnected ? '#10b981' : '#f43f5e',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: isConnected ? '#10b981' : '#f43f5e',
                boxShadow: isConnected ? '0 0 6px #10b981' : '0 0 6px #f43f5e',
              }}
            />
            {isConnected ? 'Connected' : 'Offline'}
          </div>
        </div>

        {/* ── Messages area (scrollable) ──────────────── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '0.5rem',
                animation: 'fade-in-up 0.25s ease both',
              }}
            >
              {/* Bot avatar */}
              {message.sender === 'bot' && (
                <div
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', flexShrink: 0,
                  }}
                >
                  🤖
                </div>
              )}

              {/* Bubble */}
              <div
                style={{
                  maxWidth: '72%',
                  padding: '0.65rem 0.95rem',
                  borderRadius: message.sender === 'user'
                    ? '1.1rem 1.1rem 0.25rem 1.1rem'
                    : '1.1rem 1.1rem 1.1rem 0.25rem',
                  background: message.sender === 'user'
                    ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                    : 'rgba(255,255,255,0.07)',
                  border: message.sender === 'user'
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: message.sender === 'user'
                    ? '0 4px 16px rgba(99,102,241,0.3)'
                    : 'none',
                  wordBreak: 'break-word',
                }}
              >
                {renderFormattedContent(message.text, message.sender === 'user')}
                <p
                  style={{
                    fontSize: '0.68rem',
                    color: message.sender === 'user' ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)',
                    marginTop: '0.3rem', marginBottom: 0,
                    textAlign: message.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {/* User avatar */}
              {message.sender === 'user' && (
                <div
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(99,102,241,0.2)',
                    border: '1px solid rgba(99,102,241,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', flexShrink: 0,
                  }}
                >
                  👤
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <div
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', flexShrink: 0,
                }}
              >
                🤖
              </div>
              <div
                style={{
                  padding: '0.65rem 0.95rem',
                  borderRadius: '1.1rem 1.1rem 1.1rem 0.25rem',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', gap: '4px', alignItems: 'center',
                }}
              >
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick suggestions (only on first message) ── */}
        {messages.length === 1 && (
          <div
            style={{
              display: 'flex', gap: '0.4rem', flexWrap: 'wrap',
              padding: '0 1rem 0.625rem',
              flexShrink: 0,
            }}
          >
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => { setInputText(s); inputRef.current?.focus(); }}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(99,102,241,0.25)',
                  background: 'rgba(99,102,241,0.08)',
                  color: 'var(--accent-indigo)',
                  fontSize: '0.76rem', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.18)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.08)'; }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* ── Input bar ─────────────────────────────────── */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            flexShrink: 0,
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '0.625rem',
              alignItems: 'center',
              padding: '0.5rem 0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.875rem',
              transition: 'border-color 0.2s ease',
            }}
            onFocusCapture={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.5)'; }}
            onBlurCapture={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isConnected
                  ? 'Ask about health conditions, symptoms, nutrition...'
                  : 'Chatbot offline — check backend connection'
              }
              disabled={isLoading || !isConnected}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                minWidth: 0,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading || !isConnected}
              style={{
                width: '36px', height: '36px',
                borderRadius: '0.625rem',
                border: 'none',
                background: !inputText.trim() || isLoading || !isConnected
                  ? 'rgba(99,102,241,0.15)'
                  : 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: !inputText.trim() || isLoading || !isConnected
                  ? 'var(--text-muted)'
                  : 'white',
                cursor: !inputText.trim() || isLoading || !isConnected ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                boxShadow: inputText.trim() && !isLoading && isConnected
                  ? '0 4px 12px rgba(99,102,241,0.4)'
                  : 'none',
              }}
            >
              <SendOutlined />
            </button>
          </div>

          {/* Disconnected warning */}
          {!isConnected && (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.625rem',
                background: 'rgba(244,63,94,0.08)',
                border: '1px solid rgba(244,63,94,0.2)',
              }}
            >
              <span style={{ fontSize: '0.85rem' }}>⚠️</span>
              <p style={{ fontSize: '0.76rem', color: '#f43f5e', margin: 0, lineHeight: 1.4 }}>
                Chatbot offline. Ensure the backend server is running and API keys are configured.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Chatbot;