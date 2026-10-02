import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full flex flex-col items-center overflow-visible relative pt-6 pb-4"
      style={{ background: 'var(--bg-void)' }}>
      
      {/* Aurora background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="aurora-blob"
          style={{
            width: 400, height: 200,
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)',
            top: '-60px', left: '50%',
            transform: 'translateX(-50%)',
            animationDuration: '10s',
          }} />
        <div className="aurora-blob"
          style={{
            width: 300, height: 150,
            background: 'radial-gradient(ellipse, rgba(168,85,247,0.2) 0%, transparent 70%)',
            top: '-40px', left: '30%',
            animationDuration: '13s',
            animationDelay: '-4s',
          }} />
        <div className="aurora-blob"
          style={{
            width: 250, height: 130,
            background: 'radial-gradient(ellipse, rgba(34,211,238,0.15) 0%, transparent 70%)',
            top: '-30px', left: '60%',
            animationDuration: '11s',
            animationDelay: '-7s',
          }} />
      </div>

      {/* Logo orb — untouched original design */}
      <div className="relative -mt-2 animate-fade-in-down" style={{ zIndex: 10 }}>
        {/* Glowing effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-700 via-blue-400 to-purple-400 blur-2xl opacity-80 animate-pulse"></div>
        {/* Icon Circle */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-1">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center shadow-2xl">
            <Image
              src="/healthify_icon.png"
              alt="Healthify Icon"
              width={56}
              height={56}
              className="z-10"
            />
          </div>
        </div>
      </div>

      {/* App branding below logo */}
      <div className="relative z-10 mt-3 flex flex-col items-center animate-fade-in-up delay-200">
        <h1 className="text-2xl font-black tracking-tight gradient-text" style={{ letterSpacing: '-0.02em' }}>
          Healthify
        </h1>
        <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          YOUR INTELLIGENT HEALTH COMPANION
        </p>
      </div>

      {/* Bottom separator line */}
      <div className="relative z-10 w-full mt-4" style={{ maxWidth: '600px' }}>
        <div className="divider" style={{ margin: '0' }} />
      </div>
    </header>
  );
}
