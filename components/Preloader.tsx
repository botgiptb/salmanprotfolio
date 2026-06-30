"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = ["S", "A", "L", "M", "A", "N"];
const DURATION_MS = 3500; // Animation duration in ms

const STATUSES = [
  { at: 0,  text: "INITIALIZING CREATIVE ENVIRONMENT..." },
  { at: 25, text: "ORGANIZING TIMELINES & VIDEO ASSETS..." },
  { at: 55, text: "CALIBRATING COLOR SPACES & LUTS..."   },
  { at: 85, text: "EXPORTING FINAL COMPOSITION..."       },
];

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const dismiss = () => {
    try {
      sessionStorage.setItem("preloader-done", "1");
    } catch (_) {}
    setVisible(false);
  };

  useEffect(() => {
    // Skip if already played this session
    try {
      if (sessionStorage.getItem("preloader-done")) {
        setVisible(false);
        return;
      }
    } catch (_) {}

    const startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(Math.floor((elapsed / DURATION_MS) * 100), 100);
      
      setProgress(pct);

      if (pct < 100) {
        frameId = requestAnimationFrame(tick);
      } else {
        // Safe transition delay to let user see 100% completion
        const delay = setTimeout(dismiss, 400);
        return () => clearTimeout(delay);
      }
    };

    frameId = requestAnimationFrame(tick);

    // Absolute failsafe timeout (e.g. if requestAnimationFrame gets throttled)
    const failsafe = setTimeout(dismiss, DURATION_MS + 1000);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(failsafe);
    };
  }, []);

  // Compute active letters count
  const activeLetterIdx = Math.min(
    Math.floor((progress / 100) * LETTERS.length),
    LETTERS.length - 1
  );

  // Compute active status message
  let activeStatusText = STATUSES[0].text;
  for (const s of STATUSES) {
    if (progress >= s.at) {
      activeStatusText = s.text;
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070709] text-zinc-100 select-none overflow-hidden"
        >
          {/* Scanline grid overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.15]">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-brand-purple to-transparent animate-scanline" />
          </div>

          {/* Ambient animated backdrop glow */}
          <motion.div
            animate={{
              scale: [1, 1.15, 0.95, 1.08, 1],
              opacity: [0.12, 0.25, 0.1, 0.2, 0.12],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-[360px] h-[360px] rounded-full bg-brand-cyan/20 blur-[110px] pointer-events-none"
          />

          <div className="relative w-full max-w-[440px] px-8 flex flex-col items-center gap-10">

            {/* ── Logo Letters Row ── */}
            <div className="relative w-full h-24 flex items-end justify-center border-b border-zinc-800/40 pb-4">
              <div className="flex justify-between w-full px-2">
                {LETTERS.map((l, i) => {
                  const isActive = i <= activeLetterIdx && progress > 0;
                  return (
                    <motion.span
                      key={i}
                      animate={{
                        color: isActive ? "#f4f4f5" : "rgba(39, 39, 42, 0.22)",
                        textShadow: isActive
                          ? "0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)"
                          : "none",
                        scale: isActive ? 1.12 : 1,
                      }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="font-display text-5xl md:text-7xl font-black inline-block"
                    >
                      {l}
                    </motion.span>
                  );
                })}
              </div>
            </div>

            {/* ── Progress Indicators ── */}
            <div className="w-full flex flex-col items-center gap-3">

              {/* Progress Count */}
              <span className="font-heading font-black text-sm tracking-widest text-zinc-300">
                {progress}%
              </span>

              {/* Progress Bar Container */}
              <div className="w-56 h-[3px] bg-zinc-900 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan rounded-full transition-all duration-75 ease-out"
                />
              </div>

              {/* Action Log Status */}
              <span className="font-heading text-[9px] font-bold tracking-wider uppercase text-brand-cyan text-center h-4 flex items-center justify-center">
                {activeStatusText}
              </span>

              <span className="font-heading text-[8px] font-semibold tracking-widest uppercase text-zinc-600 mt-1">
                CREATIVE STUDIO SUITE v1.5
              </span>

            </div>
          </div>

          {/* Quick skip button */}
          <button
            onClick={dismiss}
            className="absolute bottom-8 px-5 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[9px] font-heading font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-100 hover:border-zinc-650 transition-all duration-200 cursor-pointer z-50 hover:bg-zinc-850"
          >
            Skip Intro
          </button>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
