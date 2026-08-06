"use client";

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
} from "./elements/icons";
export { CodeEditor } from "./elements/code-editor";
export { ChainExample, ChainFlowDemo } from "./elements/chain";
export {
  Collapsible,
  Callout,
  CopyableCode,
  Quiz,
  TryIt,
  NavButton,
  NavFooter,
} from "./elements/ui";
export { Checklist, Compare, InfoGrid } from "./elements/lists";
export {
  FrameworkDemo,
  CRISPEFramework,
  BREAKFramework,
  RTFFramework,
} from "./elements/frameworks";
export { PromptBreakdown, SpecificitySpectrum } from "./elements/prompt";
export {
  TokenizerDemo,
  ContextWindowDemo,
  TemperatureDemo,
  StructuredOutputDemo,
  FewShotDemo,
  JsonYamlDemo,
  IterativeRefinementDemo,
  CostCalculatorDemo,
} from "./elements/demos";
export { PrinciplesSummary } from "./elements/principles";
export { JailbreakDemo } from "./elements/security";
export { EmbeddingsDemo, LLMCapabilitiesDemo } from "./elements/ai-demos";
export { TextToImageDemo, TextToVideoDemo } from "./elements/media-demos";
export { SummarizationDemo, ContextPlayground } from "./elements/context-demos";
export { BookPartsNav } from "./elements/navigation";
export { TokenPredictionDemo } from "./elements/token-prediction";

export { ChainErrorDemo } from "./elements/chain-error-demo";
export { ValidationDemo, FallbackDemo, ContentPipelineDemo } from "./elements/chain-demos";
export { FillInTheBlank, InteractiveChecklist, PromptDebugger } from "./elements/exercises";
export { PromptBuilder, PromptAnalyzer } from "./elements/builder";
export { PromptChallenge, BeforeAfterEditor } from "./elements/challenge";

import React from "react";
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
  const diffProps = {
    original: before,
    modified: after,
    originalLabel: beforeLabel,
    modifiedLabel: afterLabel,
    ...props,
  } as any;
  return React.createElement(UISideBySideDiff, diffProps);
}

export { VersionDiff };
