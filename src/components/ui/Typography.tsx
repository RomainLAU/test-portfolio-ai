"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "small";
  font?: "display" | "body";
  italic?: boolean;
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    { variant = "p", font, italic, className, children, as: Component },
    ref,
  ) => {
    const Tag = Component || (variant === "small" ? "small" : variant);

    const variants = {
      h1: "text-[clamp(3.5rem,12vw,10rem)] leading-[0.9] tracking-tighter mb-4",
      h2: "text-[clamp(2.5rem,8vw,6rem)] leading-[1] tracking-tighter mb-4",
      h3: "text-[clamp(1.5rem,5vw,3rem)] leading-[1.1] tracking-tight mb-3",
      h4: "text-[clamp(1.2rem,3vw,1.8rem)] leading-[1.2] tracking-tight mb-2",
      p: "text-[clamp(0.95rem,1.8vw,1.2rem)] leading-[1.6] mb-4 text-neutral-light-darker font-light",
      span: "inline-block",
      small:
        "text-[0.6rem] uppercase tracking-[0.4em] font-bold text-accent-mint-base",
    };

    const fonts = {
      display: "font-display",
      body: "font-body",
    };

    // Default fonts based on variant if not specified
    const resolvedFont =
      font || (["h1", "h2", "h3", "h4"].includes(variant) ? "display" : "body");

    const classes = cn(
      variants[variant],
      fonts[resolvedFont],
      italic && "italic",
      className,
    );

    return (
      <Tag ref={ref} className={classes}>
        {children}
      </Tag>
    );
  },
);

Typography.displayName = "Typography";

export { Typography };
