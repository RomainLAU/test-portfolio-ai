"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const mouse = { x: 0, y: 0 };
    let hoveredEl: HTMLElement | null = null;
    let hoveredRect: DOMRect | null = null;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!hoveredEl || !hoveredRect) {
        xTo(mouse.x - 11);
        yTo(mouse.y - 11);
      } else {
        // Center-pull magnetic — same for all magnetic elements
        const centerX = hoveredRect.left + hoveredRect.width / 2;
        const centerY = hoveredRect.top + hoveredRect.height / 2;
        const strength = 0.5;
        xTo(mouse.x + (centerX - mouse.x) * strength - 11);
        yTo(mouse.y + (centerY - mouse.y) * strength - 11);
      }
    };

    const handleMouseEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      setIsHovering(true);
      hoveredEl = el;
      // Capture rect strictly on enter so it's fresh (nav menu items shift)
      hoveredRect = el.getBoundingClientRect();
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      hoveredEl = null;
      hoveredRect = null;
      xTo(mouse.x - 11);
      yTo(mouse.y - 11);
    };

    // Hide/show cursor when project cards are hovered
    const handleCursorHide = () => setIsHidden(true);
    const handleCursorShow = () => setIsHidden(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("cursor:hide", handleCursorHide);
    window.addEventListener("cursor:show", handleCursorShow);

    const attachMagnetic = () => {
      // Both data-magnetic (center-pull buttons) and data-cursor="pointer" get magnetic
      const clickables = document.querySelectorAll(
        '[data-magnetic], [data-cursor="pointer"]:not([data-no-magnet])'
      );
      clickables.forEach(el => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
      return clickables;
    };

    // Initial attach + re-attach after any DOM change (e.g. modal open)
    let clickables = attachMagnetic();
    const observer = new MutationObserver(() => {
      clickables.forEach(el => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      clickables = attachMagnetic();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("cursor:hide", handleCursorHide);
      window.removeEventListener("cursor:show", handleCursorShow);
      clickables.forEach(el => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      scale: isHovering ? 2.5 : 1,
      opacity: isHidden ? 0 : 1,
      duration: 0.3,
      ease: "power2.out"
    });
  }, [isHovering, isHidden]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        html, body, a, button, input, [role="button"], * {
          cursor: none !important;
        }
      `}} />
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-[22px] h-[22px] bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
      />
    </>
  );
}
