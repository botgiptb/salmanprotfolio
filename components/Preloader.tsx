"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = ["S", "A", "L", "M", "A", "N"];
const TOTAL_MS = 3200;

const STATUSES = [
  { at: 0,  text: "INITIALIZING CREATIVE ENVIRONMENT" },
  { at: 28, text: "LOADING PORTFOLIO ASSETS"           },
  { at: 58, text: "CALIBRATING COLOR SPACES & LUTS"    },
  { at: 85, text: "RENDERING FINAL COMPOSITION"        },
];

export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const dismissedRef = useRef(false);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    try { sessionStorage.setItem("preloader-done", "1"); } catch (_) {}
    setProgress(100);
    setTimeout(() => setVisible(false), 450);
  };

  useEffect(() => {
    // Never show on admin routes (no usePathname — avoids Suspense requirement)
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      return;
    }

    // Skip if already played this session
    try {
      if (sessionStorage.getItem("preloader-done")) {
        return;
      }
    } catch (_) {}

    // Show preloader
    setVisible(true);
  }, []);

  // Run the counter whenever visible flips to true
  useEffect(() => {
    if (!visible) return;

    dismissedRef.current = false;
    setProgress(0);

    const intervalMs = 30;
    const steps = Math.ceil(TOTAL_MS / intervalMs);
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      const pct = Math.min(Math.round((current / steps) * 100), 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(dismiss, 350);
      }
    }, intervalMs);

    // Hard failsafe — never stay longer than 6 s
    const failsafe = setTimeout(dismiss, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(failsafe);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const activeLetterIdx = Math.min(
    Math.floor((progress / 100) * LETTERS.length),
    LETTERS.length - 1
  );
  let statusText = STATUSES[0].text;
  for (const s of STATUSES) { if (progress >= s.at) statusText = s.text; }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#060608] text-zinc-100 select-none overflow-hidden"
        >
          {/* ── Ambient glow blobs ── */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-purple/25 blur-[120px] pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-cyan/20 blur-[120px] pointer-events-none"
          />

          {/* ── Subtle grid ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* ── Corner brackets ── */}
          <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-brand-purple/40 rounded-tl" />
          <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-brand-cyan/40 rounded-tr" />
          <div className="absolute bottom-20 left-8 w-8 h-8 border-b-2 border-l-2 border-brand-cyan/40 rounded-bl" />
          <div className="absolute bottom-20 right-8 w-8 h-8 border-b-2 border-r-2 border-brand-purple/40 rounded-br" />

          {/* ── Main content ── */}
          <div className="relative w-full max-w-[500px] px-8 flex flex-col items-center gap-10">

            {/* ── SALMAN letters ── */}
            <div className="flex items-end gap-3 md:gap-5">
              {LETTERS.map((l, i) => {
                const lit = i <= activeLetterIdx && progress > 0;
                return (
                  <motion.span
                    key={i}
                    animate={{
                      color: lit ? "#f4f4f5" : "rgba(39,39,42,0.18)",
                      textShadow: lit
                        ? "0 0 30px rgba(139,92,246,0.6), 0 0 60px rgba(6,182,212,0.25)"
                        : "none",
                      y: lit ? -4 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="font-display text-6xl md:text-8xl font-black leading-none"
                  >
                    {l}
                  </motion.span>
                );
              })}
            </div>

            {/* ── Divider with pulsing dot ── */}
            <div className="w-full flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-zinc-800/60" />
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-brand-cyan"
              />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-zinc-800/60" />
            </div>

            {/* ── Progress group ── */}
            <div className="w-full flex flex-col items-center gap-4">

              {/* Status + percentage */}
              <div className="w-full flex justify-between items-baseline px-1">
                <span className="font-heading text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-500">
                  {statusText}
                </span>
                <span className="font-heading font-black text-sm tracking-widest text-zinc-200 tabular-nums">
                  {progress}<span className="text-brand-cyan">%</span>
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full h-[2px] bg-zinc-900 rounded-full overflow-visible relative">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-brand-purple via-violet-400 to-brand-cyan rounded-full relative transition-[width] duration-75 ease-linear"
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_8px_#06b6d4] -mr-1" />
                </div>
              </div>

              {/* Version label */}
              <p className="font-heading text-[8px] font-semibold tracking-[0.3em] uppercase text-zinc-700">
                Creative Studio Suite · v1.5
              </p>
            </div>
          </div>

          {/* ── Skip button ── */}
          <button
            onClick={dismiss}
            className="absolute bottom-10 px-5 py-2 rounded-lg border border-zinc-800 bg-zinc-950/70 text-[9px] font-heading font-bold tracking-[0.25em] uppercase text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 transition-all duration-200 cursor-pointer backdrop-blur-sm"
          >
            Skip Intro
          </button>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
