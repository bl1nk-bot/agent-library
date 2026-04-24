"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Copy, Check, Trash2, HardDrive } from "lucide-react";
import { toast } from "sonner";
import { RunPromptButton } from "@/components/prompts/run-prompt-button";
import { ScrollArea } from "@/components/ui/scroll-area";

const OUTPUT_TYPES = [
  { value: "text", label: "Text" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "sound", label: "Sound" },
] as const;

const OUTPUT_FORMATS = [
  { value: "text", label: "Text" },
  { value: "structured_json", label: "JSON" },
  { value: "structured_yaml", label: "YAML" },
] as const;

type OutputType = (typeof OUTPUT_TYPES)[number]["value"];
type OutputFormat = (typeof OUTPUT_FORMATS)[number]["value"];

interface EnhanceResponse {
  original: string;
  improved: string;
  outputType: OutputType;
  outputFormat: OutputFormat;
  inspirations: Array<{ id: string; slug: string | null; title: string; similarity: number }>;
  model: string;
}

interface SavedPrompt {
  id: string;
  input: string;
  output: string;
  outputType: OutputType;
  outputFormat: OutputFormat;
  createdAt: number;
}

const STORAGE_KEY = "promptEnhancerHistory";
const MAX_HISTORY = 50;

function loadHistory(): SavedPrompt[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: SavedPrompt[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export function PromptEnhancer() {
  const t = useTranslations("developers");
  const { theme } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [outputType, setOutputType] = useState<OutputType>("text");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("text");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EnhanceResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<SavedPrompt[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Determine language for Monaco based on output format
  const getEditorLanguage = () => {
    if (outputFormat === "structured_json") return "json";
    if (outputFormat === "structured_yaml") return "yaml";
    return "markdown";
  };

  const addToHistory = (input: string, output: string, type: OutputType, format: OutputFormat) => {
    const newItem: SavedPrompt = {
      id: Date.now().toString(),
      input,
      output,
      outputType: type,
      outputFormat: format,
      createdAt: Date.now(),
    };
    const newHistory = [newItem, ...history].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    saveHistory(newHistory);
    setSelectedId(newItem.id);
  };

  const deleteFromHistory = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id);
    setHistory(newHistory);
    saveHistory(newHistory);
    if (selectedId === id) {
      setSelectedId(null);
      setResult(null);
      setPrompt("");
    }
  };

  const loadFromHistory = (item: SavedPrompt) => {
    setPrompt(item.input);
    setOutputType(item.outputType);
    setOutputFormat(item.outputFormat);
    setResult({
      original: item.input,
      improved: item.output,
      outputType: item.outputType,
      outputFormat: item.outputFormat,
      inspirations: [],
      model: "",
    });
    setSelectedId(item.id);
  };

  const handleEnhance = async () => {
    if (!prompt.trim()) {
      toast.error(t("enterPrompt"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/improve-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), outputType, outputFormat }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("enhanceFailed"));
      }

      setResult(data);
      addToHistory(prompt.trim(), data.improved, outputType, outputFormat);
      toast.success(t("enhanceSuccess"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("enhanceFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.improved) {
      await navigator.clipboard.writeText(result.improved);
      setCopied(true);
      toast.success(t("copied"));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* History Sidebar */}
      <div className="bg-muted/20 flex h-full w-64 shrink-0 flex-col border-r">
        <div className="border-b p-3">
          <h3 className="text-sm font-medium">{t("history")}</h3>
          <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            <HardDrive className="h-3 w-3" />
            {t("storedOnDevice")}
          </p>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {history.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-xs">{t("noHistory")}</p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className={`group hover:bg-muted relative cursor-pointer overflow-hidden rounded-md p-2 text-xs transition-colors ${
                    selectedId === item.id ? "bg-muted" : ""
                  }`}
                  onClick={() => loadFromHistory(item)}
                >
                  <p className="truncate pr-6 font-medium">{item.input.slice(0, 30)}</p>
                  <p className="text-muted-foreground mt-0.5 truncate">
                    → {item.output.slice(0, 25)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFromHistory(item.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Left Panel - Input */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden border-r">
        <div className="bg-muted/30 flex h-10 shrink-0 items-center justify-between border-b px-4">
          <span className="text-muted-foreground text-sm font-medium">{t("inputPrompt")}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <label className="text-muted-foreground text-xs">{t("outputType")}:</label>
              <Select value={outputType} onValueChange={(v) => setOutputType(v as OutputType)}>
                <SelectTrigger className="!h-6 w-[72px] px-1.5 !py-0 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OUTPUT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-xs">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <label className="text-muted-foreground text-xs">{t("outputFormat")}:</label>
              <Select
                value={outputFormat}
                onValueChange={(v) => setOutputFormat(v as OutputFormat)}
              >
                <SelectTrigger className="!h-6 w-[64px] px-1.5 !py-0 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OUTPUT_FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value} className="text-xs">
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <Textarea
            placeholder={t("inputPlaceholder")}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-0 flex-1 resize-none rounded-none border-0 font-mono text-sm"
          />
        </div>

        <div className="bg-background flex h-10 shrink-0 items-center justify-between border-t px-4">
          <div className="text-muted-foreground text-xs">
            {prompt.length.toLocaleString()} / 10,000
          </div>
          <Button
            onClick={handleEnhance}
            disabled={isLoading || !prompt.trim()}
            size="sm"
            className="h-7 gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t("enhancing")}
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                {t("enhance")}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Right Panel - Output */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <div className="bg-muted/30 flex h-10 shrink-0 items-center justify-between border-b px-4">
          <span className="text-muted-foreground text-sm font-medium">{t("enhancedPrompt")}</span>
          {result && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">{result.model}</span>
              <Button variant="ghost" size="icon" onClick={handleCopy} className="h-6 w-6">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
              <RunPromptButton
                content={result.improved}
                size="sm"
                variant="default"
                className="h-7 bg-green-600 text-white hover:bg-green-700"
              />
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          {result ? (
            <Editor
              height="100%"
              language={getEditorLanguage()}
              value={result.improved}
              theme={theme === "dark" ? "vs-dark" : "light"}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: "on",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 8, bottom: 8 },
                folding: true,
                renderLineHighlight: "none",
              }}
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
              {t("enhanceToSeeResult")}
            </div>
          )}
        </div>

        {result && result.inspirations.length > 0 && (
          <div className="space-y-2 border-t p-4 pt-2">
            <p className="text-muted-foreground text-xs font-medium">{t("inspiredBy")}:</p>
            <div className="flex flex-wrap gap-1.5">
              {result.inspirations.map((ins) => {
                const promptPath = `/prompts/${ins.id}${ins.slug ? `_${ins.slug}` : ""}`;
                return (
                  <a
                    key={ins.id}
                    href={promptPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 hover:bg-primary/20 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors"
                  >
                    {ins.title}
                    <span className="text-muted-foreground">{ins.similarity}%</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
