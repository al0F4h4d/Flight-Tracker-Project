"use client";

import { useEffect, useState } from "react";
import { Plane, Compass, ArrowRight } from "lucide-react";

export default function WelcomeOverlay() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDismiss = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
    }, 600); // match transition duration
  };

  useEffect(() => {
    // Smooth progress bar animation over 2.5 seconds
    const interval = 25; // 25ms tick
    const totalDuration = 2500;
    const step = 100 / (totalDuration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          clearInterval(timer);
          handleDismiss();
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex items-center justify-center cursor-pointer transition-opacity duration-600 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: "rgba(11, 15, 25, 0.96)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Decorative Radar Sweep Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-20">
        <div className="w-[300px] h-[300px] rounded-full border border-cyan-500 animate-ping absolute" />
        <div className="w-[500px] h-[500px] rounded-full border border-cyan-500/40 absolute" />
        <div className="w-[750px] h-[750px] rounded-full border border-cyan-500/20 absolute" />
        <div className="w-[1000px] h-[1000px] rounded-full border border-cyan-500/10 absolute" />
      </div>

      {/* Main Glass Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full mx-4 p-8 glass-panel text-center flex flex-col items-center gap-6 shadow-2xl border border-cyan-500/30 transform transition-all animate-aircraft-appear"
        style={{
          background: "linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(11, 15, 25, 0.98))",
          boxShadow: "0 0 50px rgba(6, 182, 212, 0.2)",
        }}
      >
        {/* Animated Badge Icon */}
        <div className="relative flex items-center justify-center">
          <span className="absolute w-20 h-20 rounded-full bg-cyan-500/20 animate-ping" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0F19] rounded-2xl flex items-center justify-center">
              <Plane size={32} className="text-cyan-400 -rotate-45" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Compass size={12} className="animate-spin text-cyan-400" style={{ animationDuration: "8s" }} />
            <span>Radar System Online</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-2">
            Welcome From <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">FAHAD</span>
          </h1>

          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Live Global Flight Radar & Cockpit Telemetry Dashboard
          </p>
        </div>

        {/* Progress Bar & Launch Button */}
        <div className="w-full space-y-4 pt-2">
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-75 ease-out rounded-full shadow-sm shadow-cyan-400"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={handleDismiss}
            className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-slate-900 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
          >
            <span>Enter Radar Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 font-mono">
          Auto-launching in {Math.max(1, Math.ceil((100 - progress) / 40))}s · Click anywhere to skip
        </p>
      </div>
    </div>
  );
}
