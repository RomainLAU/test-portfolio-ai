"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { smoothScrollTo } from "@/lib/scroll-utils";

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRefs.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className={`
        relative min-h-screen py-32 px-8 text-neutral-light-lighter
        sm:px-16
        lg:px-32
        overflow-hidden bg-neutral-dark-darker/70
      `}
    >
      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Title */}
        <Typography
          variant="h2"
          italic
          className="mb-16 text-neutral-light-lighter"
        >
          Behind the Code
        </Typography>

        <div className={`
          grid grid-cols-1 gap-16
          lg:grid-cols-12
        `}>
          {/* Left Column: Text */}
          <div className={`
            flex flex-col justify-center gap-12
            lg:col-span-7
          `}>
            {/* "The Professional" Section */}
            <div
              ref={(el) => {
                textRefs.current[0] = el;
              }}
            >
              <Typography
                variant="small"
                className="mb-6 text-accent-coral-base"
              >
                The Professional
              </Typography>
              <Typography
                variant="h3"
                italic
                className="text-neutral-light-lighter"
              >
                I bridge the gap between{" "}
                <span className="text-accent-perv-base not-italic">
                  Engineering
                </span>{" "}
                and{" "}
                <span className={`
                  font-body font-black not-italic text-accent-mint-base
                  uppercase tracking-tighter
                `}>
                  Expressive Design.
                </span>
              </Typography>
              <Typography variant="p" className="mt-6 opacity-70 max-w-xl">
                Specializing in buttery-smooth 60fps web experiences. My toolset
                includes{" "}
                <span className="text-neutral-light-base font-medium">
                  React, GSAP, WebGL,
                </span>{" "}
                and a relentless eye for detail.
              </Typography>
            </div>

            {/* "The Personal" */}
            <div
              ref={(el) => {
                textRefs.current[1] = el;
              }}
            >
              <Typography
                variant="small"
                className="mb-6 text-accent-mint-darker"
              >
                The Personal
              </Typography>
              <Typography
                variant="p"
                className={`
                  text-neutral-light-lighter
                  lg:text-2xl
                `}
              >
                But code is only half the story. When I&apos;m not orchestrating{" "}
                <span className="font-display italic">ScrollTriggers</span>,
                you&apos;ll find me immersed in{" "}
                <span className={`
                  text-accent-perv-base font-bold uppercase text-[0.9em]
                  tracking-widest
                `}>
                  Art &amp; Video Games.
                </span>
              </Typography>
              <Typography variant="p" className={`
                mt-4 opacity-90
                lg:text-2xl
              `}>
                I travel the globe and learn new languages—currently fascinated
                by{" "}
                <span className="font-display italic text-accent-coral-base">
                  Italian
                </span>{" "}
                and{" "}
                <span className="font-display italic text-accent-mint-base">
                  Russian
                </span>{" "}
                cultures.
              </Typography>
            </div>

            <div
              ref={(el) => {
                textRefs.current[2] = el;
              }}
            >
              <Typography
                variant="h4"
                italic
                className="text-neutral-light-base"
              >
                Oh, and I bake{" "}
                <span className={`
                  text-accent-yellow-base font-body font-black not-italic
                  uppercase tracking-tighter
                `}>
                  unbelievably
                </span>{" "}
                good cookies. 🍪
              </Typography>
            </div>

            <div
              ref={(el) => {
                textRefs.current[3] = el;
              }}
              className="mt-8"
            >
              <Button
                href="#contact"
                magnetic
                withArrow
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo("#contact");
                }}
              >
                Let&apos;s Work Together
              </Button>
            </div>
          </div>

          {/* Right Column: Imagery Grid */}
          <div
            className={`
              grid grid-cols-2 gap-4
              lg:col-span-5
            `}
            ref={(el) => {
              textRefs.current[4] = el;
            }}
          >
            <div className={`
              relative aspect-[3/4] w-full overflow-hidden rounded-2xl
              bg-neutral-dark-lighter
            `}>
              <Image
                src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1974&auto=format&fit=crop"
                alt="Art Gallery"
                fill
                className={`
                  object-cover opacity-90 transition-transform duration-700
                  hover:scale-110
                `}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className={`
                relative aspect-square w-full overflow-hidden rounded-2xl
                bg-neutral-dark-lighter
              `}>
                <Image
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
                  alt="Retro Gaming"
                  fill
                  className={`
                    object-cover opacity-90 transition-transform duration-700
                    hover:scale-110
                  `}
                />
              </div>
              <div className={`
                relative min-h-0 flex-1 overflow-hidden rounded-2xl
                bg-neutral-dark-lighter
              `}>
                <Image
                  src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1964&auto=format&fit=crop"
                  alt="Cookies"
                  fill
                  className={`
                    object-cover opacity-90 transition-transform duration-700
                    hover:scale-110
                  `}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Last Section: Expressive Typography Hierarchy ─────────────── */}
        <div className="mt-40 mb-16 border-t border-white/10 pt-20">
          <Typography
            variant="small"
            className="text-neutral-light-darker mb-8"
          >
            Available for freelance &amp; full-time
          </Typography>

          <div className="flex flex-col">
            <Typography
              variant="h1"
              italic
              className="mb-0 text-neutral-light-lighter"
            >
              Let&apos;s make
            </Typography>

            <div className="overflow-visible pb-1 outline-none">
              <Typography
                variant="h1"
                italic
                className={`
                  m-0 bg-linear-to-r from-accent-coral-base via-accent-perv-base
                  to-accent-mint-base bg-clip-text text-transparent
                `}
              >
                something
              </Typography>
            </div>

            <Typography
              variant="h1"
              font="body"
              className={`
                font-black uppercase tracking-[-0.07em] text-neutral-light-base
                opacity-95 mb-16
              `}
            >
              extraordinary.
            </Typography>
          </div>

          {/* Caption + CTA row */}
          <div className="flex items-end justify-between flex-wrap gap-8">
            <Typography
              variant="p"
              className={`
                max-w-[480px] m-0 opacity-80
                lg:text-xl
              `}
            >
              From zero to launch, I bring ideas alive with craft, precision,
              and a relentless eye for detail.
            </Typography>

            <Button
              href="mailto:romain@example.com"
              magnetic
              withArrow
              size="lg"
            >
              Say Hello
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
