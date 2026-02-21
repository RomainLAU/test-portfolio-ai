"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import projects from "@/data/projects.json";

type Project = typeof projects[0];

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Typography } from "@/components/ui/Typography";

// ── Tech chip with spring micro-animation ───────────────────────────────────
function TechChip({ label }: { label: string }) {
  return (
    <motion.span
      className="inline-block px-[1.1rem] py-[0.4rem] rounded-full border border-white/15 bg-white/5 text-[0.7rem] font-bold uppercase tracking-widest text-accent-mint-lighter backdrop-blur-md cursor-default"
      initial={false}
      whileHover={{ 
        y: -4, 
        scale: 1.1,
        background: "linear-gradient(135deg, rgba(62,241,172,0.2) 0%, rgba(182,183,255,0.2) 100%)",
        borderColor: "rgba(62,241,172,0.5)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {label}
    </motion.span>
  );
}

// ── Rich Typography Helper ──────────────────────────────────────────────────
function EditorialText({ text, size = "base" }: { text: string; size?: "base" | "large" }) {
  const words = text.split(" ");
  return (
    <div
      className={cn(
        "leading-tight text-neutral-light-base font-light m-0",
        size === "large" ? "text-[clamp(1.1rem,2.8vh,2.2rem)] text-center max-w-full" : "text-[clamp(0.85rem,1.8vh,1.1rem)] text-left max-w-[45ch]"
      )}
    >
      {words.map((word, i) => {
        const isEmphasized = i % 6 === 0;
        const isItalic = i % 9 === 0;
        const isAccent = word.length > 7 && i % 4 === 0;

        return (
          <Typography
            key={i}
            variant="span"
            italic={isItalic}
            font={isEmphasized || isItalic ? "display" : "body"}
            className={cn(
              "inline",
              isAccent ? "text-accent-mint-lighter" : (isEmphasized ? "text-white font-normal" : "font-light")
            )}
          >
            {word}{" "}
          </Typography>
        );
      })}
    </div>
  );
}

import { cn } from "@/lib/utils";

// ── Project Detail Modal ─────────────────────────────────────────────────────
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";

    const handleKeydown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-[300] overflow-hidden bg-black/95 backdrop-blur-2xl"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="fixed top-8 right-8 z-[350] flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white transition-transform hover:scale-110"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full flex flex-col p-[4vh] px-[8vw] gap-[3vh] overflow-hidden select-none"
      >
        {/* ROW 1: Image - Text */}
        <div className="flex-[35] flex gap-12 items-center">
          <motion.div
            layoutId={`image-${project.id}`}
            className="h-full aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl relative flex-shrink-0 z-10"
          >
            <Image src={project.images[0]} alt={project.title} fill className="object-cover" priority />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col justify-center gap-4"
          >
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => <TechChip key={t} label={t} />)}
            </div>
            <Typography variant="h2" className="text-white leading-none tracking-tighter m-0">
              {project.title}
            </Typography>
            <div className="border-l-3 border-accent-coral-base pl-6">
              <Typography variant="small" className="text-neutral-light-darker mb-1">Role</Typography>
              <Typography variant="h4" italic className="text-accent-coral-base mb-0">{project.role}</Typography>
            </div>
            <div>
              <EditorialText text={project.longDescription[0]} />
            </div>
          </motion.div>
        </div>

        {/* ROW 2: Text - Image */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex-[30] flex gap-12 items-center"
        >
          <div className="flex-grow flex flex-col items-end text-right">
             <div>
                <EditorialText text={project.longDescription[1]} />
             </div>
          </div>
          <div className="h-full aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl relative flex-shrink-0">
            <Image src={project.images[1]} alt={project.title + " view 2"} fill className="object-cover" />
          </div>
        </motion.div>

        {/* ROW 3: Full Width Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex-[10] flex items-center justify-center"
        >
           <div>
              <EditorialText text={project.longDescription[2]} size="large" />
           </div>
        </motion.div>

        {/* ROW 4: Full Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex-[25] rounded-[24px] overflow-hidden shadow-2xl relative"
        >
          <Image src={project.images[2]} alt={project.title + " full"} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-8">
             <Typography variant="small" className="tracking-[0.4em]">Experience Excellence</Typography>
             <span className="block text-[0.5rem] text-white/50 tracking-[0.1em] mt-1 italic">Project Portfolio Reference</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}


// ── Main HorizontalScroll Component ─────────────────────────────────────────
export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [seeMorePos, setSeeMorePos] = useState({ x: 0, y: 0 });
  const [seeMoreVisible, setSeeMoreVisible] = useState(false);

  // GSAP ScrollTrigger for true Scroll-Jacking without IntersectionObserver leakages
  useEffect(() => {
    // Only register on client
    if (typeof window === "undefined" || !sectionRef.current || !trackRef.current) return;
    
    // Register necessary plugins
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;

    // Calculate max translation based on track scrollwidth vs window width
    // Needs slight re-calculation on resize but we can keep it simple via x getter
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.1); 

    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${track.scrollWidth}`, // Scroll distance equivalent to width
        pin: true,
        scrub: 1, // Smooth dampening 
        invalidateOnRefresh: true,
      }
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleCardMouseMove = useCallback((e: React.MouseEvent) => {
    setSeeMorePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleCardEnter = useCallback(() => {
    setSeeMoreVisible(true);
    window.dispatchEvent(new Event("cursor:hide"));
  }, []);

  const handleCardLeave = useCallback(() => {
    setSeeMoreVisible(false);
    window.dispatchEvent(new Event("cursor:show"));
  }, []);

  const openProject = useCallback((project: Project) => {
    setActiveProject(project);
  }, []);

  const closeProject = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        className="relative h-screen w-full overflow-hidden text-neutral-light-lighter select-none bg-neutral-dark-darker/55 cursor-none"
      >
        {/* Header — high z-index so it's strictly ABOVE the track layers */}
        <div className="absolute top-[6vh] left-[5vw] z-[50] flex items-center gap-10">
          <Typography
            variant="h2"
            italic
            className="text-4xl md:text-6xl text-white drop-shadow-lg mb-0"
          >
            Selected Works
          </Typography>
          <Typography variant="p" className="mt-2 text-sm text-neutral-light-darker tracking-widest uppercase font-body mb-0">
            {projects.length} Projects — scroll to explore →
          </Typography>
        </div>

        {/* Scrollable Track - push z-index below title explicitly */}
        <div className="flex h-screen items-center pt-[14vh] pb-[3vh] px-[4vw] relative z-10">
          <LayoutGroup>
            <div
              ref={trackRef}
              className="grid grid-rows-3 grid-flow-col gap-3 h-[86vh]"
              style={{
                width: "max-content",
                gridAutoColumns: "26vw",
              }}
            >
              {projects.map((project, idx) => (
                <button
                  key={project.id}
                  onClick={() => openProject(project)}
                  onMouseMove={handleCardMouseMove}
                  onMouseEnter={handleCardEnter}
                  onMouseLeave={handleCardLeave}
                  data-no-magnet
                  className="group relative h-full w-full overflow-hidden bg-neutral-dark-base/60 glass-panel transition-all duration-300 hover:scale-[1.02] rounded-xl cursor-none border-none p-0 block text-left"
                >
                  <motion.div 
                    layoutId={`image-${project.id}`}
                    className="absolute inset-0 z-0"
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover opacity-55 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
                      sizes="26vw"
                      priority={idx < 9}
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <Typography variant="small" className="mb-1.5 font-body">
                      {project.tech.slice(0, 2).join(" · ")}
                    </Typography>
                    <Typography variant="h3" className="text-lg text-white leading-tight mb-0">
                      {project.title}
                    </Typography>
                  </div>
                </button>
              ))}
            </div>

            {/* Project Detail Modal */}
            <AnimatePresence>
              {activeProject && (
                <ProjectModal
                  project={activeProject}
                  onClose={closeProject}
                />
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>
      </section>

      {/* "See More" custom cursor — only visible when hovering a card */}
      <motion.div
        className="fixed pointer-events-none z-[9998] flex items-center justify-center w-[100px] h-[100px] rounded-full bg-white/10 border border-white/25 backdrop-blur-md text-white text-[0.7rem] font-bold tracking-widest uppercase"
        style={{
          left: seeMorePos.x,
          top: seeMorePos.y,
          x: "-50%",
          y: "-50%"
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: seeMoreVisible ? 1 : 0.5, 
          opacity: seeMoreVisible ? 1 : 0 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        See More
      </motion.div>
    </>
  );
}
