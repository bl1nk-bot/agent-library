/* eslint-disable */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Upload,
  X,
  ArrowDown,
  Play,
  Image as ImageIcon,
  Video,
  Volume2,
  Paperclip,
  Search,
  Sparkles,
  BookOpen,
  ExternalLink,
  ChevronDown,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { VariableToolbar } from "./variable-toolbar";
import { VariableWarning } from "./variable-warning";
import { VariableHint } from "./variable-hint";
import { StructuredFormatWarning } from "./structured-format-warning";
import { ContributorSearch } from "./contributor-search";
import { PromptBuilder, type PromptBuilderHandle } from "./prompt-builder";
import { MediaGenerator } from "./media-generator";
import { SkillEditor } from "./skill-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  parseSkillFiles,
  serializeSkillFiles,
  getLanguageFromFilename,
  validateFilename,
  suggestFilename,
  generateSkillContentWithFrontmatter,
  updateSkillFrontmatter,
  validateSkillFrontmatter,
  DEFAULT_SKILL_FILE,
  DEFAULT_SKILL_CONTENT,
  type SkillFile,
} from "@/lib/skill-files";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CodeEditor, type CodeEditorHandle } from "@/components/ui/code-editor";
import { toast } from "sonner";
import { prettifyJson } from "@/lib/format";
import { analyticsPrompt } from "@/lib/analytics";
import { getPromptUrl } from "@/lib/urls";
import { AI_MODELS, getModelsByProvider, type PromptMCPConfig } from "@/lib/works-best-with";

interface MediaFieldProps {
  form: ReturnType<typeof useForm<PromptFormValues>>;
  t: (key: string) => string;
  promptType?: string;
  promptContent?: string;
}

