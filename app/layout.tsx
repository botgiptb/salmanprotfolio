import type { Metadata } from "next";
import { Syne, Space_Grotesk, Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import { Film, Send } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Salman | VFX Artist, Cinematic Video Editor & Designer",
  description: "Explore the premium portfolio of Salman, professional designer, video editor, and VFX artist. Browse cinematic showreels, before/after compositing comparisons, and creative designs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-dark-bg text-zinc-100 selection:bg-brand-purple selection:text-white font-sans">
        <SmoothScroll>
          <Preloader />
          <CustomCursor />

          {/* Thin Background Vertical Grid Lines */}
          <div className="background-grid-lines">
            <div className="grid-vertical-line" />
            <div className="grid-vertical-line" />
            <div className="grid-vertical-line" />
            <div className="grid-vertical-line" />
          </div>

          {/* Header */}
          <header className="sticky top-0 z-40 w-full border-b border-dark-border bg-black/60 backdrop-blur-md">
            <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
              <a href="#" className="flex items-center gap-2 font-display font-black text-xl tracking-tighter text-zinc-100 group">
                <Film className="w-5 h-5 text-brand-purple group-hover:rotate-12 transition-transform duration-300" />
                <span>SALMAN<span className="text-brand-cyan">.</span></span>
              </a>

              <nav className="hidden md:flex gap-8 text-xs font-heading font-bold uppercase tracking-widest text-zinc-400">
                <a href="#services" className="hover:text-zinc-100 transition-colors">Services</a>
                <a href="#portfolio" className="hover:text-zinc-100 transition-colors">Portfolio</a>
                <a href="#about" className="hover:text-zinc-100 transition-colors">About</a>
                <a href="#contact" className="hover:text-zinc-100 transition-colors">Contact</a>
              </nav>

              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-heading font-bold uppercase tracking-wider text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
              >
                <span>Hire Me</span>
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </header>

          {/* Main content */}
          <div className="flex-grow relative z-10">{children}</div>

          {/* Footer */}
          <footer className="border-t border-dark-border bg-[#050507] py-12 px-4 text-center text-xs text-zinc-600 relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
              <span className="font-heading font-medium tracking-wide">
                &copy; {new Date().getFullYear()} Salman. Designed & Crafted with Passion.
              </span>
              <div className="flex gap-6 font-heading font-bold uppercase tracking-widest text-zinc-500">
                <a href="#" className="hover:text-zinc-300 transition-colors">Vimeo</a>
                <a href="#" className="hover:text-zinc-300 transition-colors">Instagram</a>
                <a href="#" className="hover:text-zinc-300 transition-colors">ArtStation</a>
                <a href="#" className="hover:text-zinc-300 transition-colors">LinkedIn</a>
              </div>
            </div>
          </footer>
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
