"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function TechChip({ label }: { label: string }) {
  return (
    <motion.span
      className={cn(
        `
          inline-block px-[1.1rem] py-[0.4rem] rounded-full border text-[0.7rem]
          font-bold uppercase tracking-widest text-accent-mint-lighter
          backdrop-blur-md cursor-default
        `,
        "bg-white/5 border-white/10",
        "transition-all",
        "hover:border-accent-mint-base/50",
        "hover:text-accent-mint-base",
        `
          hover:bg-linear-to-br hover:from-accent-mint-base/20
          hover:to-[#b6b7ff]/20
        `,
        "hover:scale-105",
      )}
      initial={false}
      whileHover={{
        y: -2,
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {label}
    </motion.span>
  );
}
