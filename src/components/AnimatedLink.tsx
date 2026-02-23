"use client";

import { motion } from "framer-motion";
import { smoothScrollTo } from "@/lib/scroll-utils";

interface AnimatedLinkProps {
  name: string;
  href: string;
  onClick: () => void;
  index: number;
  setRef: (el: HTMLAnchorElement | null) => void;
}

export function AnimatedLink({
  name,
  href,
  onClick,
  setRef,
}: AnimatedLinkProps) {
  return (
    <motion.div
      className={`
        overflow-hidden h-[1em] text-[clamp(3rem,10vw,8rem)] font-black
        uppercase leading-none inline-block w-fit px-[0.2em] py-[0.1em]
        -mx-[0.2em] -my-[0.1em]
      `}
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
