"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Edit, Play, Code, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiConfigForm } from "./api-config-form";
import { ApiTester } from "./api-tester";
import { cn } from "@/lib/utils";

export interface ApiConfig {
  id: string;
  name: string;
  description?: string;
  baseUrl: string;
  method: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  bodySchema?: any;
  responseSchema?: any;
  authentication?: any;
  testEndpoint?: string;
  documentation?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiConfigManagerProps {
  promptId: string;
  isOwner: boolean;
}

export function ApiConfigManager({ promptId, isOwner }: ApiConfigManagerProps) {
  const t = useTranslations("skills");
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<ApiConfig | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTester, setShowTester] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ApiConfig | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, [promptId]);

  const fetchConfigs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/prompts/${promptId}/api-config`);
      if (response.ok) {
        const data = await response.json();
        setConfigs(data);
      }
    } catch (error) {
      console.error("[v0] Error fetching API configs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (configId: string) => {
    if (!confirm("Are you sure you want to delete this API configuration?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/prompts/${promptId}/api-config/${configId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setConfigs((prev) => prev.filter((c) => c.id !== configId));
      }
    } catch (error) {
      console.error("[v0] Error deleting API config:", error);
    }
  };

  const handleSave = async (data: Partial<ApiConfig>) => {
    try {
      const url = editingConfig
        ? `/api/prompts/${promptId}/api-config/${editingConfig.id}`
        : `/api/prompts/${promptId}/api-config`;

      const method = editingConfig ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchConfigs();
        setShowForm(false);
        setEditingConfig(null);
      }
    } catch (error) {
      console.error("[v0] Error saving API config:", error);
    }
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      POST: "bg-green-500/10 text-green-500 border-green-500/20",
      PUT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      DELETE: "bg-red-500/10 text-red-500 border-red-500/20",
      PATCH: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };
    return colors[method] || "bg-muted text-muted-foreground";
  };

  if (showForm) {
    return (
      <ApiConfigForm
        initialData={editingConfig || undefined}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingConfig(null);
        }}
      />
    );
  }

  if (showTester && selectedConfig) {
    return (
      <ApiTester
        promptId={promptId}
        config={selectedConfig}
        onClose={() => {
          setShowTester(false);
          setSelectedConfig(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">API Integrations</h3>
          <p className="text-sm text-muted-foreground">
            Manage API endpoints and configurations for this skill
          </p>
        </div>
        {isOwner && (
          <Button
            onClick={() => setShowForm(true)}
            size="sm"
            className="h-8 transition-all duration-180"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add API
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      ) : configs.length === 0 ? (
        <Card className="p-8 text-center border-dashed transition-colors duration-180">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Code className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No API configurations yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first API integration to get started
              </p>
            </div>
            {isOwner && (
              <Button
                onClick={() => setShowForm(true)}
                size="sm"
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add API Configuration
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {configs.map((config) => (
            <Card
              key={config.id}
              className={cn(
                "p-4 transition-all duration-180 hover:border-primary/50",
                "touch-manipulation"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-mono text-xs",
                        getMethodColor(config.method)
                      )}
                    >
                      {config.method}
                    </Badge>
                    <h4 className="font-medium truncate">{config.name}</h4>
                  </div>
                  {config.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {config.description}
                    </p>
                  )}
                  <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                    {config.baseUrl}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedConfig(config);
                    setShowTester(true);
                  }}
                  className="h-8 flex-1 transition-all duration-120"
                >
                  <Play className="h-3.5 w-3.5 mr-1" />
                  Test
                </Button>
                {config.documentation && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(config.documentation, "_blank")}
                    className="h-8 transition-all duration-120"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                  </Button>
                )}
                {isOwner && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingConfig(config);
                        setShowForm(true);
                      }}
                      className="h-8 transition-all duration-120"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(config.id)}
                      className="h-8 text-destructive hover:bg-destructive/10 transition-all duration-120"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
