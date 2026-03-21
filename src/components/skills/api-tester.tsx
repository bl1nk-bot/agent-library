"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Play, Copy, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApiConfig } from "./api-config-manager";

interface ApiTesterProps {
  promptId: string;
  config: ApiConfig;
  onClose: () => void;
}

interface TestResult {
  success: boolean;
  status?: number;
  statusText?: string;
  responseTime?: number;
  headers?: Record<string, string>;
  data?: unknown;
  error?: string;
}

export function ApiTester({ promptId, config, onClose }: ApiTesterProps) {
  const t = useTranslations("common");
  const [testData, setTestData] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    setResult(null);

    try {
      let parsedData = null;
      if (testData.trim()) {
        try {
          parsedData = JSON.parse(testData);
        } catch (e) {
          setResult({
            success: false,
            error: "Invalid JSON in test data",
          });
          setIsTesting(false);
          return;
        }
      }

      const response = await fetch(
        `/api/prompts/${promptId}/api-config/${config.id}/test`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testData: parsedData }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to test API",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const copyResponse = () => {
    if (result && result.data !== undefined) {
      navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateCurlCommand = () => {
    const url = new URL(config.baseUrl);
    if (config.queryParams) {
      Object.entries(config.queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    let curl = `curl -X ${config.method} "${url.toString()}"`;

    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        curl += ` \\\n  -H "${key}: ${value}"`;
      });
    }

    if (["POST", "PUT", "PATCH"].includes(config.method) && testData) {
      curl += ` \\\n  -d '${testData}'`;
    }

    return curl;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "font-mono text-xs",
                config.method === "GET" && "bg-blue-500/10 text-blue-500",
                config.method === "POST" && "bg-green-500/10 text-green-500",
                config.method === "PUT" && "bg-yellow-500/10 text-yellow-500",
                config.method === "DELETE" && "bg-red-500/10 text-red-500",
                config.method === "PATCH" && "bg-purple-500/10 text-purple-500"
              )}
            >
              {config.method}
            </Badge>
            <h3 className="text-lg font-semibold">{config.name}</h3>
          </div>
          <code className="text-sm text-muted-foreground">{config.baseUrl}</code>
        </div>
      </div>

      {/* Request Section */}
      <Card className="p-6 space-y-4">
        <div>
          <Label className="text-base font-semibold">Request</Label>
          <p className="text-sm text-muted-foreground">
            Test your API with sample data
          </p>
        </div>

        {["POST", "PUT", "PATCH"].includes(config.method) && (
          <div className="space-y-2">
            <Label htmlFor="testData">Request Body (JSON)</Label>
            <Textarea
              id="testData"
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              placeholder='{\n  "key": "value"\n}'
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        )}

        <Button
          onClick={handleTest}
          disabled={isTesting}
          className="w-full sm:w-auto transition-all duration-180"
        >
          <Play className="h-4 w-4 mr-2" />
          {isTesting ? "Testing..." : "Test API"}
        </Button>
      </Card>

      {/* Response Section */}
      {result && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Response</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={result.success ? "default" : "destructive"}
                  className="text-xs"
                >
                  {result.status || "Error"}
                </Badge>
                {result.responseTime && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {result.responseTime}ms
                  </div>
                )}
              </div>
            </div>
            {result.data !== undefined && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyResponse}
                className="h-8"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {result.error ? (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive font-mono">
                  {result.error}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs font-mono max-h-96">
                  {typeof result.data === "string"
                    ? result.data
                    : JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* cURL Command */}
      <Card className="p-6 space-y-3">
        <Label className="text-base font-semibold">cURL Command</Label>
        <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs font-mono">
          {generateCurlCommand()}
        </pre>
      </Card>
    </div>
  );
}
