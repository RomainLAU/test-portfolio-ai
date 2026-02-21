"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  return (
    <motion.div 
      className="overflow-hidden h-[1em] text-[clamp(3rem,10vw,8rem)] font-black uppercase leading-none inline-block w-fit px-[0.2em] py-[0.1em] -mx-[0.2em] -my-[0.1em]"
      data-cursor="pointer"
      data-magnetic
    >
      <a
        href={href}
        ref={setRef}
        onClick={(e) => {
          e.preventDefault();
          onClick();
          setTimeout(() => {
            smoothScrollTo(href);
          }, 300);
        }}
        className="block no-underline w-fit"
      >
        <motion.div 
          className="flex flex-col transform-gpu"
          initial={{ y: 0 }}
          whileHover={{ y: "-50%" }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        >
          <span className="text-neutral-light-lighter block">{name}</span>
          <span className="text-accent-coral-base block">{name}</span>
        </motion.div>
      </a>
    </motion.div>
  );
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { clipPath: "circle(0% at calc(100% - 4rem) 4rem)" });
      gsap.set(linksRef.current, { yPercent: 100, opacity: 0 });
    }
  }, []);

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
        className={cn(
          "fixed top-8 right-8 z-[100] flex h-16 w-16 items-center justify-center rounded-full bg-neutral-dark-base text-neutral-light-lighter transition-all duration-300 hover:scale-110 border-none cursor-none",
          !isOpen && "mix-blend-difference"
        )}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div
        ref={overlayRef}
        className="fixed top-0 left-0 z-[99] flex h-screen w-full flex-col justify-center px-8 sm:px-16 md:px-32 bg-neutral-dark-darker/95 backdrop-blur-xl"
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
