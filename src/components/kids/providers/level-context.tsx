"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

/** Context shape for level navigation and section completion tracking. */
interface LevelContextType {
  levelSlug: string;
  setLevelSlug: (slug: string) => void;
  currentSection: number;
  setCurrentSection: (section: number | ((prev: number) => number)) => void;
  completedSections: Set<number>;
  markSectionComplete: (section: number) => void;
  isSectionComplete: (section: number) => boolean;
  resetSectionProgress: () => void;
  // Track sections that have interactive elements requiring completion
  sectionsWithRequirements: Set<number>;
  registerSectionRequirement: (section: number) => void;
  sectionRequiresCompletion: (section: number) => boolean;
}

const LevelContext = createContext<LevelContextType>({
  levelSlug: "",
  setLevelSlug: () => { },
  currentSection: 0,
  setCurrentSection: () => { },
  completedSections: new Set(),
  markSectionComplete: () => { },
  isSectionComplete: () => false,
  resetSectionProgress: () => { },
  sectionsWithRequirements: new Set(),
  registerSectionRequirement: () => { },
  sectionRequiresCompletion: () => false,
});

/**
 * Context provider for a single level's navigation state.
 * Tracks the current section index, completed sections, and sections
 * that have interactive requirements before the user can proceed.
 */
export function LevelProvider({
  children,
  levelSlug: initialSlug = ""
}: {
  children: ReactNode;
  levelSlug?: string;
}) {
  const [levelSlug, setLevelSlug] = useState(initialSlug);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [sectionsWithRequirements, setSectionsWithRequirements] = useState<Set<number>>(new Set());

  // Update if initialSlug changes
  useEffect(() => {
    if (initialSlug) {
      queueMicrotask(() => setLevelSlug(initialSlug));
    }
  }, [initialSlug]);

  // Reset section progress when level changes
  useEffect(() => {
    queueMicrotask(() => {
      setCurrentSection(0);
      setCompletedSections(new Set());
      setSectionsWithRequirements(new Set());
    });
  }, [levelSlug]);

  const markSectionComplete = useCallback((section: number) => {
    setCompletedSections(prev => {
      const newSet = new Set(prev);
      newSet.add(section);
      return newSet;
    });
  }, []);

  const isSectionComplete = useCallback((section: number) => {
    return completedSections.has(section);
  }, [completedSections]);

  const resetSectionProgress = useCallback(() => {
    setCompletedSections(new Set());
    setSectionsWithRequirements(new Set());
    setCurrentSection(0);
  }, []);

  const registerSectionRequirement = useCallback((section: number) => {
    setSectionsWithRequirements(prev => {
      if (prev.has(section)) return prev;
      const newSet = new Set(prev);
      newSet.add(section);
      return newSet;
    });
  }, []);

  const sectionRequiresCompletion = useCallback((section: number) => {
    return sectionsWithRequirements.has(section);
  }, [sectionsWithRequirements]);

  return (
    <LevelContext.Provider value={{
      levelSlug,
      setLevelSlug,
      currentSection,
      setCurrentSection,
      completedSections,
      markSectionComplete,
      isSectionComplete,
      resetSectionProgress,
      sectionsWithRequirements,
      registerSectionRequirement,
      sectionRequiresCompletion,
    }}>
      {children}
    </LevelContext.Provider>
  );
}

/** Returns the current level's slug from context. */
export function useLevelSlug(): string {
  const context = useContext(LevelContext);
  return context.levelSlug;
}

/** Returns the setter for the current level slug from context. */
export function useSetLevelSlug(): (slug: string) => void {
  const context = useContext(LevelContext);
  return context.setLevelSlug;
}

/** Returns navigation helpers (current section, mark-complete, requirements) from the level context. */
export function useSectionNavigation() {
  const context = useContext(LevelContext);
  return {
    currentSection: context.currentSection,
    setCurrentSection: context.setCurrentSection,
    completedSections: context.completedSections,
    markSectionComplete: context.markSectionComplete,
    isSectionComplete: context.isSectionComplete,
    resetSectionProgress: context.resetSectionProgress,
    sectionsWithRequirements: context.sectionsWithRequirements,
    registerSectionRequirement: context.registerSectionRequirement,
    sectionRequiresCompletion: context.sectionRequiresCompletion,
  };
}
