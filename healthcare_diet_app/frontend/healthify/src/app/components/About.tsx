import React, { useEffect, useRef, useState } from "react";

type AboutProps = {
  onBack: () => void;
};

const About: React.FC<AboutProps> = ({ onBack }) => {
  // Track mouse position
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Optional: Smooth glow movement
  useEffect(() => {
    if (!glowRef.current) return;
    glowRef.current.animate(
      [
        { left: glowRef.current.style.left, top: glowRef.current.style.top },
        { left: `${pos.x - 150}px`, top: `${pos.y - 150}px` },
      ],
      { duration: 200, fill: "forwards" }
    );
    glowRef.current.style.left = `${pos.x - 150}px`;
    glowRef.current.style.top = `${pos.y - 150}px`;
  }, [pos]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 relative overflow-hidden bg-black">
      {/* Cursor-following glow */}
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          left: pos.x - 150,
          top: pos.y - 150,
          width: 300,
          height: 300,
          pointerEvents: "none",
          zIndex: 0,
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(168,85,247,0.18) 60%, rgba(236,72,153,0.10) 100%)",
          filter: "blur(48px)",
          transition: "left 0.2s, top 0.2s",
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <h2
          className="
            text-4xl sm:text-5xl font-extrabold mb-8 text-center pb-2
            text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
            transition duration-300
            hover:drop-shadow-lg
            cursor-pointer
            select-none
          "
        >
          Welcome to Healthify!
        </h2>
        <p className="text-lg sm:text-xl text-gray-200 text-center max-w-2xl mb-10 bg-white/5 rounded-xl px-6 py-4 shadow border border-blue-400/10">
          <span className="font-semibold text-blue-300">Healthify</span> helps you log meals, track food history, record symptoms, and get personalized dietary recommendations—all in a clean, intuitive interface.
          <br />
          <span className="text-pink-300 font-semibold">Glow up your health journey!</span>
        </p>
      </div>
    </div>
  );
};

export default About;
