"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Mail, Phone, MapPin } from "lucide-react";

const subjects = [
  { value: "VFX Project",     label: "VFX & Compositing Project" },
  { value: "Video Editing",   label: "Cinematic Video Editing" },
  { value: "Graphic Design",  label: "Brand / Motion Design" },
  { value: "General Inquiry", label: "General Conversation / Hire" },
];

const contactInfo = [
  { icon: Mail,    label: "Email Directly",    value: "klsalman786@gmail.com", href: "mailto:klsalman786@gmail.com",  color: "text-brand-purple" },
  { icon: Phone,   label: "Phone / WhatsApp",  value: "+91 8848547935",          href: "tel:+91 8848547935",                  color: "text-brand-cyan" },
  { icon: MapPin,  label: "Location",          value: "Kerala, INDIA • Remote Worldwide", href: undefined,                       color: "text-brand-amber" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "VFX Project", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          access_key: "984fae79-60da-409e-938d-10d2637bf65d",
          name: form.name,
          email: form.email,
          subject: `[Portfolio Contact] ${form.subject} from ${form.name}`,
          message: form.message,
          from_name: "Salman Studio Portfolio",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus("done");
        setForm({ name: "", email: "", subject: "VFX Project", message: "" });
      } else {
        setError(data.message || "Failed to send message. Please try again.");
        setStatus("idle");
      }
    } catch (err) {
      setError("A network error occurred. Please check your connection and try again.");
      setStatus("idle");
    }
  };

  return (
    <section id="contact" className="relative py-32 bg-[#070709] px-4 md:px-8 border-t border-dark-border overflow-hidden">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-cyan/4 blur-[110px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* ── Left: info ── */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div>
              <p className="text-[11px] font-heading font-black uppercase tracking-[0.25em] text-brand-cyan mb-4">Let's Collaborate</p>
              <h2 className="text-4xl md:text-6xl font-display font-black text-zinc-100 tracking-tight leading-none mb-6">
                START A<br />PROJECT
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                Ready to elevate your visuals? Describe your VFX request, video editing spot, or graphic design project — I usually reply within 24 hours.
              </p>
            </div>

            <div className="space-y-5">
              {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
                <div key={label} className="group flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 group-hover:border-zinc-700 ${color} transition-all duration-300`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-heading font-black uppercase tracking-widest text-zinc-600 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-heading font-bold text-zinc-300 hover:text-zinc-100 transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm font-heading font-bold text-zinc-400">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-zinc-700 border-t border-zinc-900 pt-6">
              © {new Date().getFullYear()} Salman Visuals. All rights reserved.
            </p>
          </div>

          {/* ── Right: form ── */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden hover:border-brand-cyan/20 transition-colors duration-500">
              <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-brand-cyan/4 blur-[70px] pointer-events-none" />

              <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-[10px] font-heading font-black uppercase tracking-widest text-zinc-500 mb-2">Full Name</label>
                  <input
                    id="name" type="text" required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/30 transition-all text-sm font-heading"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-[10px] font-heading font-black uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
                  <input
                    id="email" type="email" required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/30 transition-all text-sm font-heading"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-[10px] font-heading font-black uppercase tracking-widest text-zinc-500 mb-2">Project Type</label>
                  <select
                    id="subject"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60 text-zinc-200 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/30 transition-all text-sm font-heading cursor-pointer"
                  >
                    {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-[10px] font-heading font-black uppercase tracking-widest text-zinc-500 mb-2">Project Outline</label>
                  <textarea
                    id="message" required rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your project, timeline, and goals..."
                    className="w-full px-4 py-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/30 transition-all text-sm font-heading resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400 font-heading text-center mt-2">{error}</p>
                )}

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status !== "idle"}
                  className="w-full relative flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-heading font-black uppercase tracking-wider text-sm transition-all duration-400 cursor-pointer overflow-hidden disabled:opacity-60"
                  style={{ background: status === "done" ? "transparent" : "rgba(6,182,212,1)", color: status === "done" ? "#4ade80" : "#03050a" }}
                >
                  {status === "idle" && (
                    <><span>Transmit Brief</span><Send className="w-4 h-4" /></>
                  )}
                  {status === "sending" && (
                    <span className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  )}
                  {status === "done" && (
                    <><CheckCircle className="w-5 h-5" /><span>Message Dispatched!</span></>
                  )}
                </motion.button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
