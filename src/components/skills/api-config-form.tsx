"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiConfig } from "./api-config-manager";

interface ApiConfigFormProps {
  initialData?: Partial<ApiConfig>;
  onSave: (data: Partial<ApiConfig>) => Promise<void>;
  onCancel: () => void;
}

export function ApiConfigForm({
  initialData,
  onSave,
  onCancel,
}: ApiConfigFormProps) {
  const t = useTranslations("common");
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    baseUrl: initialData?.baseUrl || "",
    method: initialData?.method || "GET",
    headers: initialData?.headers || {},
    queryParams: initialData?.queryParams || {},
    documentation: initialData?.documentation || "",
  });

  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>(
    Object.entries(formData.headers).map(([key, value]) => ({ key, value }))
  );

  const [queryParams, setQueryParams] = useState<
    Array<{ key: string; value: string }>
  >(
    Object.entries(formData.queryParams).map(([key, value]) => ({ key, value }))
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        ...formData,
        headers: headers.reduce(
          (acc, { key, value }) => {
            if (key) acc[key] = value;
            return acc;
          },
          {} as Record<string, string>
        ),
        queryParams: queryParams.reduce(
          (acc, { key, value }) => {
            if (key) acc[key] = value;
            return acc;
          },
          {} as Record<string, string>
        ),
      };

      await onSave(data);
    } catch (error) {
      console.error("[v0] Error saving API config:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-semibold">
            {initialData ? "Edit API Configuration" : "New API Configuration"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure your API endpoint details
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Get User Data"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Method *</Label>
            <Select
              value={formData.method}
              onValueChange={(value) =>
                setFormData({ ...formData, method: value })
              }
            >
              <SelectTrigger id="method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="baseUrl">Base URL *</Label>
          <Input
            id="baseUrl"
            type="url"
            value={formData.baseUrl}
            onChange={(e) =>
              setFormData({ ...formData, baseUrl: e.target.value })
            }
            placeholder="https://api.example.com/endpoint"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe what this API does..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentation">Documentation URL</Label>
          <Input
            id="documentation"
            type="url"
            value={formData.documentation}
            onChange={(e) =>
              setFormData({ ...formData, documentation: e.target.value })
            }
            placeholder="https://docs.example.com"
          />
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Headers</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHeaders([...headers, { key: "", value: "" }])}
              className="h-7 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Header
            </Button>
          </div>
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Key"
                  value={header.key}
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[index].key = e.target.value;
                    setHeaders(newHeaders);
                  }}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[index].value = e.target.value;
                    setHeaders(newHeaders);
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setHeaders(headers.filter((_, i) => i !== index))
                  }
                  className="h-9 w-9 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Query Parameters</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setQueryParams([...queryParams, { key: "", value: "" }])
              }
              className="h-7 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Parameter
            </Button>
          </div>
          <div className="space-y-2">
            {queryParams.map((param, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) => {
                    const newParams = [...queryParams];
                    newParams[index].key = e.target.value;
                    setQueryParams(newParams);
                  }}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) => {
                    const newParams = [...queryParams];
                    newParams[index].value = e.target.value;
                    setQueryParams(newParams);
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setQueryParams(queryParams.filter((_, i) => i !== index))
                  }
                  className="h-9 w-9 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
