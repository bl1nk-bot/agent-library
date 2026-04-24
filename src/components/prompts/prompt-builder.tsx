"use client";

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowUp, Loader2, Sparkles, X, ChevronRight, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MiniPromptCard } from "./mini-prompt-card";
import { cn } from "@/lib/utils";

interface PromptBuilderState {
  title: string;
  description: string;
  content: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "SKILL"; // Output type or SKILL
  structuredFormat?: "JSON" | "YAML"; // Input type indicator
  categoryId?: string;
  tagIds: string[];
  isPrivate: boolean;
  requiresMediaUpload: boolean;
  requiredMediaType?: "IMAGE" | "VIDEO" | "DOCUMENT";
  requiredMediaCount?: number;
}

interface ToolCall {
  id: string;
  name: string;
  arguments: string;
  result: {
    success: boolean;
    data?: unknown;
    error?: string;
  };
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  toolCalls?: ToolCall[];
  searchResults?: Array<{
    id: string;
    title: string;
    contentPreview: string;
    type: string;
    tags: string[];
  }>;
}

interface PromptBuilderProps {
  availableTags: Array<{ id: string; name: string; slug: string; color: string }>;
  availableCategories: Array<{ id: string; name: string; slug: string; parentId: string | null }>;
  currentState: PromptBuilderState;
  onStateChange: (state: PromptBuilderState) => void;
  modelName?: string;
  initialPromptRequest?: string;
}

export interface PromptBuilderHandle {
  sendMessage: (content: string) => void;
  open: () => void;
}

