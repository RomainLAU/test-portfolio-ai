"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" }
];

// Smooth scroll helper
function smoothScrollTo(href: string) {
  if (href === "/") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  // Ensure the element actually exists and we use smooth scrolling
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function AnimatedLink({
  name,
  href,
  onClick,
  setRef,
}: {
  name: string;
  href: string;
  onClick: () => void;
  index: number;
  setRef: (el: HTMLAnchorElement | null) => void;
}) {
  const textWrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (textWrapperRef.current) {
      gsap.to(textWrapperRef.current, { yPercent: -50, duration: 0.4, ease: "power3.inOut" });
    }
  };

  const handleMouseLeave = () => {
    if (textWrapperRef.current) {
      gsap.to(textWrapperRef.current, { yPercent: 0, duration: 0.4, ease: "power3.inOut" });
    }
  };

  return (
    <div 
      style={{ 
        overflow: "hidden", 
        height: "1em", 
        fontSize: "clamp(3rem, 10vw, 8rem)",
        fontWeight: "900",
        textTransform: "uppercase",
        lineHeight: 1,
        display: "inline-block",
        width: "fit-content",
        padding: "0.1em 0.2em", // give magnetic hit area a bit of breathing room
        margin: "-0.1em -0.2em"
      }}
      // Put the mouse/magnetic events on the stable wrapper context, not the inner animated A tag
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="pointer"
      data-magnetic
    >
      <a
        href={href}
        ref={setRef}
        onClick={(e) => {
          e.preventDefault();
          onClick();
          // Small timeout so the menu closes visually before/while scrolling starts
          setTimeout(() => {
            smoothScrollTo(href);
          }, 300);
        }}
        className="block"
        style={{ textDecoration: "none", width: "fit-content" }}
      >
        <div ref={textWrapperRef} className="flex flex-col" style={{ transform: "translateY(0%)" }}>
          <span className="text-neutral-light-lighter block">{name}</span>
          <span className="text-accent-coral-base block">{name}</span>
        </div>
      </a>
    </div>
  );
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Initial setup
  useEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { clipPath: "circle(0% at calc(100% - 4rem) 4rem)" });
      gsap.set(linksRef.current, { yPercent: 100, opacity: 0 });
    }
  }, []);

  // Animation on open/close
  useEffect(() => {
    if (!overlayRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        clipPath: "circle(150% at calc(100% - 4rem) 4rem)",
        duration: 0.8,
        ease: "power3.inOut"
      })
      .to(linksRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.4");
    } else {
      document.body.style.overflow = "";

      const tl = gsap.timeline();
      tl.to(linksRef.current, {
        yPercent: 100,
        opacity: 0,
        duration: 0.4,
        stagger: -0.05,
        ease: "power3.in"
      })
      .to(overlayRef.current, {
        clipPath: "circle(0% at calc(100% - 4rem) 4rem)",
        duration: 0.8,
        ease: "power3.inOut"
      }, "-=0.2");
    }
  }, [isOpen]);

  return (
    <>
      <button
        ref={toggleRef}
        onClick={() => setIsOpen(!isOpen)}
        data-cursor="pointer"
        data-magnetic
        className="fixed top-8 right-8 z-[100] flex h-16 w-16 items-center justify-center rounded-full bg-neutral-dark-base text-neutral-light-lighter transition-all duration-300 hover:scale-110"
        style={{
          border: "none",
          mixBlendMode: isOpen ? "normal" : "difference",
          cursor: "none" // managed by CustomCursor
        }}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div
        ref={overlayRef}
        // Change from highly bright bg-neutral-light-base to a darker elegant theme
        className="fixed top-0 left-0 z-[99] flex h-screen w-full flex-col justify-center px-8 sm:px-16 md:px-32"
        style={{
          backgroundColor: "rgba(5, 5, 5, 0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <nav className="flex flex-col gap-4 sm:gap-8">
          {links.map((link, i) => (
            <AnimatedLink 
              key={link.name} 
              name={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)} 
              index={i}
              setRef={(el) => { linksRef.current[i] = el; }}
            />
          ))}
        </nav>
      </div>
    </>
  );
}
