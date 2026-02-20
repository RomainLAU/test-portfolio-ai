"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

// Smooth scroll helper
function smoothScrollTo(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(textRefs.current, 
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
            toggleActions: "play none none reverse"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      id="about"
      className="relative min-h-screen py-32 px-8 text-neutral-light-lighter sm:px-16 lg:px-32 overflow-hidden"
      style={{ background: "rgba(5,5,5,0.7)" }}
    >
      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Title */}
        <h2
          className="mb-16 text-4xl md:text-6xl font-normal text-neutral-light-lighter"
          style={{ fontFamily: "var(--font-display), Georgia, serif", fontStyle: "italic", letterSpacing: "-0.03em" }}
        >
          Behind the Code
        </h2>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Left Column: Text */}
          <div className="flex flex-col justify-center gap-12 lg:col-span-7">
            {/* "The Professional" Section */}
            <div ref={(el) => { textRefs.current[0] = el; }}>
              <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-accent-coral-base">The Professional</h3>
              <p className="font-display text-3xl italic leading-tight md:text-5xl lg:text-6xl" style={{ color: "var(--neutral-light-lighter)", letterSpacing: "-0.02em" }}>
                I bridge the gap between <span className="text-accent-perv-base">Engineering</span> and <span className="font-body font-black not-italic text-accent-mint-base">Expressive Design.</span>
              </p>
              <p className="mt-6 font-body text-lg font-light leading-relaxed text-neutral-light-lighter opacity-70 md:text-xl max-w-xl">
                Specializing in buttery-smooth 60fps web experiences. My toolset includes <span className="text-neutral-light-base font-medium">React, GSAP, WebGL,</span> and a relentless eye for detail.
              </p>
            </div>

            {/* "The Personal" — fixed contrast readability + richer style */}
            <div ref={(el) => { textRefs.current[1] = el; }}>
              <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-accent-mint-darker">The Personal</h3>
              <p
                className="font-body text-lg leading-relaxed md:text-xl lg:text-2xl"
                style={{ color: "var(--neutral-light-lighter)" }}
              >
                But code is only half the story. When I'm not orchestrating <span className="font-display italic">ScrollTriggers</span>, you'll find me immersed in {" "}
                <span style={{ color: "var(--accent-perv-base)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.9em", letterSpacing: "0.1em" }}>Art &amp; Video Games.</span>
              </p>
              <p className="mt-4 font-body text-lg leading-relaxed md:text-xl lg:text-2xl opacity-90">
                I travel the globe and learn new languages—currently fascinated by {" "}
                <span className="font-display italic text-accent-coral-base">Italian</span> and {" "}
                <span className="font-display italic text-accent-mint-base">Russian</span> cultures.
              </p>
            </div>

            <div ref={(el) => { textRefs.current[2] = el; }}>
              <p
                className="font-display text-2xl italic leading-relaxed md:text-3xl"
                style={{ color: "var(--neutral-light-base)" }}
              >
                Oh, and I bake <span className="text-accent-yellow-base font-body font-black not-italic">unbelievably</span> good cookies. 🍪
              </p>
            </div>

            {/* Let's Work Together — properly matching the Hero pill, adding magnetic data-attr */}
            <div ref={(el) => { textRefs.current[3] = el; }} className="mt-8">
              <a
                href="#contact"
                id="contact"
                data-cursor="pointer"
                data-magnetic
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo("#contact");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.9rem 2rem",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(8px)",
                  color: "var(--neutral-light-lighter)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  transition: "all 0.3s ease",
                }}
              >
                Let&apos;s Work Together
                <span style={{ transform: "rotate(45deg)", display: "inline-block" }}>↗</span>
              </a>
            </div>
          </div>

          {/* Right Column: Imagery Grid */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-5" ref={(el) => { textRefs.current[4] = el; }}>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-light-base">
              <Image 
                src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1974&auto=format&fit=crop" 
                alt="Art Gallery" 
                fill 
                className="object-cover opacity-90 transition-transform duration-700 hover:scale-110"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-light-base">
                <Image 
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" 
                  alt="Retro Gaming" 
                  fill 
                  className="object-cover opacity-90 transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-neutral-light-base">
                <Image 
                  src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1964&auto=format&fit=crop" 
                  alt="Cookies" 
                  fill 
                  className="object-cover opacity-90 transition-transform duration-700 hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Last Section: Expressive Typography Hierarchy ─────────────── */}
        <div
          className="mt-40 mb-16 border-t pt-20"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {/* Label */}
          <p style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "var(--neutral-light-darker)",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            marginBottom: "2rem",
          }}>
            Available for freelance &amp; full-time
          </p>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Big display line — italic serif */}
            <h2 style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(3.5rem, 11vw, 9.5rem)",
              fontWeight: 400,
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              margin: "0 0 0.1em",
              color: "var(--neutral-light-lighter)",
            }}>
              Let&apos;s make
            </h2>

            {/* Gradient text accent line with overflow visible to save descenders */}
            <div style={{ overflow: "visible", paddingBottom: "0.2em", margin: "0 0 0.1em" }}>
              <h2 style={{
                fontFamily: "var(--font-display), Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(3.5rem, 11vw, 9.5rem)",
                fontWeight: 400,
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                margin: 0,
                background: "linear-gradient(135deg, var(--accent-coral-base) 0%, var(--accent-perv-base) 50%, var(--accent-mint-base) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                something
              </h2>
            </div>

            {/* Bold sans contrast */}
            <h2 style={{
              fontFamily: "var(--font-body), Arial, sans-serif",
              fontSize: "clamp(3.2rem, 10vw, 8.5rem)",
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: "-0.07em",
              textTransform: "uppercase",
              margin: "0 0 4rem",
              color: "var(--neutral-light-base)",
              opacity: 0.95,
            }}>
              extraordinary.
            </h2>
          </div>

          {/* Caption + CTA row */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}>
            <p style={{
              fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
              color: "var(--neutral-light-lighter)",
              opacity: 0.8,
              maxWidth: "480px",
              lineHeight: 1.6,
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              margin: 0,
            }}>
              From zero to launch, I bring ideas alive with craft, precision, and a relentless eye for detail.
            </p>

            <a
              href="mailto:romain@example.com"
              data-cursor="pointer"
              data-magnetic
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "1rem 2.2rem",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
                color: "var(--neutral-light-lighter)",
                textDecoration: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                transition: "all 0.3s ease",
              }}
            >
              Say Hello
              <span style={{ transform: "rotate(45deg)", display: "inline-block" }}>↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