export const PromptBuilder = forwardRef<PromptBuilderHandle, PromptBuilderProps>(
  function PromptBuilder(
    {
      availableTags,
      availableCategories,
      currentState,
      onStateChange,
      modelName = "gpt-4o-mini",
      initialPromptRequest,
    },
    ref
  ) {
    const t = useTranslations("promptBuilder");
    // Default to closed on mobile (< 768px)
    const [isOpen, setIsOpen] = useState(() => {
      if (typeof window === "undefined") return true;
      return window.innerWidth >= 768;
    });
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [streamingContent, setStreamingContent] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages, streamingContent]);

    // Expose sendMessage and open to parent via ref
    useImperativeHandle(ref, () => ({
      sendMessage: (content: string) => {
        setIsOpen(true);
        setTimeout(() => sendMessageWithContent(content), 100);
      },
      open: () => setIsOpen(true),
    }));

    // Auto-send initial prompt request if provided
    const initialRequestSentRef = useRef(false);
    useEffect(() => {
      if (initialPromptRequest && !initialRequestSentRef.current && !isLoading) {
        initialRequestSentRef.current = true;
        setInput(initialPromptRequest);
        // Clear the URL querystring so refresh won't re-run the prompt
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.delete("prompt");
          window.history.replaceState({}, "", url.pathname);
        }
        // Use setTimeout to ensure the input is set before sending
        setTimeout(() => {
          sendMessageWithContent(initialPromptRequest);
        }, 100);
      }
    }, [initialPromptRequest]);

    const sendMessageWithContent = async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setStreamingContent("");

      // Add a placeholder for streaming
      const assistantMessageId = crypto.randomUUID();

      try {
        const response = await fetch("/api/prompt-builder/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            currentState,
            availableTags,
            availableCategories,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        let fullContent = "";
        const toolCalls: ToolCall[] = [];
        const searchResults: Message["searchResults"] = [];
        let newState: PromptBuilderState | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);

                if (parsed.type === "text") {
                  fullContent += parsed.content;
                  setStreamingContent(fullContent);
                } else if (parsed.type === "tool_call") {
                  toolCalls.push(parsed.toolCall);
                  // Extract search results
                  if (
                    parsed.toolCall.name === "search_prompts" &&
                    parsed.toolCall.result?.success &&
                    parsed.toolCall.result?.data?.prompts
                  ) {
                    searchResults.push(...parsed.toolCall.result.data.prompts);
                  }
                } else if (parsed.type === "state") {
                  newState = parsed.state;
                } else if (parsed.type === "done") {
                  // Finalize the message
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: assistantMessageId,
                      role: "assistant",
                      content: fullContent,
                      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
                      searchResults: searchResults.length > 0 ? searchResults : undefined,
                    },
                  ]);
                  setStreamingContent("");

                  if (newState) {
                    onStateChange(newState);
                  }
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        setStreamingContent("");
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: t("errorMessage"),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    const sendMessage = async () => {
      if (!input.trim() || isLoading) return;
      await sendMessageWithContent(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    const getToolCallDisplay = (toolCall: ToolCall) => {
      const isSuccess = toolCall.result?.success;
      const data = toolCall.result?.data as Record<string, unknown> | undefined;

      // Build detailed description based on tool type
      let detail = "";
      switch (toolCall.name) {
        case "set_title":
          detail = `Title → "${(data?.title as string)?.substring(0, 30)}${(data?.title as string)?.length > 30 ? "..." : ""}"`;
          break;
        case "set_description":
          detail = `Description → "${(data?.description as string)?.substring(0, 25)}..."`;
          break;
        case "set_content":
          detail = `Content set (${(data?.content as string)?.length || 0} chars)`;
          break;
        case "set_type":
          detail = `Type → ${data?.type}${data?.structuredFormat ? ` (${data.structuredFormat})` : ""}`;
          break;
        case "set_tags":
          const tags = data?.appliedTags as string[] | undefined;
          detail = tags?.length ? `Tags → ${tags.join(", ")}` : "No matching tags";
          break;
        case "set_category":
          detail = `Category → ${data?.category || "not found"}`;
          break;
        case "set_privacy":
          detail = data?.isPrivate ? "Set to Private" : "Set to Public";
          break;
        case "set_media_requirements":
          detail = data?.requiresMediaUpload
            ? `Requires ${data.mediaCount || 1} ${data.mediaType || "file"}(s)`
            : "No media required";
          break;
        case "search_prompts":
          const count = (data?.prompts as unknown[])?.length || 0;
          detail = `Found ${count} example${count !== 1 ? "s" : ""}`;
          break;
        case "get_available_tags":
          detail = `${(data?.tags as unknown[])?.length || 0} tags available`;
          break;
        case "get_available_categories":
          detail = `${(data?.categories as unknown[])?.length || 0} categories`;
          break;
        case "get_current_state":
          detail = "Retrieved current state";
          break;
        default:
          detail = toolCall.name.replace(/_/g, " ");
      }

      const toolLabel = toolCall.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      return (
        <div
          key={toolCall.id}
          className={cn(
            "rounded border px-2 py-1.5 text-[11px]",
            isSuccess
              ? "border-green-500/20 bg-green-500/5 text-green-700 dark:text-green-400"
              : "border-red-500/20 bg-red-500/5 text-red-700 dark:text-red-400"
          )}
        >
          <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
            <span className="flex-shrink-0 opacity-60">{isSuccess ? "✓" : "✗"}</span>
            <span className="flex-shrink-0 font-medium">{toolLabel}:</span>
            <span className="truncate opacity-80">{detail}</span>
          </div>
        </div>
      );
    };

    if (!isOpen) {
      return (
        <>
          {/* Desktop: inline button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="hidden h-7 gap-1.5 px-2 text-xs sm:inline-flex"
          >
            <Bot className="h-3 w-3" />
            {t("openBuilder")}
          </Button>
          {/* Mobile: floating button */}
          <Button
            variant="default"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="fixed right-4 bottom-4 z-50 h-12 w-12 rounded-full shadow-lg sm:hidden"
          >
            <Bot className="h-5 w-5" />
          </Button>
        </>
      );
    }

    return (
      <>
        {/* Mobile: backdrop overlay */}
        <div
          className="animate-in fade-in fixed inset-0 z-40 bg-black/50 duration-200 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
        {/* Desktop: side panel, Mobile: bottom drawer */}
        <div className="bg-background animate-in slide-in-from-bottom fixed inset-x-0 bottom-0 z-50 flex h-[70vh] flex-col rounded-t-xl border-t shadow-lg duration-300 sm:top-12 sm:right-0 sm:bottom-auto sm:left-auto sm:h-[calc(100vh-3rem)] sm:w-[400px] sm:animate-none sm:rounded-none sm:border-l">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-3 py-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="text-primary h-3 w-3" />
              <span className="text-xs font-medium">{t("title")}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Messages */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 && !streamingContent && (
              <div className="text-muted-foreground py-8 text-center text-sm">
                <Sparkles className="mx-auto mb-3 h-8 w-8 opacity-50" />
                <p className="mb-1 font-medium">{t("welcomeTitle")}</p>
                <p className="text-xs">{t("welcomeDescription")}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-muted-foreground text-xs">{t("tryAsking")}</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {/* Show edit mode actions if there's existing content */}
                    {currentState.content ? (
                      <>
                        {[
                          t("editAction1"),
                          t("editAction2"),
                          t("editAction3"),
                          t("editAction4"),
                        ].map((action, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => {
                              setInput(action);
                              inputRef.current?.focus();
                            }}
                            className="bg-muted hover:bg-muted/80 rounded-full px-2 py-1 text-xs transition-colors"
                          >
                            {action}
                          </button>
                        ))}
                      </>
                    ) : (
                      <>
                        {[t("example1"), t("example2"), t("example3")].map((example, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => {
                              setInput(example);
                              inputRef.current?.focus();
                            }}
                            className="bg-muted hover:bg-muted/80 rounded-full px-2 py-1 text-xs transition-colors"
                          >
                            {example}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("text-sm", message.role === "user" ? "ml-8" : "mr-4")}
                >
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    )}
                  >
                    {message.role === "user" ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="text-sm">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => (
                              <ul className="mb-2 ml-4 list-inside list-disc">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mb-2 ml-4 list-inside list-decimal">{children}</ol>
                            ),
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            code: ({ className, children, ...props }) => {
                              const isBlock =
                                className?.includes("language-") || String(children).includes("\n");
                              if (isBlock) {
                                return (
                                  <pre className="bg-background/80 my-2 overflow-x-auto rounded-md border p-3">
                                    <code className="text-xs">{children}</code>
                                  </pre>
                                );
                              }
                              return (
                                <code
                                  className="bg-background/80 rounded px-1.5 py-0.5 font-mono text-xs"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                            pre: ({ children }) => <>{children}</>,
                            strong: ({ children }) => (
                              <strong className="font-bold">{children}</strong>
                            ),
                            em: ({ children }) => <em className="italic">{children}</em>,
                            h1: ({ children }) => (
                              <h1 className="mt-3 mb-2 text-lg font-bold">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="mt-3 mb-2 text-base font-bold">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="mt-2 mb-1 text-sm font-bold">{children}</h3>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-muted-foreground/50 my-2 border-l-2 pl-3 italic">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Tool calls indicator */}
                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <div className="mt-2 flex flex-col gap-2">
                      {message.toolCalls.map((tc) => getToolCallDisplay(tc))}
                    </div>
                  )}

                  {/* Search results */}
                  {message.searchResults && message.searchResults.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      <span className="text-muted-foreground text-[10px]">
                        {t("foundExamples", { count: message.searchResults.length })}
                      </span>
                      {message.searchResults.map((prompt) => (
                        <MiniPromptCard key={prompt.id} prompt={prompt} />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming message */}
              {streamingContent && (
                <div className="mr-4 text-sm">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <p className="whitespace-pre-wrap">{streamingContent}</p>
                    <span className="bg-foreground/50 ml-0.5 inline-block h-4 w-2 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Loading indicator (when waiting for stream to start) */}
              {isLoading && !streamingContent && (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("thinking")}</span>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Current state summary */}
          {(currentState.title || currentState.content) && (
            <div className="bg-muted/30 border-t px-4 py-2">
              <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
                <span className="font-medium">{t("currentPrompt")}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {currentState.title && (
                  <Badge variant="secondary" className="text-[10px]">
                    {t("stateTitle")}: {currentState.title.substring(0, 20)}
                    {currentState.title.length > 20 ? "..." : ""}
                  </Badge>
                )}
                {currentState.content && (
                  <Badge variant="secondary" className="text-[10px]">
                    {t("stateContent")}: {currentState.content.length} chars
                  </Badge>
                )}
                {currentState.tagIds.length > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {currentState.tagIds.length} {t("stateTags")}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-2">
            <div className="bg-muted/50 rounded-lg border px-2.5 py-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("inputPlaceholder")}
                className="max-h-[80px] min-h-[32px] resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />
              <div className="mt-1.5 flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                  <Bot className="h-2.5 w-2.5" />
                  <span>{modelName}</span>
                </div>
                <Button
                  size="icon"
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="h-9 w-9 rounded-full sm:h-6 sm:w-6"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin sm:h-3 sm:w-3" />
                  ) : (
                    <ArrowUp className="h-4 w-4 sm:h-3 sm:w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);
