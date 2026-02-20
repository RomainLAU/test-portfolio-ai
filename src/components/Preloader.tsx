"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !numberRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setComplete(true);
        }
      });

      const counter = { val: 0 };

      // Chained easing for continuous but non-linear deceleration
      // Fast to 80, heavy slowdown, then slight acceleration to finish.
      tl.to(counter, {
        val: 80,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.innerText = Math.round(counter.val).toString();
          }
        }
      })
      .to(counter, {
        val: 100,
        duration: 2.2, // long slowdown on the last 20%
        ease: "power1.inOut",
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.innerText = Math.round(counter.val).toString();
          }
        }
      })
      .to(textRef.current, {
        opacity: 0,
        yPercent: -50,
        duration: 0.4,
        ease: "power2.in"
      }, "+=0.2")
      // Wipe out
      .to(containerRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.0,
        ease: "power4.inOut"
      });
    });

    return () => ctx.revert();
  }, []);

  if (complete) return null;

  return (
    <div 
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#000000", // pure black for max contrast during wipe
        color: "var(--neutral-light-lighter)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 5vw",
        zIndex: 9998,
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)"
      }}
    >
      {/* Explicit line height and padding bottom to save the 'g' descender */}
      <div style={{ overflow: "visible", paddingBottom: "0.2em" }}>
        <span 
          ref={textRef}
          style={{
            display: "inline-block",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--neutral-light-darker)",
            fontFamily: "var(--font-display), Georgia, serif",
            fontStyle: "italic",
            lineHeight: 1.2,
          }}
        >
          Loading Details.
        </span>
      </div>
      <div>
        <span 
          style={{
            fontSize: "clamp(4rem, 12vw, 10rem)",
            fontWeight: 900,
            color: "var(--accent-perv-base)",
            fontFamily: "var(--font-body), Arial, sans-serif",
            lineHeight: 1,
            display: "inline-block",
          }}
        >
          <span ref={numberRef}>0</span>%
        </span>
      </div>
    </div>
  );
}
