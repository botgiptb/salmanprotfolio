"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const ROLES = ["Creative Design", "Social Media Content", "Logo Branding", "Video Editing"];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050507] py-24 px-4 md:px-8"
    >
      {/* ── Layered ambient glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-brand-purple/20 blur-[160px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-brand-cyan/15 blur-[160px]"
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.2) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">

        {/* Availability pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-zinc-800 bg-zinc-950/70 backdrop-blur-sm text-xs font-heading font-bold text-zinc-300 mb-10 tracking-wider"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Available for Projects — Remote Worldwide
        </motion.div>

        {/* Name + headline */}
        <div className="overflow-hidden mb-1">
          <motion.p
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(0.65rem,2vw,0.85rem)] font-heading font-black tracking-[0.4em] uppercase text-zinc-500 mb-4"
          >
            Mohammed Salman · Kerala, India
          </motion.p>
        </div>

        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="font-display font-black text-zinc-100 leading-none tracking-tighter select-none"
            style={{ fontSize: "clamp(3rem, 12vw, 10rem)" }}
          >
            CREATIVE
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="font-display font-black leading-none tracking-tighter select-none bg-gradient-to-r from-brand-purple via-violet-300 to-brand-cyan bg-clip-text text-transparent animate-gradient-text"
            style={{ fontSize: "clamp(3rem, 12vw, 10rem)" }}
          >
            DESIGNER
          </motion.h1>
        </div>

        {/* Role chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {ROLES.map((r, i) => (
            <span
              key={r}
              className="px-3 py-1.5 rounded-full text-[10px] font-heading font-black uppercase tracking-widest border border-zinc-800/70 bg-zinc-950/50 text-zinc-400"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {r}
            </span>
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-lg text-zinc-400 text-sm md:text-[15px] leading-relaxed mb-12 font-sans"
        >
          Crafting scroll-stopping social media creatives, logo branding &amp; video content —
          turning raw ideas into compelling brand visuals that drive real engagement.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          {/* Primary */}
          <a
            href="#portfolio"
            className="group relative flex items-center gap-2.5 px-8 py-4 rounded-full bg-brand-purple text-white font-heading font-black text-sm tracking-wide overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.35)] hover:shadow-[0_0_55px_rgba(139,92,246,0.5)] transition-all duration-300 cursor-pointer"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative">View My Work</span>
            <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </a>

          {/* Secondary */}
          <a
            href="#contact"
            className="group flex items-center gap-2.5 px-8 py-4 rounded-full border border-zinc-700 bg-zinc-950/50 text-zinc-300 hover:text-white hover:border-zinc-500 font-heading font-black text-sm tracking-wide transition-all duration-300 cursor-pointer backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-brand-cyan" />
            Start a Project
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex items-center gap-8 mt-16 pt-8 border-t border-zinc-800/40"
        >
          {[
            { value: "3+",   label: "Years Experience" },
            { value: "50+",  label: "Brand Projects" },
            { value: "100%", label: "Client Satisfaction" },
          ].map(({ value, label }, i) => (
            <div key={label} className="text-center">
              <p className="font-display font-black text-2xl md:text-3xl text-zinc-100 leading-none mb-1">{value}</p>
              <p className="text-[9px] font-heading font-bold tracking-widest uppercase text-zinc-600">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none z-10"
      >
        <div className="w-5 h-8 rounded-full border border-zinc-700/80 flex justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full bg-brand-cyan"
          />
        </div>
        <span className="text-[8px] font-heading font-black tracking-[0.35em] text-zinc-600 uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
