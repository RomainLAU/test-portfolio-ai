"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Project } from "@/types/project";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { ProjectModal } from "@/components/ProjectModal";
import { Portal } from "@/components/Portal";

interface ModalContextType {
  openProject: (project: Project) => void;
  closeProject: () => void;
  activeProject: Project | null;
  isLoaded: boolean;
  setLoaded: (val: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const openProject = useCallback((project: Project) => {
    setActiveProject(project);
  }, []);

  const closeProject = useCallback(() => {
    setActiveProject(null);
  }, []);

  const setLoaded = useCallback((val: boolean) => {
    setIsLoaded(val);
  }, []);

  return (
    <ModalContext.Provider
      value={{ openProject, closeProject, activeProject, isLoaded, setLoaded }}
    >
      <LayoutGroup>
        {children}
        <Portal>
          <AnimatePresence>
            {activeProject && (
              <ProjectModal project={activeProject} onClose={closeProject} />
            )}
          </AnimatePresence>
        </Portal>
      </LayoutGroup>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
