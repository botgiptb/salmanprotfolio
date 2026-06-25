"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  client: string;
  software: string[];
  videoUrl: string;
  thumbnail: string;
  description: string;
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetch("/api/data", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => {
        setProjects(d.portfolio ?? []);
        setCategories(["All", ...(d.categories ?? [])]);
      })
      .catch(() => {});
  }, []);

  const filteredProjects = projects.filter((project) =>
    activeCategory === "All" ? true : project.category === activeCategory
  );

  // Reset index when changing categories
  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  const handleNext = useCallback(() => {
    if (filteredProjects.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % filteredProjects.length);
  }, [filteredProjects]);

  const handlePrev = useCallback(() => {
    if (filteredProjects.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  }, [filteredProjects]);

  const activeProject = filteredProjects[activeIndex];

  const getCardStyles = (index: number) => {
    const len = filteredProjects.length;
    if (len === 0) return {};

    let diff = index - activeIndex;

    // Wrap around for circular loop (only if more than 2 items)
    if (len > 2) {
      if (diff > len / 2) diff -= len;
      if (diff < -len / 2) diff += len;
    }

    const isActive = diff === 0;
    const isNext = diff === 1 || (len === 2 && diff === -1 && index !== activeIndex);
    const isPrev = diff === -1 || (len === 2 && diff === 1 && index !== activeIndex);

    const xOffset = isMobile ? "46%" : "52%";
    const sideScale = isMobile ? 0.78 : 0.82;
    const sideOpacity = isMobile ? 0.25 : 0.35;

    if (isActive) {
      return {
        x: "0%",
        scale: 1,
        opacity: 1,
        zIndex: 10,
        rotateY: 0,
        pointerEvents: "auto" as const,
      };
    } else if (isNext) {
      return {
        x: xOffset,
        scale: sideScale,
        opacity: sideOpacity,
        zIndex: 5,
        rotateY: -20,
        pointerEvents: "none" as const,
      };
    } else if (isPrev) {
      return {
        x: `-${xOffset}`,
        scale: sideScale,
        opacity: sideOpacity,
        zIndex: 5,
        rotateY: 20,
        pointerEvents: "none" as const,
      };
    } else {
      return {
        x: diff > 0 ? "110%" : "-110%",
        scale: 0.7,
        opacity: 0,
        zIndex: 0,
        rotateY: diff > 0 ? -45 : 45,
        pointerEvents: "none" as const,
      };
    }
  };

  return (
    <section id="portfolio" className="relative py-28 bg-[#070709] px-4 md:px-8 border-t border-dark-border overflow-hidden">
      
      {/* Dynamic blurred background glow wash */}
      {activeProject && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[120px] saturate-200 select-none opacity-15"
            >
              <img
                src={activeProject.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Heading Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-xs md:text-sm font-heading font-black uppercase tracking-widest text-brand-cyan mb-3 block">
              Recent Works
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-black text-zinc-100 tracking-tight leading-none">
              PORTFOLIO SHOWCASE
            </h2>
          </div>

          {/* Premium category selector */}
          <div className="flex flex-wrap gap-2 mt-8 md:mt-0 bg-zinc-950/80 border border-zinc-800/60 p-1.5 rounded-xl relative z-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="relative px-5 py-2.5 rounded-lg text-xs md:text-sm font-heading font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-100 transition-colors duration-300 cursor-pointer"
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-brand-purple rounded-lg -z-10 shadow-lg"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className={activeCategory === category ? "text-zinc-100" : ""}>
                  {category}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Slider Component */}
        {filteredProjects.length > 0 ? (
          <div className="relative w-full overflow-visible">
            
            {/* 3D Slider Container */}
            <div className="relative h-[220px] sm:h-[350px] md:h-[420px] w-full flex items-center justify-center overflow-visible mt-8 [perspective:1200px] [transform-style:preserve-3d]">
              {filteredProjects.map((project, index) => {
                const styles = getCardStyles(index);
                const isActive = index === activeIndex;

                return (
                  <motion.div
                    key={project.id}
                    style={{
                      position: "absolute",
                      width: isMobile ? "82%" : "100%",
                      maxWidth: isMobile ? "320px" : "720px",
                      zIndex: styles.zIndex,
                      pointerEvents: styles.pointerEvents,
                    }}
                    animate={{
                      x: styles.x,
                      scale: styles.scale,
                      opacity: styles.opacity,
                      rotateY: styles.rotateY,
                    }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.7)] group cursor-pointer relative"
                    onClick={() => {
                      if (isActive) {
                        if (project.videoUrl) {
                          setSelectedVideo(project.videoUrl);
                        } else {
                          setSelectedImage(project.thumbnail);
                        }
                      } else {
                        setActiveIndex(index);
                      }
                    }}
                    // Swipe drag handlers
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, info) => {
                      const threshold = 55;
                      if (info.offset.x < -threshold) {
                        handleNext();
                      } else if (info.offset.x > threshold) {
                        handlePrev();
                      }
                    }}
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out select-none"
                      draggable={false}
                    />

                    {/* Gloss Color Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Play / View Badge in Center of Active Slide */}
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="p-4 rounded-full bg-brand-purple text-zinc-100 shadow-[0_0_30px_rgba(139,92,246,0.6)] scale-90 group-hover:scale-100 transition-transform duration-300">
                          {project.videoUrl ? (
                            <Play className="w-6 h-6 fill-current text-white" />
                          ) : (
                            <Eye className="w-6 h-6 text-white" />
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Slider Navigation Buttons */}
            {filteredProjects.length > 1 && (
              <div className="flex items-center justify-center gap-6 mt-8 relative z-20">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer hover:border-brand-cyan/40 hover:scale-105"
                  title="Previous work"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="font-heading font-bold text-xs uppercase tracking-widest text-zinc-500 min-w-[60px] text-center">
                  <span className="text-zinc-200">{String(activeIndex + 1).padStart(2, "0")}</span>
                  <span className="mx-2">/</span>
                  <span>{String(filteredProjects.length).padStart(2, "0")}</span>
                </div>

                <button
                  onClick={handleNext}
                  className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer hover:border-brand-cyan/40 hover:scale-105"
                  title="Next work"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Slide Detail Panel */}
            {activeProject && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-2xl mx-auto text-center mt-12 relative z-10 px-4"
                >
                  <span className="text-[10px] uppercase font-heading font-black tracking-widest text-brand-cyan mb-2.5 block">
                    {activeProject.category} &bull; {activeProject.client}
                  </span>

                  <h3 className="text-2xl md:text-4xl font-display font-black text-zinc-100 mb-4 tracking-tight leading-tight">
                    {activeProject.title}
                  </h3>

                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6 max-w-xl mx-auto">
                    {activeProject.description}
                  </p>

                  {/* Software badging */}
                  <div className="flex flex-wrap justify-center gap-1.5 pt-4 border-t border-zinc-800/40 max-w-md mx-auto">
                    {activeProject.software.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800/60 text-[9px] font-heading font-bold text-zinc-400 tracking-wider"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

          </div>
        ) : (
          <div className="py-20 text-center relative z-10 text-zinc-500 font-heading font-bold text-xs uppercase tracking-widest">
            No projects found in this category.
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-md"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-[0_0_50px_rgba(139,92,246,0.25)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-zinc-400 hover:text-white hover:bg-black/80 transition-all duration-200 cursor-pointer"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video Frame */}
              <iframe
                src={`${selectedVideo}?autoplay=1&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Project Video Player"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox Player */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-black/60 text-zinc-400 hover:text-white hover:bg-black/80 transition-all duration-200 cursor-pointer"
              aria-label="Close image viewer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Image Container */}
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged project view"
                className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-2xl select-none"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
