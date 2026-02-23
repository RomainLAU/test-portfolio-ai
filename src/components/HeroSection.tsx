"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { smoothScrollTo } from "@/lib/scroll-utils";
import { useModal } from "@/context/ModalContext";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { isLoaded } = useModal();

  useEffect(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline();

    if (line1Ref.current && line2Ref.current) {
      tl.fromTo(
        [line1Ref.current, line2Ref.current],
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
        },
      );
    }
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5",
      );
    }
    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.4",
      );
    }
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      className={`
        relative h-screen w-full flex flex-col justify-center px-[5vw]
        bg-transparent overflow-hidden
      `}
    >
      {/* Hero Content */}
      <div className="relative z-10">
        <div className="overflow-hidden py-1">
          <Typography
            as="h1"
            variant="h1"
            italic
            className="m-0 text-neutral-light-lighter opacity-0"
            ref={line1Ref}
          >
            Romain
          </Typography>
        </div>
        <div className="overflow-hidden py-1">
          <Typography
            as="h1"
            variant="h1"
            className="m-0 text-accent-coral-base opacity-0"
            ref={line2Ref}
          >
            Laurent.
          </Typography>
        </div>

        <div className="mt-12 flex justify-between items-end w-full">
          <Typography
            variant="p"
            className="max-w-[400px] m-0 text-neutral-light-darker opacity-0"
            ref={subtitleRef}
          >
            Creative Frontend Developer — crafting digital experiences with{" "}
            <em className="text-neutral-light-base font-display italic">
              motion, depth, and performance
            </em>{" "}
            in mind.
          </Typography>

          <div ref={ctaRef} className="opacity-0">
            <Button
              href="#work"
              magnetic
              withArrow
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo("#work");
              }}
            >
              View Work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
