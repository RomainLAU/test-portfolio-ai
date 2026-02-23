"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Typography } from "@/components/ui/Typography";
import projects from "@/data/projects.json";
import { useModal } from "@/context/ModalContext";
import { Project } from "@/types/project";

export default function Preloader() {
  const { setLoaded } = useModal();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const [complete, setComplete] = useState(false);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !numberRef.current) return;

    // 1. Get all image URLs from data
    const imageUrls = projects.reduce((acc: string[], project: Project) => {
      if (project.image) acc.push(project.image);
      if (project.images && Array.isArray(project.images)) {
        acc.push(...(project.images as string[]));
      }
      return acc;
    }, []);

    // Unique URLs only
    const uniqueImages = Array.from(new Set(imageUrls));
    const totalAssets = uniqueImages.length;
    let loadedAssets = 0;

    const updateProgress = () => {
      loadedAssets++;
      const currentProgress = Math.round((loadedAssets / totalAssets) * 100);
      setProgress(currentProgress);
    };

    // Preload function
    const preloadImages = async () => {
      const promises = uniqueImages.map((src) => {
        return new Promise<string>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            updateProgress();
            resolve(src);
          };
          img.onerror = () => {
            updateProgress(); // Still count as progress even if error
            resolve(src);
          };
        });
      });
      await Promise.all(promises);
    };

    preloadImages();
  }, []);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Initialize GSAP timeline once
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          setComplete(true);
          setLoaded(true);
          window.dispatchEvent(new Event("loader:finished"));
        },
      });

      tlRef.current = tl;

      tl.to(
        textRef.current,
        {
          opacity: 0,
          yPercent: -50,
          duration: 0.4,
          ease: "power2.in",
        },
        "+=0.2"
      ).to(containerRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.0,
        ease: "power4.inOut",
      });
    });

    return () => ctx.revert();
  }, [setLoaded]);

  // Sync counter and check for completion
  useEffect(() => {
    if (numberRef.current) {
      gsap.to(numberRef.current, {
        innerText: progress,
        duration: 0.5,
        snap: { innerText: 1 },
        ease: "power1.out",
      });
    }

    if (progress === 100 && tlRef.current) {
      tlRef.current.play();
    }
  }, [progress]);

  if (complete) return null;

  return (
    <div
      ref={containerRef}
      className={`
        text-neutral-light-lighter z-top fixed inset-0 flex items-center
        justify-between bg-black px-[5vw]
      `}
      style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)" }}
    >
      <div className="overflow-visible pb-[0.2em]">
        <Typography
          variant="h3"
          italic
          ref={textRef}
          className="text-neutral-light-darker m-0 inline-block leading-[1.2]"
        >
          Loading Details.
        </Typography>
      </div>
      <div>
        <Typography
          variant="h1"
          font="body"
          className={`
            text-accent-perv-base m-0 inline-block leading-none font-black
          `}
        >
          <span ref={numberRef}>0</span>%
        </Typography>
      </div>
    </div>
  );
}
