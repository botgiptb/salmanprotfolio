"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ArrowRight } from "lucide-react";

interface Particle { x: number; y: number; vx: number; vy: number; r: number; a: number; }

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  /* ── Particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: 65 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.4 + 0.4,
        a: Math.random() * 0.35 + 0.08,
      }));
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    window.addEventListener("resize", resize);
    canvas.parentElement?.addEventListener("mousemove", onMove as EventListener);
    canvas.parentElement?.addEventListener("mouseleave", onLeave as EventListener);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const d  = Math.hypot(dx, dy);
        let alpha = p.a;
        if (d < 110) {
          const f = (110 - d) / 110;
          p.x -= (dx / d) * f * 1.6;
          p.y -= (dy / d) * f * 1.6;
          alpha = Math.min(1, p.a + f * 0.4);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6,182,212,${alpha})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ld = Math.hypot(p.x - q.x, p.y - q.y);
          if (ld < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(139,92,246,${(90 - ld) / 90 * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("mousemove", onMove as EventListener);
      canvas.parentElement?.removeEventListener("mouseleave", onLeave as EventListener);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070709] py-24 px-4 md:px-8">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0" />

      {/* Cinematic radial glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-purple/8 blur-[160px] pointer-events-none z-0 animate-float-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-cyan/8 blur-[160px] pointer-events-none z-0" style={{ animationDelay: "2.5s" }} />

      <div className="relative max-w-6xl mx-auto text-center z-10 flex flex-col items-center">

        {/* ── Availability badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-panel text-xs font-heading font-bold text-zinc-300 mb-10 tracking-wider"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Available for Projects — Remote Worldwide
        </motion.div>

        {/* ── Main headline ── */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp
             font-display font-black tracking-tighter leading-none text-zinc-100 select-none"
          >
            MOHAMMED
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(1.8rem,8.5vw,9rem)] font-display font-black tracking-tighter leading-none select-none bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-amber bg-clip-text text-transparent animate-gradient-text text-glow-purple"
          >
            SALMAN
          </motion.h1>
        </div>

        {/* ── Role tags ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-[11px] md:text-xs font-heading font-black uppercase tracking-widest text-zinc-500 mb-6"
        >
          {["Creative Design", "Video Editing", "VFX Artist", "Campaigns"].map((t, i) => (
            <span key={t} className="flex items-center gap-5">
              {t}
              {i < 3 && <span className="text-brand-purple/60">/</span>}
            </span>
          ))}
        </motion.div>

        {/* ── Subtitle ── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="max-w-xl text-zinc-400 text-sm md:text-base leading-relaxed mb-12 px-4 font-sans"
        >
          Crafting high-impact, scroll-stopping videos, logo branding, and photorealistic VFX. Transforming raw footage into compelling digital narratives.
        </motion.p>

        {/* ── CTA buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => setIsOpen(true)}
            data-cursor="PLAY"
            className="group relative flex items-center gap-3 px-8 py-4 rounded-full bg-brand-purple text-zinc-100 font-heading font-black text-sm overflow-hidden shadow-[0_0_35px_rgba(139,92,246,0.35)] hover:shadow-[0_0_50px_rgba(139,92,246,0.55)] transition-all duration-300 cursor-pointer w-full sm:w-auto"
          >
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-brand-cyan to-brand-purple opacity-60 group-hover:w-full transition-all duration-500 ease-out" />
            <span className="relative flex items-center gap-3">
              <Play className="w-4 h-4 fill-current" />
              Watch Showreel
            </span>
          </button>

          <a
            href="#portfolio"
            data-cursor="VIEW"
            className="group flex items-center gap-2 px-8 py-4 rounded-full glass-panel text-zinc-300 font-heading font-black text-sm hover:text-white transition-all duration-300 w-full sm:w-auto justify-center"
          >
            Explore Portfolio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-zinc-600 to-transparent" />
          <span className="text-[9px] font-heading font-black tracking-[0.3em] text-zinc-600 uppercase">Scroll</span>
        </motion.div>
      </div>

      {/* ── Showreel modal ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 md:p-8 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-[0_0_60px_rgba(139,92,246,0.3)]"
            >
              <button
                onClick={() => setIsOpen(false)}
                data-cursor="CLOSE"
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/70 text-zinc-400 hover:text-white hover:bg-black transition-all duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <iframe
                src="https://player.vimeo.com/video/853401569?autoplay=1&title=0&byline=0&portrait=0"
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Salman Visuals Reel"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
