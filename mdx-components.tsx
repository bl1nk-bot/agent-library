import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { BeforeAfterEditor, BookPartsNav, BREAKFramework, Callout, ChainErrorDemo, ChainExample, ChainFlowDemo, Checklist, CodeEditor, Collapsible, Compare, ContentPipelineDemo, ContextPlayground, ContextWindowDemo, CostCalculatorDemo, CRISPEFramework, DiffView, EmbeddingsDemo, FallbackDemo, FewShotDemo, FillInTheBlank, IconCheck, IconClipboard, IconLightbulb, IconLock, IconSettings, IconStar, IconTarget, IconUser, IconX, InfoGrid, InteractiveChecklist, IterativeRefinementDemo, JailbreakDemo, JsonYamlDemo, LLMCapabilitiesDemo, NavButton, NavFooter, PrinciplesSummary, PromptAnalyzer, PromptBreakdown, PromptBuilder, PromptChallenge, PromptDebugger, Quiz, RTFFramework, SpecificitySpectrum, StructuredOutputDemo, SummarizationDemo, TemperatureDemo, TextToImageDemo, TextToVideoDemo, TokenizerDemo, TokenPredictionDemo, TryIt, ValidationDemo, VersionDiff } from "@/components/book/interactive";
import { PromiCharacter, PromiWithMessage, Panel, StoryScene, PromptVsMistake, MagicWords, DragDropPrompt, LevelComplete, Section, PromptParts, ExampleMatcher, PromptDoctor, StepByStep, PromptLab, WordPredictor } from "@/components/kids/elements";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    table: (props: ComponentPropsWithoutRef<"table">) => (
      <div className="my-6 w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm" {...props} />
      </div>
    ),
    thead: (props: ComponentPropsWithoutRef<"thead">) => (
      <thead className="bg-muted/50" {...props} />
    ),
    tbody: (props: ComponentPropsWithoutRef<"tbody">) => (
      <tbody {...props} />
    ),
    th: (props: ComponentPropsWithoutRef<"th">) => (
      <th className="border border-border px-4 py-2 text-left font-semibold" {...props} />
    ),
    td: (props: ComponentPropsWithoutRef<"td">) => (
      <td className="border border-border px-4 py-2" {...props} />
    ),
    tr: (props: ComponentPropsWithoutRef<"tr">) => (
      <tr className="even:bg-muted/30" {...props} />
    ),
    BeforeAfterEditor,
    BookPartsNav,
    BREAKFramework,
    Callout,
    ChainErrorDemo,
    ChainExample,
    ChainFlowDemo,
    Checklist,
    CodeEditor,
    Collapsible,
    Compare,
    ContentPipelineDemo,
    ContextPlayground,
    ContextWindowDemo,
    CostCalculatorDemo,
    CRISPEFramework,
    DiffView,
    EmbeddingsDemo,
    FallbackDemo,
    FewShotDemo,
    FillInTheBlank,
    IconCheck,
    IconClipboard,
    IconLightbulb,
    IconLock,
    IconSettings,
    IconStar,
    IconTarget,
    IconUser,
    IconX,
    InfoGrid,
    InteractiveChecklist,
    IterativeRefinementDemo,
    JailbreakDemo,
    JsonYamlDemo,
    LLMCapabilitiesDemo,
    NavButton,
    NavFooter,
    PrinciplesSummary,
    PromptAnalyzer,
    PromptBreakdown,
    PromptBuilder,
    PromptChallenge,
    PromptDebugger,
    Quiz,
    RTFFramework,
    SpecificitySpectrum,
    StructuredOutputDemo,
    SummarizationDemo,
    TemperatureDemo,
    TextToImageDemo,
    TextToVideoDemo,
    TokenizerDemo,
    TokenPredictionDemo,
    TryIt,
    ValidationDemo,
    VersionDiff,
    // Kids components
    PromiCharacter,
    PromiWithMessage,
    Panel,
    StoryScene,
    PromptVsMistake,
    MagicWords,
    DragDropPrompt,
    LevelComplete,
    Section,
    PromptParts,
    ExampleMatcher,
    PromptDoctor,
    StepByStep,
    PromptLab,
    WordPredictor,
  };
}
