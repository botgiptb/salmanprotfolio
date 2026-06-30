"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = ["S", "A", "L", "M", "A", "N"];
const TOTAL_MS = 3000;

const STATUSES = [
  { at: 0,  text: "INITIALIZING ENVIRONMENT"  },
  { at: 30, text: "LOADING PORTFOLIO ASSETS"   },
  { at: 60, text: "CALIBRATING COLOR SPACES"   },
  { at: 88, text: "RENDERING COMPOSITION"      },
];

export default function Preloader() {
  const [visible, setVisible]   = useState(true);   // ← optimistic: always show; hide after check
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    // 1. Skip on admin pages
    if (window.location.pathname.startsWith("/admin")) {
      setVisible(false);
      return;
    }
    // 2. Skip if already played this session
    try {
      if (sessionStorage.getItem("preloader-done")) {
        setVisible(false);
        return;
      }
    } catch (_) {}

    // 3. Run counter
    doneRef.current = false;
    const STEP = 25;                         // tick every 25 ms
    const totalSteps = Math.ceil(TOTAL_MS / STEP);
    let tick = 0;

    const dismiss = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      try { sessionStorage.setItem("preloader-done", "1"); } catch (_) {}
      setProgress(100);
      setTimeout(() => setVisible(false), 500);
    };

    const id = setInterval(() => {
      tick++;
      const pct = Math.min(Math.round((tick / totalSteps) * 100), 100);
      setProgress(pct);
      if (pct >= 100) { clearInterval(id); dismiss(); }
    }, STEP);

    // Absolute failsafe: dismiss after 6 s no matter what
    const fs = setTimeout(dismiss, 6000);

    return () => { clearInterval(id); clearTimeout(fs); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Derived display values ── */
  const lit = Math.min(Math.floor((progress / 100) * LETTERS.length), LETTERS.length - 1);
  let status = STATUSES[0].text;
  for (const s of STATUSES) { if (progress >= s.at) status = s.text; }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050507] select-none overflow-hidden"
        >
          {/* ── Ambient blobs ── */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.22, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[480px] h-[480px] rounded-full bg-brand-purple/20 blur-[130px] pointer-events-none -top-10 -left-20"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.06, 0.16, 0.06] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute w-[380px] h-[380px] rounded-full bg-brand-cyan/15 blur-[120px] pointer-events-none bottom-0 right-0"
          />

          {/* ── Grid dots ── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.15) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* ── Corner brackets ── */}
          {[
            "top-6 left-6 border-t-2 border-l-2 border-brand-purple/50 rounded-tl",
            "top-6 right-6 border-t-2 border-r-2 border-brand-cyan/50 rounded-tr",
            "bottom-16 left-6 border-b-2 border-l-2 border-brand-cyan/50 rounded-bl",
            "bottom-16 right-6 border-b-2 border-r-2 border-brand-purple/50 rounded-br",
          ].map((cls) => (
            <div key={cls} className={`absolute w-7 h-7 ${cls}`} />
          ))}

          {/* ── Content ── */}
          <div className="relative flex flex-col items-center gap-8 w-full max-w-[480px] px-8">

            {/* Letters */}
            <div className="flex items-center gap-2 md:gap-4">
              {LETTERS.map((l, i) => (
                <motion.span
                  key={i}
                  animate={{
                    color:      i <= lit && progress > 0 ? "#f4f4f5" : "rgba(39,39,42,0.16)",
                    textShadow: i <= lit && progress > 0
                      ? "0 0 28px rgba(139,92,246,0.65), 0 0 55px rgba(6,182,212,0.3)"
                      : "none",
                    y: i <= lit && progress > 0 ? -5 : 0,
                  }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="font-display text-[clamp(2.8rem,10vw,6rem)] font-black leading-none"
                >
                  {l}
                </motion.span>
              ))}
            </div>

            {/* Thin rule */}
            <div className="w-full flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-brand-cyan inline-block"
              />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
            </div>

            {/* Progress block */}
            <div className="w-full flex flex-col gap-3">
              {/* Status row */}
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-heading font-bold tracking-[0.22em] uppercase text-zinc-600">
                  {status}
                </span>
                <span className="font-heading font-black text-xs tracking-widest text-zinc-300 tabular-nums">
                  {progress}<span className="text-brand-cyan">%</span>
                </span>
              </div>

              {/* Bar */}
              <div className="w-full h-[2px] bg-zinc-900 rounded-full overflow-visible">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-purple via-violet-400 to-brand-cyan relative transition-[width] duration-[25ms] ease-linear"
                >
                  {progress > 1 && (
                    <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_10px_#06b6d4,0_0_20px_rgba(6,182,212,0.5)]" />
                  )}
                </div>
              </div>

              <p className="text-center font-heading text-[7px] font-semibold tracking-[0.35em] uppercase text-zinc-700">
                Creative Studio · v2.0
              </p>
            </div>
          </div>

          {/* Skip */}
          <button
            onClick={() => {
              doneRef.current = true;
              try { sessionStorage.setItem("preloader-done", "1"); } catch (_) {}
              setVisible(false);
            }}
            className="absolute bottom-8 px-5 py-2 rounded-lg border border-zinc-800/80 bg-zinc-950/60 text-[8px] font-heading font-bold tracking-[0.3em] uppercase text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 cursor-pointer backdrop-blur-sm transition-all duration-200"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
