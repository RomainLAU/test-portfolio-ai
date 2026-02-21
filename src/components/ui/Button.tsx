"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils"; 

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  magnetic?: boolean;
  withArrow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "glass", size = "md", href, magnetic, withArrow, children, ...props }, ref) => {
    const variants = {
      primary: "bg-accent-mint-base text-neutral-dark-base hover:bg-accent-mint-lighter",
      secondary: "bg-accent-coral-base text-white hover:bg-accent-coral-lighter",
      outline: "border border-white/20 text-white hover:bg-white/5",
      ghost: "text-white hover:bg-white/5",
      glass: "bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/10",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
      xl: "px-10 py-5 text-lg",
    };

    const baseClasses = "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 uppercase tracking-widest";
    
    const content = (
      <>
        {children}
        {withArrow && (
          <motion.span 
            className="inline-block"
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 45, x: 2, y: -2 }}
          >
            ↗
          </motion.span>
        )}
      </>
    );

    const classes = cn(baseClasses, variants[variant], sizes[size], className);

    if (href) {
      return (
        <a 
          href={href} 
          className={classes}
          data-cursor="pointer"
          data-magnetic={magnetic ? "true" : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={classes}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-cursor="pointer"
        data-magnetic={magnetic ? "true" : undefined}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
