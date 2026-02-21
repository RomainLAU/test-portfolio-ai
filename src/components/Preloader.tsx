"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Typography } from "@/components/ui/Typography";

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
      className="fixed inset-0 bg-black text-neutral-light-lighter flex items-center justify-between px-[5vw] z-[9998]"
      style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)" }}
    >
      <div className="overflow-visible pb-[0.2em]">
        <Typography
          variant="h3"
          italic
          ref={textRef}
          className="m-0 text-neutral-light-darker leading-[1.2] inline-block"
        >
          Loading Details.
        </Typography>
      </div>
      <div>
        <Typography
          variant="h1"
          font="body"
          className="font-black text-accent-perv-base leading-none m-0 inline-block"
        >
          <span ref={numberRef}>0</span>%
        </Typography>
      </div>
    </div>
  );
}
