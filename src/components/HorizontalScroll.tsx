"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import projects from "@/data/projects.json";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/Typography";
import { useModal } from "@/context/ModalContext";

// ── Main HorizontalScroll Component ─────────────────────────────────────────
export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { openProject } = useModal();
  const [seeMorePos, setSeeMorePos] = useState({ x: 0, y: 0 });
  const [seeMoreVisible, setSeeMoreVisible] = useState(false);

  // GSAP ScrollTrigger for true Scroll-Jacking without IntersectionObserver leakages
  useEffect(() => {
    // Only register on client
    if (
      typeof window === "undefined" ||
      !sectionRef.current ||
      !trackRef.current
    )
      return;

    // Register necessary plugins
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;

    // Calculate max translation based on track scrollwidth vs window width
    // Needs slight re-calculation on resize but we can keep it simple via x getter
    const getScrollAmount = () =>
      -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.1);

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
      },
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

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        className={`
          text-neutral-light-lighter bg-neutral-dark-darker/55 z-base relative
          h-screen w-full cursor-none overflow-hidden select-none
        `}
      >
        {/* Header — high z-index so it's strictly ABOVE the track layers */}
        <div
          className={`
            left-[5vw]flex z-overlay absolute top-[3vh] flex items-center gap-10
            px-[4vw]
          `}
        >
          <Typography
            variant="h2"
            italic
            className={`
              mb-0 text-4xl text-white drop-shadow-lg
              md:text-6xl
            `}
          >
            Selected Works
          </Typography>
          <Typography
            variant="p"
            className={`
              text-neutral-light-darker font-body mt-2 mb-0 text-sm
              tracking-widest uppercase
            `}
          >
            {projects.length} Projects — scroll to explore →
          </Typography>
        </div>

        {/* Scrollable Track - push z-index below title explicitly */}
        <div
          className={`
            z-content relative flex h-screen items-center px-[4vw] pt-[14vh]
            pb-[3vh]
          `}
        >
          <div
            ref={trackRef}
            className="grid h-[86vh] grid-flow-col grid-rows-3 gap-3"
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
                className={`
                  group bg-neutral-dark-base/60 glass-panel relative block
                  h-full w-full cursor-none overflow-hidden rounded-xl
                  border-none p-0 text-left transition-all duration-300
                  hover:scale-[1.02]
                `}
              >
                <motion.div
                  layoutId={`image-${project.id}`}
                  className="absolute inset-0 z-0 overflow-hidden rounded-xl"
                  initial={{ opacity: 0.55 }}
                  whileHover={{ opacity: 1, scale: 1.1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 30,
                  }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    unoptimized
                    priority={idx < 9}
                  />
                </motion.div>
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-t from-black/85 via-black/20
                    to-transparent
                  `}
                />
                <div className="absolute right-0 bottom-0 left-0 z-10 p-5">
                  <Typography variant="small" className="font-body mb-1.5">
                    {project.tech.slice(0, 2).join(" · ")}
                  </Typography>
                  <Typography
                    variant="h3"
                    className="mb-0 text-lg leading-tight text-white"
                  >
                    {project.title}
                  </Typography>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* "See More" custom cursor — only visible when hovering a card */}
      <motion.div
        className={`
          z-overlay pointer-events-none fixed flex h-[100px] w-[100px]
          items-center justify-center rounded-full border border-white/25
          bg-white/10 text-[0.7rem] font-bold tracking-widest text-white
          uppercase backdrop-blur-md
        `}
        style={{
          left: seeMorePos.x,
          top: seeMorePos.y,
          x: "-50%",
          y: "-50%",
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: seeMoreVisible ? 1 : 0.5,
          opacity: seeMoreVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        See More
      </motion.div>
    </>
  );
}
