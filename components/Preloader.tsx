"use client";

import { useEffect, useRef, useState } from "react";

/* Total animation duration — must match CSS pl-bar animation */
const DISMISS_AFTER = 3600; // ms

const LETTERS = ["S", "A", "L", "M", "A", "N"];

export default function Preloader() {
  const [mounted, setMounted] = useState(true);
  const [fade, setFade] = useState(false);
  const doneRef = useRef(false);

  const dismiss = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    try { sessionStorage.setItem("preloader-done", "1"); } catch (_) {}
    setFade(true);
    setTimeout(() => {
      setMounted(false);
    }, 850); // Unmount from DOM after transition completes
  };

  useEffect(() => {
    // Never show on /admin
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      setMounted(false);
      return;
    }
    // Skip if already played this session
    try {
      if (sessionStorage.getItem("preloader-done")) {
        setMounted(false);
        return;
      }
    } catch (_) {}

    // Single timeout — the ONLY dismiss mechanism needed
    const t = setTimeout(dismiss, DISMISS_AFTER);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        transition: "transform 0.85s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.85s cubic-bezier(0.76, 0, 0.24, 1)",
        transform: fade ? "translateY(-100%)" : "translateY(0%)",
        opacity: fade ? 0 : 1,
        pointerEvents: fade ? "none" : "auto",
      }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050507] select-none overflow-hidden"
    >
      {/* ── Ambient blobs ── */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-purple/15 blur-[140px] pointer-events-none top-0 left-0 -translate-x-1/3 -translate-y-1/3 animate-float-pulse" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-cyan/12 blur-[130px] pointer-events-none bottom-0 right-0 translate-x-1/3 translate-y-1/3" style={{ animation: "float-pulse 7s ease-in-out infinite 2s" }} />

      {/* ── Dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.12) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          opacity: 0.4,
        }}
      />

      {/* ── Corner brackets ── */}
      <div className="absolute top-6 left-6 w-7 h-7 border-t-2 border-l-2 border-brand-purple/50 rounded-tl" />
      <div className="absolute top-6 right-6 w-7 h-7 border-t-2 border-r-2 border-brand-cyan/50 rounded-tr" />
      <div className="absolute bottom-16 left-6 w-7 h-7 border-b-2 border-l-2 border-brand-cyan/50 rounded-bl" />
      <div className="absolute bottom-16 right-6 w-7 h-7 border-b-2 border-r-2 border-brand-purple/50 rounded-br" />

      {/* ── Main content ── */}
      <div className="relative flex flex-col items-center gap-8 w-full max-w-[480px] px-8">

        {/* Letters — each lights up via CSS animation delay */}
        <div className="flex items-center gap-2 md:gap-4">
          {LETTERS.map((l, i) => (
            <span
              key={i}
              className="pl-letter font-display font-black leading-none"
              style={{
                fontSize: "clamp(2.8rem,10vw,6rem)",
                animationDelay: `${(i / LETTERS.length) * 2.6}s`,
              } as React.CSSProperties}
            >
              {l}
            </span>
          ))}
        </div>

        {/* Thin rule with pulsing dot */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse inline-block" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        {/* Progress block */}
        <div className="w-full flex flex-col gap-3">
          {/* Label row */}
          <div className="flex justify-between items-center px-0.5">
            <span className="pl-status text-[8px] font-heading font-bold tracking-[0.22em] uppercase text-zinc-600" />
            <span className="pl-pct text-xs font-heading font-black tracking-widest text-zinc-300 tabular-nums" />
          </div>

          {/* CSS-driven bar ── */}
          <div className="w-full h-[2px] bg-zinc-900 rounded-full overflow-visible">
            <div className="pl-bar h-full rounded-full bg-gradient-to-r from-brand-purple via-violet-400 to-brand-cyan relative">
              <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_10px_#06b6d4,0_0_20px_rgba(6,182,212,0.4)]" />
            </div>
          </div>

          <p className="text-center font-heading text-[7px] font-semibold tracking-[0.35em] uppercase text-zinc-700">
            Creative Studio · v2.0
          </p>
        </div>
      </div>

      {/* Skip */}
      <button
        onClick={dismiss}
        className="absolute bottom-8 px-5 py-2 rounded-lg border border-zinc-800/80 bg-zinc-950/60 text-[8px] font-heading font-bold tracking-[0.3em] uppercase text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 cursor-pointer backdrop-blur-sm transition-all duration-200"
      >
        Skip Intro
      </button>
    </div>
  );
}
