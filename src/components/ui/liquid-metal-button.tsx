"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface LiquidMetalButtonProps extends React.ComponentProps<typeof Button> {
  label?: string
  viewMode?: "text" | "icon"
}

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  viewMode = "text",
  asChild = false,
  className,
  ...props
}: LiquidMetalButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(viewMode === "icon" ? "w-8 h-8 p-0" : "", className)}
      size={viewMode === "icon" ? "icon" : "default"}
      asChild={asChild}
      {...props}
    >
      {viewMode === "icon" ? (
        <Sparkles className="h-4 w-4" />
      ) : (
        label
      )}
    </Button>
  )
}
