"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface BlobConfig {
  x: string;
  y: string;
  size: string;
  color: string;
  duration: number;
  delay: number;
}

const BLOBS: BlobConfig[] = [
  { x: "10%",  y: "30%", size: "500px", color: "var(--accent-mint-base)",  duration: 8,  delay: 0    },
  { x: "60%",  y: "15%", size: "400px", color: "var(--accent-coral-base)", duration: 10, delay: 1.5  },
  { x: "35%",  y: "60%", size: "600px", color: "var(--accent-perv-base)",  duration: 12, delay: 0.8  },
  { x: "75%",  y: "55%", size: "350px", color: "var(--accent-mint-darker)", duration: 9, delay: 2    },
];

export default function AnimatedBlobBackground() {
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blobs = blobsRef.current;

    // Gentle floating animation for each blob
    blobs.forEach((blob, i) => {
      if (!blob) return;
      const cfg = BLOBS[i];

      gsap.to(blob, {
        x: `+=${60 + i * 20}`,
        y: `+=${40 + i * 15}`,
        duration: cfg.duration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: cfg.delay,
      });
    });

    // Cursor interaction: closest blob subtly follows cursor
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      blobs.forEach((blob, i) => {
        if (!blob) return;
        // Very gentle pull, each blob responds at different rates
        const factor = 0.04 + i * 0.01;
        gsap.to(blob, {
          x: `+=${(mx - rect.width / 2) * factor}`,
          y: `+=${(my - rect.height / 2) * factor}`,
          duration: 1.5,
          ease: "power1.out",
          overwrite: "auto",
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {BLOBS.map((cfg, i) => (
        <div
          key={i}
          ref={el => { blobsRef.current[i] = el; }}
          style={{
            position: "absolute",
            left: cfg.x,
            top: cfg.y,
            width: cfg.size,
            height: cfg.size,
            borderRadius: "50%",
            background: cfg.color,
            filter: "blur(90px)",
            opacity: 0.18,
            transform: "translate(-50%, -50%)",
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
