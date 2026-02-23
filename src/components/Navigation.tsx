"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { AnimatedLink } from "./AnimatedLink";
import { Button } from "./ui/Button";

const links = [
  { name: "Home", href: "/" },
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, {
        clipPath: "circle(0% at calc(100% - 4rem) 4rem)",
      });
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
        ease: "power3.inOut",
      }).to(
        linksRef.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4",
      );
    } else {
      document.body.style.overflow = "";

      const tl = gsap.timeline();
      tl.to(linksRef.current, {
        yPercent: 100,
        opacity: 0,
        duration: 0.4,
        stagger: -0.05,
        ease: "power3.in",
      }).to(
        overlayRef.current,
        {
          clipPath: "circle(0% at calc(100% - 4rem) 4rem)",
          duration: 0.8,
          ease: "power3.inOut",
        },
        "-=0.2",
      );
    }
  }, [isOpen]);

  return (
    <>
      <div
        ref={overlayRef}
        className={`
          fixed top-0 left-0 flex h-screen w-full flex-col justify-center px-8
          sm:px-16
          md:px-32
          bg-neutral-dark-darker/95 backdrop-blur-xl z-nav
        `}
      >
        <nav className={`
          flex flex-col gap-4
          sm:gap-8
        `}>
          {links.map((link, i) => (
            <AnimatedLink
              key={link.name}
              name={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              index={i}
              setRef={(el) => {
                linksRef.current[i] = el;
              }}
            />
          ))}
        </nav>
      </div>

      <Button
        ref={toggleRef}
        onClick={() => setIsOpen(!isOpen)}
        magnetic
        isIconOnly
        size="sm"
        className={cn(
          "fixed top-10 right-12 z-nav",
          !isOpen && "mix-blend-difference",
        )}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </Button>
    </>
  );
}
