"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ApiItem } from "@/data/api-docs";
import { METHOD_OPTIONS } from "@/data/method-options";

interface ApiDetailsPopupProps {
  item: ApiItem;
  onClose: () => void;
}

export function ApiDetailsPopup({ item, onClose }: ApiDetailsPopupProps) {
  const getTypeColor = (type: ApiItem["type"]) => {
    switch (type) {
      case "function":
        return "text-blue-500 dark:text-blue-400";
      case "method":
        return "text-blue-500 dark:text-blue-400";
      case "class":
        return "text-yellow-500 dark:text-yellow-400";
      case "interface":
        return "text-green-500 dark:text-green-400";
      case "type":
        return "text-purple-500 dark:text-purple-400";
      case "const":
        return "text-orange-500 dark:text-orange-400";
      default:
        return "text-muted-foreground";
    }
  };

  // Get method name from item name (strip leading dot and parentheses)
  const methodName = item.name.replace(/^\./, "").replace(/\(\)$/, "");
  const availableOptions = METHOD_OPTIONS[methodName];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      {/* Popup */}
      <div className="bg-popover fixed top-1/4 left-72 z-50 max-h-[60vh] w-96 overflow-auto rounded-lg border shadow-xl">
        <div className="p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "bg-muted rounded px-1.5 py-0.5 font-mono text-xs",
                    getTypeColor(item.type)
                  )}
                >
                  {item.type}
                </span>
                <code className="text-sm font-semibold break-all">{item.name}</code>
              </div>
              {item.signature && (
                <code className="text-muted-foreground bg-muted mt-2 block rounded p-2 font-mono text-xs break-all">
                  {item.signature}
                </code>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {item.description && (
            <p className="text-muted-foreground mb-3 text-sm">{item.description}</p>
          )}
          {item.params && item.params.length > 0 && (
            <div className="mb-3">
              <p className="text-foreground mb-2 text-xs font-semibold">Parameters</p>
              <div className="border-muted space-y-1.5 border-l-2 pl-2">
                {item.params.map((p) => (
                  <div key={p.name} className="text-xs">
                    <code className="font-medium text-blue-500">{p.name}</code>
                    <span className="text-purple-500">: {p.type}</span>
                    {p.description && (
                      <span className="text-muted-foreground mt-0.5 block pl-2">
                        {p.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {availableOptions && availableOptions.length > 0 && (
            <div className="mb-3">
              <p className="text-foreground mb-2 text-xs font-semibold">Available Values</p>
              <div className="flex flex-wrap gap-1">
                {availableOptions.slice(0, 20).map((opt) => (
                  <code
                    key={opt}
                    className="bg-muted rounded px-1.5 py-0.5 text-xs text-green-600 dark:text-green-400"
                  >
                    &quot;{opt}&quot;
                  </code>
                ))}
                {availableOptions.length > 20 && (
                  <span className="text-muted-foreground text-xs">
                    +{availableOptions.length - 20} more
                  </span>
                )}
              </div>
            </div>
          )}
          {item.returns && (
            <div className="mb-3">
              <p className="text-foreground mb-1 text-xs font-semibold">Returns</p>
              <code className="bg-muted rounded px-1.5 py-0.5 text-xs text-green-500">
                {item.returns}
              </code>
            </div>
          )}
          {item.example && (
            <div className="mt-3">
              <p className="text-foreground mb-2 text-xs font-semibold">Example</p>
              <pre className="bg-muted overflow-x-auto rounded p-3 font-mono text-xs">
                {item.example}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
