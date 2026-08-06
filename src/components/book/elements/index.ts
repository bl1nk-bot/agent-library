import React from "react";
// Re-export all elements from their respective modules
export {
  IconLock,
  IconUser,
  IconClipboard,
  IconSettings,
  IconCheck,
  IconX,
  IconStar,
  IconLightbulb,
  IconTarget,
} from "./icons";
export { CodeEditor } from "./code-editor";
export { ChainExample, ChainFlowDemo } from "./chain";
export { Collapsible, Callout, CopyableCode, Quiz, TryIt, NavButton, NavFooter } from "./ui";
export { Checklist, Compare, InfoGrid } from "./lists";
export { FrameworkDemo, CRISPEFramework, BREAKFramework, RTFFramework } from "./frameworks";
export { PromptBreakdown, SpecificitySpectrum } from "./prompt";
export {
  TokenizerDemo,
  ContextWindowDemo,
  TemperatureDemo,
  StructuredOutputDemo,
  FewShotDemo,
  JsonYamlDemo,
  IterativeRefinementDemo,
  CostCalculatorDemo,
} from "./demos";
export { PrinciplesSummary } from "./principles";
export { JailbreakDemo } from "./security";
export { EmbeddingsDemo, LLMCapabilitiesDemo } from "./ai-demos";
export { TextToImageDemo, TextToVideoDemo } from "./media-demos";
export { SummarizationDemo, ContextPlayground } from "./context-demos";
export { BookPartsNav } from "./navigation";
export { TokenPredictionDemo } from "./token-prediction";
import { SideBySideDiff as UISideBySideDiff, VersionDiff } from "@/components/ui/diff-view";

export function DiffView({
  before,
  after,
  beforeLabel,
  afterLabel,
  ...props
}: Record<string, unknown> & {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  return React.createElement(UISideBySideDiff, {
    original: before,
    modified: after,
    originalLabel: beforeLabel,
    modifiedLabel: afterLabel,
    ...props,
  } as any);
}

export { VersionDiff };
export { ChainErrorDemo } from "./chain-error-demo";
export { ValidationDemo, FallbackDemo, ContentPipelineDemo } from "./chain-demos";
export { FillInTheBlank, InteractiveChecklist, PromptDebugger } from "./exercises";
export { PromptBuilder, PromptAnalyzer } from "./builder";
export { PromptChallenge, BeforeAfterEditor } from "./challenge";
