"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Smooth scroll helper — Lenis intercepts `scrollIntoView` automatically
function smoothScrollTo(href: string) {
  if (href === "/" || href === "#") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delay = 3.8; // after preloader finishes
    const tl = gsap.timeline({ delay });

    if (line1Ref.current && line2Ref.current) {
      tl.fromTo(
        [line1Ref.current, line2Ref.current],
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out"
        }
      );
    }
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );
    }
    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      );
    }
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 5vw",
        // Transparent so the root WebGL background shows through
        backgroundColor: "transparent",
        overflow: "hidden",
      }}
    >
      {/* Hero Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ overflow: "hidden", padding: "4px 0" }}>
          <h1
            ref={line1Ref}
            style={{
              fontSize: "clamp(3.5rem, 13vw, 11rem)",
              fontWeight: 400,
              margin: 0,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              color: "var(--neutral-light-lighter)",
              fontFamily: "var(--font-display), Georgia, serif",
              fontStyle: "italic",
            }}
          >
            Romain
          </h1>
        </div>
        <div style={{ overflow: "hidden", padding: "4px 0" }}>
          <h1
            ref={line2Ref}
            style={{
              fontSize: "clamp(3.5rem, 13vw, 11rem)",
              fontWeight: 400,
              margin: 0,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              color: "var(--accent-coral-base)",
              fontFamily: "var(--font-display), Georgia, serif",
            }}
          >
            Laurent.
          </h1>
        </div>

        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <p
            ref={subtitleRef}
            style={{
              fontSize: "clamp(0.95rem, 1.8vw, 1.4rem)",
              maxWidth: "400px",
              color: "var(--neutral-light-darker)",
              margin: 0,
              lineHeight: 1.6,
              fontFamily: "var(--font-body), Arial, sans-serif",
              fontWeight: 300,
            }}
          >
            Creative Frontend Developer — crafting digital experiences with{" "}
            <em style={{ color: "var(--neutral-light-base)", fontStyle: "italic" }}>
              motion, depth, and performance
            </em>{" "}
            in mind.
          </p>

          <div ref={ctaRef}>
            <a
              href="#work"
              data-cursor="pointer"
              data-magnetic
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo("#work");
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
              View Work
              <span style={{ transform: "rotate(45deg)", display: "inline-block" }}>↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
