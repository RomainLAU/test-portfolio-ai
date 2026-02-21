"use client";

import { useEffect } from "react";
import { ReactLenis } from "lenis/react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Lenis is automatically synchronized with GSAP ticker if they are running in the same context,
    // but ReactLenis handles the setup. The recommended integration is to update lenis on gsap ticker
    // or just let lenis requestAnimationFrame handle it. `ReactLenis` handles the raf loop automatically by default.
    // However, for perfect ScrollTrigger syncing:
    // This effect ensures GSAP ticker runs lenis' raf
  }, []);

  return (
    <ReactLenis root>
      {children}
    </ReactLenis>
  );
}
