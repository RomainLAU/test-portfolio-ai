"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";
import projects from "@/data/projects.json";

type Project = typeof projects[0];

// ── Tech chip with spring micro-animation ───────────────────────────────────
function TechChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        borderRadius: "9999px",
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.05)",
        padding: "0.4rem 1.1rem",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--accent-mint-lighter)",
        backdropFilter: "blur(4px)",
        // Added springy bounce timing on transform and gradient shift
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease, border-color 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px) scale(1.1)";
        el.style.background = "linear-gradient(135deg, rgba(62,241,172,0.2) 0%, rgba(182,183,255,0.2) 100%)";
        el.style.borderColor = "rgba(62,241,172,0.5)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "";
        el.style.background = "rgba(255,255,255,0.05)";
        el.style.borderColor = "rgba(255,255,255,0.15)";
      }}
    >
      {label}
    </span>
  );
}

// ── Project Detail Modal ─────────────────────────────────────────────────────
function ProjectModal({
  project,
  sourceRect,
  onClose,
}: {
  project: Project;
  sourceRect: DOMRect | null;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const heroImg = heroImgRef.current;
    const content = contentRef.current;
    if (!backdrop || !heroImg || !content) return;

    // FLIP-like entrance: animate from card rect to full width dynamically
    if (sourceRect) {
      gsap.fromTo(heroImg,
        {
          position: "fixed",
          top: sourceRect.top,
          left: sourceRect.left,
          width: sourceRect.width,
          height: sourceRect.height,
          borderRadius: "12px",
          zIndex: 10,
        },
        {
          top: 0,
          left: 0,
          width: "100%",
          height: "65vh", // Bigger hero image expansion
          borderRadius: "0px",
          duration: 0.85,
          ease: "expo.inOut", // Sharper dramatic FLIP curve
          clearProps: "position,top,left,zIndex",
          onComplete: () => {
            gsap.fromTo(content,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
            );
          }
        }
      );
    } else {
      gsap.fromTo(heroImg,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(content,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power4.out", delay: 0.2 }
      );
    }

    // Keep background partially transparent/blurred so WebGL shows through
    gsap.fromTo(backdrop,
      { backgroundColor: "rgba(5,5,5,0)" },
      { backgroundColor: "rgba(5,5,5,0.75)", backdropFilter: "blur(12px)", duration: 0.6, ease: "power2.out" }
    );

    // Close on Escape
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeydown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    };
  }, [onClose, sourceRect]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[300] overflow-y-auto"
      onClick={onClose}
    >
      {/* Close button with magnetic */}
      <button
        ref={closeRef}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        data-cursor="pointer"
        data-magnetic
        className="fixed top-8 right-8 z-[310] flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md"
        style={{
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.04)",
          color: "white",
        }}
        aria-label="Close project"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Content — stopPropagation so clicking inside doesn't close modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ minHeight: "100vh" }}
      >
        {/* Hero image — FLIP target */}
        <div
          ref={heroImgRef}
          // Changed height to match JS 65vh target dynamically, removed hardcoded 55vh
          style={{
            position: "relative",
            width: "100%",
            height: "65vh",
            overflow: "hidden",
          }}
        >
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Gradient overlay adjusted for slight transparency */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 30%, rgba(5,5,5,0.95) 100%)"
          }} />
        </div>

        {/* Editorial content */}
        <div
          ref={contentRef}
          style={{
            opacity: 0,
            maxWidth: "1100px", // Wider for grid layout
            margin: "0 auto",
            padding: "3rem 5vw 6rem",
            position: "relative"
          }}
        >
          {/* Title cluster pulls up into the gradient */}
          <div style={{ marginTop: "-8rem", position: "relative", zIndex: 20, marginBottom: "4rem" }}>
            {/* Tech chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "1.5rem" }}>
              {project.tech.map((t) => <TechChip key={t} label={t} />)}
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              fontFamily: "var(--font-display), Georgia, serif",
              color: "white",
              margin: "0 0 1rem",
            }}>
              {project.title}
            </h2>

            {/* Role */}
            <div style={{ borderLeft: "2px solid var(--accent-coral-base)", paddingLeft: "1rem" }}>
              <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--neutral-light-darker)", marginBottom: "0.25rem" }}>Role</span>
              <span style={{ fontSize: "1.5rem", fontFamily: "var(--font-display), Georgia, serif", fontStyle: "italic", color: "var(--accent-coral-base)" }}>{project.role}</span>
            </div>
          </div>

          {/* Alternating image + text layout (Masonry-ish) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "5rem" }}>
            {(project as any).longDescription?.map((para: string, i: number) => {
              const isEven = i % 2 === 0;
              const img = project.images[i + 1];

              return (
                <div key={i} style={{ 
                  display: "flex", 
                  flexDirection: isEven ? "row" : "row-reverse",
                  alignItems: "center",
                  gap: "4rem",
                  flexWrap: "wrap"
                }}>
                  {img && (
                    <div
                      style={{
                        position: "relative",
                        flex: "1 1 500px",
                        aspectRatio: "4/3",
                        overflow: "hidden",
                        borderRadius: "16px",
                        // Default aligned, rotate on hover
                        transform: "rotate(0deg) translateY(0px)",
                        transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = isEven ? "rotate(1.5deg) scale(1.02) translateY(-8px)" : "rotate(-1.5deg) scale(1.02) translateY(-8px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 25px 40px rgba(0,0,0,0.8)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "rotate(0deg) scale(1) translateY(0px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
                      }}
                    >
                      <Image src={img} alt={`${project.title} ${i + 2}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                    </div>
                  )}
                  <div style={{ flex: "1 1 350px" }}>
                    <p style={{
                      fontSize: "clamp(1.1rem, 1.8vw, 1.3rem)",
                      lineHeight: 1.8,
                      color: "var(--neutral-light-base)", // Slightly brighter for readability
                      margin: 0,
                      fontWeight: 300,
                    }}>
                      {para}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main HorizontalScroll Component ─────────────────────────────────────────
export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const currentXRef = useRef(0);
  const targetXRef = useRef(0);
  const isLockedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [seeMorePos, setSeeMorePos] = useState({ x: 0, y: 0 });
  const [seeMoreVisible, setSeeMoreVisible] = useState(false);

  // GSAP ScrollTrigger for true Scroll-Jacking without IntersectionObserver leakages
  useEffect(() => {
    // Only register on client
    if (typeof window === "undefined" || !sectionRef.current || !trackRef.current) return;
    
    // Register necessary plugins
    const ScrollTrigger = require("gsap/ScrollTrigger").default;
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
      ScrollTrigger.getAll().forEach((t: any) => t.kill());
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

  const openProject = useCallback((project: Project, rect: DOMRect) => {
    setSourceRect(rect);
    setActiveProject(project);
  }, []);

  const closeProject = useCallback(() => {
    setActiveProject(null);
    setSourceRect(null);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        className="relative h-screen w-full overflow-hidden text-neutral-light-lighter select-none"
        style={{
          background: "rgba(5,5,5,0.55)",
          cursor: "none",
        }}
      >
        {/* Header — high z-index so it's strictly ABOVE the track layers */}
        <div className="absolute top-[6vh] left-[5vw] z-[50]">
          <h2
            className="text-4xl md:text-6xl font-normal uppercase tracking-tight text-white drop-shadow-lg"
            style={{ fontFamily: "var(--font-display), Georgia, serif", fontStyle: "italic" }}
          >
            Selected Works
          </h2>
          <p className="mt-2 text-sm text-neutral-light-darker tracking-widest uppercase font-body">
            {projects.length} Projects — scroll to explore →
          </p>
        </div>

        {/* Scrollable Track - push z-index below title explicitly */}
        <div className="flex h-screen items-center pt-[14vh] pb-[3vh] px-[4vw] relative z-10">
          <div
            ref={trackRef}
            className="grid grid-rows-3 grid-flow-col gap-3"
            style={{
              width: "max-content",
              height: "86vh",
              gridAutoColumns: "26vw",
            }}
          >
            {projects.map((project, idx) => (
              <button
                key={project.id}
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  openProject(project, rect);
                }}
                onMouseMove={handleCardMouseMove}
                onMouseEnter={handleCardEnter}
                onMouseLeave={handleCardLeave}
                data-no-magnet
                className="group relative h-full w-full overflow-hidden bg-neutral-dark-base/60 glass-panel transition-all duration-300 hover:scale-[1.02]"
                style={{
                  borderRadius: "12px",
                  cursor: "none",
                  border: "none",
                  padding: 0,
                  display: "block",
                  textAlign: "left",
                }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover opacity-55 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
                  sizes="26vw"
                  priority={idx < 9}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <p className="text-[0.6rem] font-bold uppercase tracking-widest text-accent-mint-base mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                    {project.tech.slice(0, 2).join(" · ")}
                  </p>
                  <h3 className="text-lg font-normal text-white leading-tight" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                    {project.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* "See More" custom cursor — only visible when hovering a card */}
      <div
        style={{
          position: "fixed",
          left: seeMorePos.x,
          top: seeMorePos.y,
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 9998,
          // Use scaling and opacity rather than instant switching
          transform: `translate(-50%,-50%) scale(${seeMoreVisible ? 1 : 0.5})`,
          transition: "opacity 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: seeMoreVisible ? 1 : 0,
          fontSize: "0.7rem",
          fontWeight: "700",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "white",
        }}
      >
        See More
      </div>

      {/* Project Detail Modal */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          sourceRect={sourceRect}
          onClose={closeProject}
        />
      )}
    </>
  );
}
