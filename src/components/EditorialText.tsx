"use client";

import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/Typography";

export function EditorialText({
  text,
  size = "base",
}: {
  text: string;
  size?: "base" | "large";
}) {
  const words = text.split(" ");
  return (
    <div
      className={cn(
        "leading-tight text-neutral-light-base font-light m-0",
        size === "large"
          ? "text-[clamp(1.1rem,2.8vh,2.2rem)] text-center max-w-full"
          : "text-[clamp(0.85rem,1.8vh,1.1rem)] text-left max-w-[45ch]",
      )}
    >
      {words.map((word, i) => {
        const isEmphasized = i % 6 === 0;
        const isItalic = i % 9 === 0;
        const isAccent = word.length > 7 && i % 4 === 0;

        return (
          <Typography
            key={i}
            variant="span"
            italic={isItalic}
            font={isEmphasized || isItalic ? "display" : "body"}
            className={cn(
              "inline",
              isAccent
                ? "text-accent-mint-lighter"
                : isEmphasized
                  ? "text-white font-normal"
                  : "font-light",
            )}
          >
            {word}{" "}
          </Typography>
        );
      })}
    </div>
  );
}
