"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Typography } from "@/components/ui/Typography";
import { TechChip } from "./TechChip";
import { EditorialText } from "./EditorialText";
import { Project } from "@/types/project";
import { Button } from "./ui/Button";
import { X } from "lucide-react";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={false}
      exit={{ opacity: 0 }}
      className={`
        fixed inset-0 z-modal overflow-hidden flex items-center justify-center
      `}
    >
      {/* Backdrop animation - separated to not hide the layout transition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl z-0"
        onClick={onClose}
      />

      {/* Close button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        magnetic
        isIconOnly
        size="sm"
        className="fixed top-10 right-12 z-20"
      >
        <X size={28} />
      </Button>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative h-full w-full flex flex-col p-[4vh] px-[8vw] gap-[3vh]
          overflow-hidden select-none z-10
        `}
      >
        {/* ROW 1: Image - Text */}
        <div className="flex-35 flex gap-12 items-center">
          <motion.div
            layoutId={`image-${project.id}`}
            className={`
              h-full aspect-26/22 rounded-xl overflow-hidden shadow-2xl relative
              shrink-0
            `}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 30,
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover opacity-100"
              unoptimized
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col justify-center gap-4"
          >
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <TechChip key={t} label={t} />
              ))}
            </div>
            <Typography
              variant="h2"
              className="text-white leading-none tracking-tighter m-0"
            >
              {project.title}
            </Typography>
            <div className="border-l-3 border-accent-coral-base pl-6">
              <Typography
                variant="small"
                className="text-neutral-light-darker mb-1"
              >
                Role
              </Typography>
              <Typography
                variant="h4"
                italic
                className="text-accent-coral-base mb-0"
              >
                {project.role}
              </Typography>
            </div>
            <div>
              <EditorialText text={project.longDescription[0]} />
            </div>
          </motion.div>
        </div>

        {/* ROW 2: Text - Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex-30 flex gap-12 items-center"
        >
          <div className="grow flex flex-col items-end text-right">
            <div>
              <EditorialText text={project.longDescription[1]} />
            </div>
          </div>
          <div className={`
            h-full aspect-4/3 rounded-[24px] overflow-hidden shadow-2xl relative
            shrink-0
          `}>
            <Image
              src={project.images[1]}
              alt={project.title + " view 2"}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* ROW 3: Full Width Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex-10 flex items-center justify-center"
        >
          <div>
            <EditorialText text={project.longDescription[2]} size="large" />
          </div>
        </motion.div>

        {/* ROW 4: Full Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex-25 rounded-[24px] overflow-hidden shadow-2xl relative"
        >
          <Image
            src={project.images[2]}
            alt={project.title + " full"}
            fill
            className="object-cover"
          />
          <div className={`
            absolute inset-0 bg-linear-to-t from-black/60 to-transparent
          `} />
          <div className="absolute bottom-6 left-8">
            <Typography variant="small" className="tracking-[0.4em]">
              Experience Excellence
            </Typography>
            <span className={`
              block text-[0.5rem] text-white/50 tracking-widest mt-1 italic
            `}>
              Project Portfolio Reference
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