function MediaField({ form, t, promptType, promptContent }: MediaFieldProps) {
  const [storageMode, setStorageMode] = useState<string>("url");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [hasGenerators, setHasGenerators] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaUrl = form.watch("mediaUrl");
  const isVideoType = promptType === "VIDEO";
  const isAudioType = promptType === "AUDIO";
  const mediaType = isVideoType ? "VIDEO" : isAudioType ? "AUDIO" : "IMAGE";

  useEffect(() => {
    fetch("/api/config/storage")
      .then((res) => res.json())
      .then((data) => setStorageMode(data.mode))
      .catch(() => setStorageMode("url"));
  }, []);

  // Check if media generation is available
  useEffect(() => {
    fetch("/api/media-generate")
      .then((res) => res.json())
      .then((data) => {
        const models = isVideoType
          ? data.videoModels
          : isAudioType
            ? data.audioModels
            : data.imageModels;
        setHasGenerators(models && models.length > 0);
      })
      .catch(() => setHasGenerators(false));
  }, [isVideoType, isAudioType]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (4MB for both - Vercel serverless limit)
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(t(isVideoType ? "videoTooLarge" : "fileTooLarge"));
      return;
    }

    // Validate file type
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const allowedVideoTypes = ["video/mp4"];
    const allowedAudioTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"];
    const allowedTypes = isVideoType
      ? allowedVideoTypes
      : isAudioType
        ? allowedAudioTypes
        : allowedImageTypes;
    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        t(isVideoType ? "invalidVideoType" : isAudioType ? "invalidAudioType" : "invalidFileType")
      );
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      form.setValue("mediaUrl", result.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const clearMedia = () => {
    form.setValue("mediaUrl", "");
    setUploadError(null);
  };

  const handleMediaGenerated = (url: string) => {
    form.setValue("mediaUrl", url);
    setShowUpload(false);
  };

  const handleUploadClick = () => {
    if (storageMode === "url") {
      setShowUpload(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  // URL mode with generator option
  if (storageMode === "url") {
    return (
      <FormField
        control={form.control}
        name="mediaUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("mediaUrl")}</FormLabel>
            <div className="space-y-3">
              {mediaUrl ? (
                <div className="space-y-2">
                  <div className="relative inline-block">
                    {isVideoType ? (
                      <video src={mediaUrl} controls className="max-h-40 rounded-md border" />
                    ) : isAudioType ? (
                      <audio src={mediaUrl} controls className="w-full max-w-md" />
                    ) : (
                      <img src={mediaUrl} alt="Preview" className="max-h-40 rounded-md border" />
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={clearMedia}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {hasGenerators && !showUpload ? (
                    <div className="border-primary/30 from-primary/5 to-primary/10 space-y-3 rounded-lg border-2 border-dashed bg-gradient-to-br p-4">
                      <div className="text-primary flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        <span className="font-medium">{t("aiGenerationAvailable")}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {t(
                          isVideoType
                            ? "generateVideoDescription"
                            : isAudioType
                              ? "generateAudioDescription"
                              : "generateImageDescription"
                        )}
                      </p>
                      <MediaGenerator
                        prompt={promptContent || ""}
                        mediaType={mediaType as "IMAGE" | "VIDEO" | "AUDIO"}
                        onMediaGenerated={handleMediaGenerated}
                        onUploadClick={handleUploadClick}
                      />
                    </div>
                  ) : (
                    <MediaGenerator
                      prompt={promptContent || ""}
                      mediaType={mediaType as "IMAGE" | "VIDEO" | "AUDIO"}
                      onMediaGenerated={handleMediaGenerated}
                      onUploadClick={handleUploadClick}
                    />
                  )}
                  {showUpload && (
                    <FormControl>
                      <Input placeholder={t("mediaUrlPlaceholder")} {...field} />
                    </FormControl>
                  )}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Upload mode: show file upload with generator option
  return (
    <FormField
      control={form.control}
      name="mediaUrl"
      render={() => (
        <FormItem>
          <FormLabel>
            {t(isVideoType ? "mediaVideo" : isAudioType ? "mediaAudio" : "mediaImage")}
          </FormLabel>
          <FormControl>
            <div className="space-y-3">
              {mediaUrl ? (
                <div className="relative inline-block">
                  {isVideoType ? (
                    <video src={mediaUrl} controls className="max-h-40 rounded-md border" />
                  ) : isAudioType ? (
                    <audio src={mediaUrl} controls className="w-full max-w-md" />
                  ) : (
                    <img src={mediaUrl} alt="Preview" className="max-h-40 rounded-md border" />
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={clearMedia}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  {hasGenerators && !showUpload ? (
                    <div className="border-primary/30 from-primary/5 to-primary/10 space-y-3 rounded-lg border-2 border-dashed bg-gradient-to-br p-4">
                      <div className="text-primary flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        <span className="font-medium">{t("aiGenerationAvailable")}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {t(
                          isVideoType
                            ? "generateVideoDescription"
                            : isAudioType
                              ? "generateAudioDescription"
                              : "generateImageDescription"
                        )}
                      </p>
                      <MediaGenerator
                        prompt={promptContent || ""}
                        mediaType={mediaType as "IMAGE" | "VIDEO" | "AUDIO"}
                        onMediaGenerated={handleMediaGenerated}
                        onUploadClick={handleUploadClick}
                      />
                    </div>
                  ) : (
                    <MediaGenerator
                      prompt={promptContent || ""}
                      mediaType={mediaType as "IMAGE" | "VIDEO" | "AUDIO"}
                      onMediaGenerated={handleMediaGenerated}
                      onUploadClick={handleUploadClick}
                    />
                  )}
                  {showUpload && (
                    <div
                      className="hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploading ? (
                        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                      ) : (
                        <Upload className="text-muted-foreground h-8 w-8" />
                      )}
                      <p className="text-muted-foreground text-sm">
                        {isUploading
                          ? t("uploading")
                          : t(
                              isVideoType
                                ? "clickToUploadVideo"
                                : isAudioType
                                  ? "clickToUploadAudio"
                                  : "clickToUpload"
                            )}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {t(
                          isVideoType
                            ? "maxVideoSize"
                            : isAudioType
                              ? "maxAudioSize"
                              : "maxFileSize"
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={
                  isVideoType
                    ? "video/mp4"
                    : isAudioType
                      ? "audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                      : "image/jpeg,image/png,image/gif,image/webp"
                }
                className="hidden"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              {uploadError && <p className="text-destructive text-sm">{uploadError}</p>}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const createPromptSchema = (t: (key: string) => string) =>
  z
    .object({
      title: z.string().min(1, t("titleRequired")).max(200),
      description: z.string().max(500).optional(),
      content: z.string().min(1, t("contentRequired")),
      type: z.enum(["TEXT", "IMAGE", "VIDEO", "AUDIO", "SKILL"]), // Output type or SKILL
      structuredFormat: z.enum(["JSON", "YAML"]).optional(),
      categoryId: z.string().optional(),
      tagIds: z.array(z.string()),
      isPrivate: z.boolean(),
      mediaUrl: z.string().url().optional().or(z.literal("")),
      requiresMediaUpload: z.boolean(),
      requiredMediaType: z.enum(["IMAGE", "VIDEO", "DOCUMENT"]).optional(),
      requiredMediaCount: z.coerce.number().int().min(1).max(10).optional(),
      bestWithModels: z.array(z.string()).max(3).optional(),
      bestWithMCP: z
        .array(
          z.object({
            command: z.string(),
            tools: z.array(z.string()).optional(),
          })
        )
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.type === "SKILL") {
        const frontmatterError = validateSkillFrontmatter(data.content);
        if (frontmatterError) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t(`validation.${frontmatterError}`),
            path: ["content"],
          });
        }
      }
    });

type PromptFormValues = z.infer<ReturnType<typeof createPromptSchema>>;

interface Contributor {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
}

interface PromptFormProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
  }>;
  initialData?: Partial<PromptFormValues>;
  initialContributors?: Contributor[];
  promptId?: string;
  mode?: "create" | "edit";
  aiGenerationEnabled?: boolean;
  aiModelName?: string;
  initialPromptRequest?: string;
}

// Read builder data from sessionStorage before form initialization
function getBuilderData(): { content?: string; type?: string; format?: string } | null {
  if (typeof window === "undefined") return null;
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("from") !== "builder") return null;

  const storedData = sessionStorage.getItem("promptBuilderData");
  if (!storedData) return null;

  sessionStorage.removeItem("promptBuilderData");
  try {
    return JSON.parse(storedData);
  } catch {
    return null;
  }
}

export function PromptForm({
  categories,
  tags,
  initialData,
  initialContributors = [],
  promptId,
  mode = "create",
  aiGenerationEnabled = false,
  aiModelName,
  initialPromptRequest,
}: PromptFormProps) {
  const router = useRouter();
  const t = useTranslations("prompts");
  const tCommon = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const [contributors, setContributors] = useState<Contributor[]>(initialContributors);
  const [usedAiButtons, setUsedAiButtons] = useState<Set<string>>(new Set());
  const builderRef = useRef<PromptBuilderHandle>(null);
  const [availableGenerators, setAvailableGenerators] = useState<string[]>([]);

  // Get builder data on first render
  const [builderData] = useState(() => getBuilderData());

  const promptSchema = createPromptSchema(t);
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema) as never,
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      content:
        builderData?.content ||
        (initialData?.content && initialData?.structuredFormat === "JSON"
          ? prettifyJson(initialData.content)
          : initialData?.content || ""),
      type: builderData?.format
        ? "TEXT"
        : (builderData?.type as "TEXT" | "IMAGE" | "VIDEO" | "AUDIO") ||
          initialData?.type ||
          "TEXT",
      structuredFormat:
        (builderData?.format as "JSON" | "YAML") || initialData?.structuredFormat || undefined,
      categoryId: initialData?.categoryId || "",
      tagIds: initialData?.tagIds || [],
      isPrivate: initialData?.isPrivate || false,
      mediaUrl: initialData?.mediaUrl || "",
      requiresMediaUpload: initialData?.requiresMediaUpload || false,
      requiredMediaType: initialData?.requiredMediaType || "IMAGE",
      requiredMediaCount: initialData?.requiredMediaCount || 1,
      bestWithModels: initialData?.bestWithModels || [],
      bestWithMCP: initialData?.bestWithMCP || [],
    },
  });

  // State for MCP input and advanced section
  const [newMcpCommand, setNewMcpCommand] = useState("");
  const [newMcpTools, setNewMcpTools] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const bestWithMCP = form.watch("bestWithMCP") || [];
  const bestWithModels = form.watch("bestWithModels") || [];
  const modelsByProvider = getModelsByProvider();

  const selectedTags = form.watch("tagIds");
  const promptType = form.watch("type");
  const structuredFormat = form.watch("structuredFormat");
  const isStructuredInput = !!structuredFormat;
  const [tagSearch, setTagSearch] = useState("");
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const requiresMediaUpload = form.watch("requiresMediaUpload");
  const promptContent = form.watch("content");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const codeEditorRef = useRef<CodeEditorHandle>(null);

  // Warn user before leaving page with unsaved changes
  const isDirty = form.formState.isDirty;
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Watch title and description to update skill frontmatter
  const watchedTitle = form.watch("title");
  const watchedDescription = form.watch("description");
  const prevTitleRef = useRef(watchedTitle);
  const prevDescriptionRef = useRef(watchedDescription);

  useEffect(() => {
    // Only update if type is SKILL and title or description actually changed
    if (promptType !== "SKILL") return;

    const titleChanged = prevTitleRef.current !== watchedTitle;
    const descChanged = prevDescriptionRef.current !== watchedDescription;

    if (titleChanged || descChanged) {
      prevTitleRef.current = watchedTitle;
      prevDescriptionRef.current = watchedDescription;

      const currentContent = form.getValues("content");
      // Only update if content already has frontmatter (avoid overwriting during initial load)
      if (currentContent && currentContent.startsWith("---")) {
        const updatedContent = updateSkillFrontmatter(
          currentContent,
          watchedTitle,
          watchedDescription || ""
        );
        form.setValue("content", updatedContent);
      }
    }
  }, [watchedTitle, watchedDescription, promptType, form]);

  // Fetch available media generator names
  useEffect(() => {
    fetch("/api/media-generate")
      .then((res) => res.json())
      .then((data) => {
        const providers = new Set<string>();
        if (data.imageModels?.length > 0 || data.videoModels?.length > 0) {
          const allModels = [...(data.imageModels || []), ...(data.videoModels || [])];
          allModels.forEach((model: { providerName: string }) => {
            if (model.providerName) providers.add(model.providerName);
          });
        }
        setAvailableGenerators(Array.from(providers));
      })
      .catch(() => setAvailableGenerators([]));
  }, []);

  // Handler for AI builder state changes
  const handleBuilderStateChange = (newState: {
    title: string;
    description: string;
    content: string;
    type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "SKILL";
    structuredFormat?: "JSON" | "YAML";
    categoryId?: string;
    tagIds: string[];
    isPrivate: boolean;
    requiresMediaUpload: boolean;
    requiredMediaType?: "IMAGE" | "VIDEO" | "DOCUMENT";
    requiredMediaCount?: number;
  }) => {
    const opts = { shouldDirty: true, shouldTouch: true };
    if (newState.title) form.setValue("title", newState.title, opts);
    if (newState.description) form.setValue("description", newState.description, opts);
    if (newState.content) form.setValue("content", newState.content, opts);
    if (newState.type) form.setValue("type", newState.type, opts);
    if (newState.structuredFormat)
      form.setValue("structuredFormat", newState.structuredFormat, opts);
    if (newState.categoryId) form.setValue("categoryId", newState.categoryId, opts);
    if (newState.tagIds?.length) form.setValue("tagIds", newState.tagIds, opts);
    form.setValue("isPrivate", newState.isPrivate, opts);
    form.setValue("requiresMediaUpload", newState.requiresMediaUpload, opts);
    if (newState.requiredMediaType)
      form.setValue("requiredMediaType", newState.requiredMediaType, opts);
    if (newState.requiredMediaCount)
      form.setValue("requiredMediaCount", newState.requiredMediaCount, opts);
  };

  // Current state for AI builder
  const currentBuilderState = {
    title: form.watch("title"),
    description: form.watch("description") || "",
    content: form.watch("content"),
    type: form.watch("type"),
    structuredFormat: form.watch("structuredFormat"),
    categoryId: form.watch("categoryId"),
    tagIds: form.watch("tagIds"),
    isPrivate: form.watch("isPrivate"),
    requiresMediaUpload: form.watch("requiresMediaUpload"),
    requiredMediaType: form.watch("requiredMediaType"),
    requiredMediaCount: form.watch("requiredMediaCount"),
  };

  const getSelectedText = () => {
    // For text prompts using textarea
    const textarea = textareaRef.current;
    if (textarea) {
      return textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    }
    return "";
  };

  const insertVariable = (variable: string) => {
    // For structured prompts using Monaco editor
    if (isStructuredInput && codeEditorRef.current) {
      codeEditorRef.current.insertAtCursor(variable);
      return;
    }

    // For text prompts using textarea
    const textarea = textareaRef.current;
    const currentContent = form.getValues("content");

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = currentContent.slice(0, start) + variable + currentContent.slice(end);
      form.setValue("content", newContent);

      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    } else {
      // Fallback: append to end
      form.setValue("content", currentContent + variable);
    }
  };

  async function onSubmit(data: PromptFormValues) {
    setIsLoading(true);

    try {
      const isEdit = mode === "edit" && promptId;
      const url = isEdit ? `/api/prompts/${promptId}` : "/api/prompts";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          structuredFormat: data.structuredFormat || null, // Explicitly send null to clear
          contributorIds: contributors.map((c) => c.id),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error types
        if (result.error === "rate_limit") {
          toast.error(t("rateLimitError"));
          return;
        }
        if (result.error === "daily_limit") {
          toast.error(t("dailyLimitError"));
          return;
        }
        if (result.error === "duplicate_prompt") {
          toast.error(t("duplicatePromptError"));
          return;
        }
        if (result.error === "content_exists") {
          toast.error(
            t("contentExistsError", {
              title: result.existingPromptTitle,
              author: result.existingPromptAuthor,
            })
          );
          return;
        }
        throw new Error("Failed to save prompt");
      }
      if (isEdit) {
        analyticsPrompt.edit(promptId!);
      } else {
        analyticsPrompt.create(data.type);
      }
      toast.success(isEdit ? t("promptUpdated") : t("promptCreated"));
      router.push(getPromptUrl(result.id || promptId, result.slug));
      router.refresh();
    } catch {
      toast.error(tCommon("somethingWentWrong"));
    } finally {
      setIsLoading(false);
    }
  }

  const toggleTag = (tagId: string) => {
    const current = form.getValues("tagIds");
    if (current.includes(tagId)) {
      form.setValue(
        "tagIds",
        current.filter((id) => id !== tagId)
      );
    } else {
      form.setValue("tagIds", [...current, tagId]);
    }
  };

  const handleAiGenerate = (field: string, label: string) => {
    if (usedAiButtons.has(field) || !builderRef.current) return;
    setUsedAiButtons((prev) => new Set(prev).add(field));
    builderRef.current.sendMessage(`Generate ${label}`);
  };

  const AiGenerateButton = ({ field, label }: { field: string; label: string }) => {
    if (!aiGenerationEnabled) return null;
    const isUsed = usedAiButtons.has(field);
    return (
      <button
        type="button"
        onClick={() => handleAiGenerate(field, label)}
        disabled={isUsed}
        className={`inline-flex h-4 w-4 items-center justify-center rounded transition-colors ${
          isUsed
            ? "text-muted-foreground/30 cursor-not-allowed"
            : "text-primary/60 hover:text-primary hover:bg-primary/10"
        }`}
        title={`Generate ${label}`}
      >
        <Sparkles className="h-3 w-3" />
      </button>
    );
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Header: Page title + Private Switch */}
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-lg font-semibold">{mode === "edit" ? t("edit") : t("create")}</h1>
            <div className="flex items-center gap-3">
              {aiGenerationEnabled && (
                <PromptBuilder
                  ref={builderRef}
                  availableTags={tags}
                  availableCategories={categories}
                  currentState={currentBuilderState}
                  onStateChange={handleBuilderStateChange}
                  modelName={aiModelName}
                  initialPromptRequest={initialPromptRequest}
                />
              )}
              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0 text-sm font-normal">
                      {t("promptPrivate")}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ===== PROMPT WRITING GUIDE LINK ===== */}
          <Link
            href="/how_to_write_effective_prompts"
            target="_blank"
            className="bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors"
          >
            <BookOpen className="text-primary h-4 w-4" />
            <span>{t("learnHowToWritePrompts")}</span>
            <ExternalLink className="ml-auto h-3 w-3" />
          </Link>

          {/* ===== METADATA SECTION ===== */}
          <div className="space-y-4 border-b pb-6">
            {/* Row 1: Title + Category */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="flex items-center gap-1.5">
                      {t("promptTitle")}
                      <AiGenerateButton field="title" label="Title" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t("titlePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-64">
                    <FormLabel className="flex items-center gap-1.5">
                      {t("promptCategory")}
                      <AiGenerateButton field="category" label="Category" />
                    </FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "__none__" ? undefined : value)
                      }
                      value={field.value || "__none__"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("selectCategory")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">{t("noCategory")}</SelectItem>
                        {categories
                          .filter((c) => c.id && !c.parentId)
                          .map((parent) => (
                            <div key={parent.id}>
                              <SelectItem value={parent.id} className="font-medium">
                                {parent.name}
                              </SelectItem>
                              {categories
                                .filter((c) => c.parentId === parent.id)
                                .map((child) => (
                                  <SelectItem
                                    key={child.id}
                                    value={child.id}
                                    className="text-muted-foreground pl-6"
                                  >
                                    ↳ {child.name}
                                  </SelectItem>
                                ))}
                            </div>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    {t("promptDescription")}
                    <AiGenerateButton field="description" label="Description" />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags with Search Autocomplete */}
            <FormField
              control={form.control}
              name="tagIds"
              render={() => {
                const filteredTags = tags.filter(
                  (tag) =>
                    !selectedTags.includes(tag.id) &&
                    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
                );
                const selectedTagObjects = tags.filter((tag) => selectedTags.includes(tag.id));

                return (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      {t("promptTags")}
                      <AiGenerateButton field="tags" label="Tags" />
                    </FormLabel>
                    {/* Selected tags */}
                    {selectedTagObjects.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {selectedTagObjects.map((tag) => (
                          <Badge
                            key={tag.id}
                            style={{ backgroundColor: tag.color, color: "white" }}
                            className="flex items-center gap-1 pr-1"
                          >
                            {tag.name}
                            <button
                              type="button"
                              onClick={() => toggleTag(tag.id)}
                              className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    {/* Search input */}
                    <div className="relative">
                      <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          ref={tagInputRef}
                          type="text"
                          placeholder={t("searchTags")}
                          value={tagSearch}
                          onChange={(e) => {
                            setTagSearch(e.target.value);
                            setTagDropdownOpen(true);
                          }}
                          onFocus={() => setTagDropdownOpen(true)}
                          onBlur={() => setTimeout(() => setTagDropdownOpen(false), 150)}
                          className="pl-9"
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="none"
                          spellCheck={false}
                          data-1p-ignore
                          data-lpignore="true"
                          data-form-type="other"
                        />
                      </div>
                      {/* Dropdown suggestions */}
                      {tagDropdownOpen && filteredTags.length > 0 && (
                        <div className="bg-popover absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border shadow-md">
                          {filteredTags.map((tag) => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => {
                                toggleTag(tag.id);
                                setTagSearch("");
                                tagInputRef.current?.focus();
                              }}
                              className="hover:bg-muted flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
                            >
                              <span
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: tag.color }}
                              />
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      )}
                      {tagDropdownOpen && tagSearch && filteredTags.length === 0 && (
                        <div className="bg-popover text-muted-foreground absolute z-10 mt-1 w-full rounded-md border p-3 text-sm shadow-md">
                          {t("noTagsFound")}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Contributors */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t("promptContributors")}</label>
              <p className="text-muted-foreground text-xs">{t("contributorsDescription")}</p>
              <ContributorSearch
                selectedUsers={contributors}
                onSelect={(user) => setContributors((prev) => [...prev, user])}
                onRemove={(userId) =>
                  setContributors((prev) => prev.filter((u) => u.id !== userId))
                }
              />
            </div>

            {/* Advanced Section */}
            <div className="rounded-lg border">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="hover:bg-muted/50 flex w-full items-center justify-between p-3 text-left text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Settings2 className="text-muted-foreground h-4 w-4" />
                  {t("advancedOptions")}
                  {(bestWithModels.length > 0 || bestWithMCP.length > 0) && (
                    <Badge variant="secondary" className="h-5 text-[10px]">
                      {bestWithModels.length + bestWithMCP.length}
                    </Badge>
                  )}
                </span>
                <ChevronDown
                  className={`text-muted-foreground h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                />
              </button>
              {showAdvanced && (
                <div className="space-y-4 border-t p-3">
                  {/* Works Best With Models */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">{t("worksBestWithModels")}</label>
                    <p className="text-muted-foreground text-xs">
                      {t("worksBestWithModelsDescription")}
                    </p>
                    {bestWithModels.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {bestWithModels.map((slug) => {
                          const model = AI_MODELS[slug as keyof typeof AI_MODELS];
                          return (
                            <Badge
                              key={slug}
                              variant="secondary"
                              className="flex items-center gap-1 pr-1"
                            >
                              {model?.name || slug}
                              <button
                                type="button"
                                onClick={() =>
                                  form.setValue(
                                    "bestWithModels",
                                    bestWithModels.filter((s) => s !== slug)
                                  )
                                }
                                className="hover:bg-muted ml-1 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                    {bestWithModels.length < 3 && (
                      <Select
                        value=""
                        onValueChange={(slug) => {
                          if (slug && !bestWithModels.includes(slug)) {
                            form.setValue("bestWithModels", [...bestWithModels, slug]);
                          }
                        }}
                      >
                        <SelectTrigger className="h-8 w-full text-xs sm:w-64">
                          <SelectValue placeholder={t("selectModel")} />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(modelsByProvider).map(([provider, models]) => (
                            <div key={provider}>
                              <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
                                {provider}
                              </div>
                              {models
                                .filter((m) => !bestWithModels.includes(m.slug))
                                .map((model) => (
                                  <SelectItem key={model.slug} value={model.slug}>
                                    {model.name}
                                  </SelectItem>
                                ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Works Best With MCP */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">{t("worksBestWithMCP")}</label>
                    <p className="text-muted-foreground text-xs">
                      {t("worksBestWithMCPDescription")}
                    </p>
                    {bestWithMCP.length > 0 && (
                      <div className="space-y-1.5">
                        {bestWithMCP.map((mcp, index) => (
                          <div
                            key={index}
                            className="bg-muted/30 flex items-center gap-2 rounded border p-2 text-xs"
                          >
                            <code className="flex-1 break-all">{mcp.command}</code>
                            {mcp.tools && mcp.tools.length > 0 && (
                              <span className="text-muted-foreground">
                                ({mcp.tools.join(", ")})
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                form.setValue(
                                  "bestWithMCP",
                                  bestWithMCP.filter((_, i) => i !== index)
                                )
                              }
                              className="hover:bg-muted rounded p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        placeholder={t("mcpCommandPlaceholder")}
                        value={newMcpCommand}
                        onChange={(e) => setNewMcpCommand(e.target.value)}
                        className="h-8 flex-1 text-xs"
                      />
                      <Input
                        placeholder={t("mcpToolsPlaceholder")}
                        value={newMcpTools}
                        onChange={(e) => setNewMcpTools(e.target.value)}
                        className="h-8 w-28 text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        disabled={!newMcpCommand.trim()}
                        onClick={() => {
                          if (newMcpCommand.trim()) {
                            const tools = newMcpTools.trim()
                              ? newMcpTools
                                  .split(",")
                                  .map((t) => t.trim())
                                  .filter(Boolean)
                              : undefined;
                            form.setValue("bestWithMCP", [
                              ...bestWithMCP,
                              { command: newMcpCommand.trim(), tools },
                            ]);
                            setNewMcpCommand("");
                            setNewMcpTools("");
                          }
                        }}
                      >
                        {t("add")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== INPUT SECTION ===== */}
          <div className="space-y-4 py-6">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">{t("inputType")}</h2>
            </div>

            {/* Input Type & Format selectors */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Select
                  value={
                    promptType === "SKILL" ? "SKILL" : isStructuredInput ? "STRUCTURED" : "TEXT"
                  }
                  onValueChange={(v) => {
                    if (v === "STRUCTURED") {
                      form.setValue("structuredFormat", "JSON");
                      form.setValue("type", "TEXT");
                    } else if (v === "SKILL") {
                      form.setValue("structuredFormat", undefined);
                      form.setValue("type", "SKILL");
                      // Auto-generate frontmatter from title and description
                      const currentContent = form.getValues("content");
                      const title = form.getValues("title");
                      const description = form.getValues("description") || "";
                      // Only generate if content is empty or doesn't look like skill content
                      if (!currentContent || !currentContent.startsWith("---")) {
                        form.setValue(
                          "content",
                          generateSkillContentWithFrontmatter(title, description)
                        );
                      }
                    } else {
                      form.setValue("structuredFormat", undefined);
                      form.setValue("type", "TEXT");
                    }
                  }}
                >
                  <SelectTrigger className="h-9 w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">{t("inputTypes.text")}</SelectItem>
                    <SelectItem value="STRUCTURED">{t("inputTypes.structured")}</SelectItem>
                    <SelectItem value="SKILL">{t("inputTypes.skill")}</SelectItem>
                  </SelectContent>
                </Select>
                {isStructuredInput && (
                  <Select
                    value={structuredFormat || "JSON"}
                    onValueChange={(v) => form.setValue("structuredFormat", v as any)}
                  >
                    <SelectTrigger className="h-9 w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JSON">JSON</SelectItem>
                      <SelectItem value="YAML">YAML</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              {/* Media upload toggle */}
              <div className="flex items-center gap-2 sm:ml-auto">
                <Switch
                  id="media-upload"
                  checked={requiresMediaUpload}
                  onCheckedChange={(v) => form.setValue("requiresMediaUpload", v)}
                />
                <label htmlFor="media-upload" className="cursor-pointer text-sm">
                  {t("requiresMediaUpload")}
                </label>
              </div>
            </div>

            {/* Media type & count - grouped buttons */}
            {requiresMediaUpload && (
              <div className="bg-muted/30 flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center">
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  <Paperclip className="h-4 w-4" />
                  <span>{t("attachedMediaType")}:</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex divide-x rounded-md border">
                    {(["IMAGE", "VIDEO", "DOCUMENT"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => form.setValue("requiredMediaType", type)}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors first:rounded-l-md last:rounded-r-md ${
                          form.watch("requiredMediaType") === type
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-muted"
                        }`}
                      >
                        {t(`types.${type.toLowerCase()}`)}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground text-xs">×</span>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={form.watch("requiredMediaCount")}
                      onChange={(e) =>
                        form.setValue("requiredMediaCount", parseInt(e.target.value) || 1)
                      }
                      className="h-7 w-16 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Prompt Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {promptType === "SKILL" ? (
                      <SkillEditor value={field.value} onChange={field.onChange} />
                    ) : isStructuredInput ? (
                      <div className="overflow-hidden rounded-md border">
                        <VariableToolbar
                          onInsert={insertVariable}
                          getSelectedText={getSelectedText}
                        />
                        <CodeEditor
                          ref={codeEditorRef}
                          value={field.value}
                          onChange={field.onChange}
                          language={(structuredFormat?.toLowerCase() as "json" | "yaml") || "json"}
                          placeholder={
                            structuredFormat === "JSON"
                              ? '{\n  "name": "My Workflow",\n  "steps": []\n}'
                              : 'name: My Workflow\nsteps:\n  - step: first\n    prompt: "..."'
                          }
                          minHeight="250px"
                          className="rounded-none border-0"
                        />
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-md border">
                        <VariableToolbar
                          onInsert={insertVariable}
                          getSelectedText={getSelectedText}
                        />
                        <Textarea
                          ref={(el) => {
                            textareaRef.current = el;
                            if (typeof field.ref === "function") field.ref(el);
                          }}
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder={t("contentPlaceholder")}
                          className="min-h-[150px] rounded-none border-0 font-mono focus-visible:ring-0"
                        />
                      </div>
                    )}
                  </FormControl>
                  <VariableHint
                    content={field.value}
                    onContentChange={(newContent) => form.setValue("content", newContent)}
                  />
                  {/* Show error with generate frontmatter link for SKILL type */}
                  {promptType === "SKILL" && form.formState.errors.content ? (
                    <p className="text-destructive flex items-center gap-2 text-sm font-medium">
                      <span>{form.formState.errors.content.message}</span>
                      <button
                        type="button"
                        className="text-primary inline-flex items-center gap-1 hover:underline"
                        onClick={() => {
                          const title = form.getValues("title");
                          const description = form.getValues("description") || "";
                          const currentContent = form.getValues("content");
                          const updatedContent = updateSkillFrontmatter(
                            currentContent,
                            title,
                            description
                          );
                          form.setValue("content", updatedContent, { shouldValidate: true });
                        }}
                      >
                        <Sparkles className="h-3 w-3" />
                        {t("generateFrontmatter")}
                      </button>
                    </p>
                  ) : (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />

            {/* Variable detection warning */}
            <VariableWarning
              content={promptContent}
              onConvert={(converted) => form.setValue("content", converted)}
            />

            {/* Structured format detection warning - hide for SKILL type */}
            {promptType !== "SKILL" && (
              <StructuredFormatWarning
                content={promptContent}
                isStructuredInput={isStructuredInput}
                onSwitchToStructured={(format) => {
                  form.setValue("structuredFormat", format);
                  form.setValue("type", "TEXT");
                }}
              />
            )}
          </div>

          {/* ===== LLM PROCESSING ARROW ===== */}
          <div className="flex flex-col items-center py-4">
            <div className="text-muted-foreground flex items-center gap-2">
              <div className="bg-border h-px w-16" />
              <div className="bg-muted flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium">
                <ArrowDown className="h-3.5 w-3.5" />
                <span>{t("afterAiProcessing")}</span>
              </div>
              <div className="bg-border h-px w-16" />
            </div>
          </div>

          {/* ===== OUTPUT SECTION ===== */}
          {promptType === "SKILL" ? (
            /* SKILL type shows a code output preview - code generated BY the skill */
            <div className="space-y-4 border-t py-6">
              <div className="space-y-1">
                <h2 className="text-base font-semibold">{t("outputType")}</h2>
                <p className="text-muted-foreground text-sm">{t("outputTypeSkillNote")}</p>
              </div>

              {/* Code output preview - what the agent generates */}
              <div className="overflow-hidden rounded-lg border bg-[#1e1e1e]">
                {/* Editor title bar */}
                <div className="flex items-center gap-2 border-b border-[#3d3d3d] bg-[#2d2d2d] px-3 py-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="ml-2 font-mono text-xs text-[#808080]">generated-code.ts</span>
                </div>
                {/* Code output content */}
                <div
                  className="space-y-1 p-4 text-xs"
                  style={{
                    fontFamily:
                      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                  }}
                >
                  <div>
                    <span className="text-[#6a9955]">// Code generated by skill...</span>
                  </div>
                  <div>
                    <span className="text-[#c586c0]">export</span>{" "}
                    <span className="text-[#569cd6]">function</span>{" "}
                    <span className="text-[#dcdcaa]">handler</span>
                    <span className="text-[#d4d4d4]">()</span>{" "}
                    <span className="text-[#d4d4d4]">{"{"}</span>
                  </div>
                  <div>
                    <span className="text-[#d4d4d4]"> </span>
                    <span className="text-[#c586c0]">return</span>{" "}
                    <span className="text-[#ce9178]">&quot;...&quot;</span>
                    <span className="text-[#d4d4d4]">;</span>
                  </div>
                  <div>
                    <span className="text-[#d4d4d4]">{"}"}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 border-t py-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold">{t("outputType")}</h2>
                  {availableGenerators.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
                        >
                          <Sparkles className="h-3 w-3" />
                          {t("generateWith")}
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => form.setValue("type", "IMAGE")}>
                          <ImageIcon className="mr-2 h-4 w-4" />
                          {t("generateImage")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => form.setValue("type", "VIDEO")}>
                          <Video className="mr-2 h-4 w-4" />
                          {t("generateVideo")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => form.setValue("type", "AUDIO")}>
                          <Volume2 className="mr-2 h-4 w-4" />
                          {t("generateAudio")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{t("outputTypeDescription")}</p>
              </div>

              {/* Output Type selector as grouped buttons */}
              <div className="grid grid-cols-2 rounded-md border sm:inline-flex sm:divide-x">
                {(["TEXT", "IMAGE", "VIDEO", "AUDIO"] as const).map((type, index) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => form.setValue("type", type)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                      index === 0 ? "rounded-tl-md sm:rounded-l-md sm:rounded-tr-none" : ""
                    } ${
                      index === 1 ? "rounded-tr-md border-l sm:rounded-none sm:border-l-0" : ""
                    } ${
                      index === 2 ? "rounded-bl-md border-t sm:rounded-none sm:border-t-0" : ""
                    } ${
                      index === 3
                        ? "rounded-br-md border-t border-l sm:rounded-r-md sm:rounded-bl-none sm:border-t-0 sm:border-l-0"
                        : ""
                    } ${
                      promptType === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    }`}
                  >
                    {type === "TEXT" && <span className="text-xs">Aa</span>}
                    {type === "IMAGE" && <ImageIcon className="h-4 w-4" />}
                    {type === "VIDEO" && <Video className="h-4 w-4" />}
                    {type === "AUDIO" && <Volume2 className="h-4 w-4" />}
                    {t(`outputTypes.${type.toLowerCase()}`)}
                  </button>
                ))}
              </div>

              {/* Output Preview based on type */}
              <div className="bg-muted/20 rounded-lg border p-4">
                {promptType === "TEXT" && (
                  <div className="text-muted-foreground/50 text-sm italic">
                    {t("outputPreview.text")}
                  </div>
                )}
                {promptType === "IMAGE" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <ImageIcon className="h-4 w-4" />
                      <span>{t("outputPreview.imageUpload")}</span>
                    </div>
                    <MediaField form={form} t={t} promptContent={promptContent} />
                  </div>
                )}
                {promptType === "VIDEO" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Video className="h-4 w-4" />
                      <span>{t("outputPreview.videoUpload")}</span>
                    </div>
                    <MediaField
                      form={form}
                      t={t}
                      promptType={promptType}
                      promptContent={promptContent}
                    />
                  </div>
                )}
                {promptType === "AUDIO" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Volume2 className="h-4 w-4" />
                      <span>{t("outputPreview.audioUpload")}</span>
                    </div>
                    <MediaField
                      form={form}
                      t={t}
                      promptType={promptType}
                      promptContent={promptContent}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "edit" ? t("update") : t("createButton")} Prompt
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
