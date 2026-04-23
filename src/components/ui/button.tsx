 
"use client"

import * as React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { Sparkles } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"
import type { ShaderMount as ShaderMountType } from "@paper-design/shaders"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] text-sm font-medium transition-colors disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  label?: string
  viewMode?: "text" | "icon"
}

class ShaderManager {
  private mount: ShaderMountType | null = null;
  private currentParent: HTMLDivElement | null = null;
  private loading = false;

  async attach(parent: HTMLDivElement) {
    if (this.loading) return;
    if (!this.mount) {
      this.loading = true;
      try {
        const { liquidMetalFragmentShader, ShaderMount } = await import("@paper-design/shaders");
        this.mount = new (ShaderMount as any)(
          parent,
          liquidMetalFragmentShader,
          {
            u_repetition: 4,
            u_softness: 0.5,
            u_shiftRed: 0.3,
            u_shiftBlue: 0.3,
            u_distortion: 0,
            u_contour: 0,
            u_angle: 45,
            u_scale: 8,
            u_shape: 1,
            u_offsetX: 0.1,
            u_offsetY: -0.1,
          },
          undefined,
          0.6
        );
        this.currentParent = parent;
      } catch (e) {
        console.error("Failed to load shader", e);
      } finally {
        this.loading = false;
      }
      return;
    }

    if (this.currentParent !== parent) {
      this.currentParent = parent;
      const mount = this.mount as any;
      const canvas = mount.getCanvas?.() || mount.canvas;
      if (canvas && parent) {
        parent.appendChild(canvas);
      }
    }
  }

  setSpeed(speed: number) {
    if (this.mount) {
      (this.mount as any).setSpeed?.(speed);
    }
  }
}

const shaderManager = new ShaderManager();

function Button({
  className,
  variant,
  size,
  asChild = false,
  label,
  viewMode,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const isPrimary = variant === "default" || !variant;
  const isExploded = isPrimary && !asChild;

  const ariaLabelProp = props["aria-label"];

  // Accessibility check
  useEffect(() => {
    if (!ariaLabelProp && !children && !label) {
      console.warn("Button should have an aria-label, label prop, or children for accessibility.");
    }
  }, [ariaLabelProp, children, label]);

  // --- START Hoisted Hooks and variables ---
  const [isHovered, setIsHovered] = useState(false)
  const isHoveredRef = useRef(false)
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const shaderRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const rippleId = useRef(0)

  // Compute mode and displayLabel unconditionally
  const mode = viewMode || (size === "icon" || size === "icon-sm" || size === "icon-lg" ? "icon" : "text")
  const displayLabel = label || (typeof children === 'string' ? children : "")

  // Dynamic dimensions based on mode.
  const dimensions = useMemo(() => {
    if (mode === "icon") {
      let dim = 46;
      if (size === "icon-sm") dim = 40;
      if (size === "icon-lg") dim = 52;

      return {
        width: dim,
        height: dim,
        innerWidth: dim - 4,
        innerHeight: dim - 4,
        shaderWidth: dim,
        shaderHeight: dim,
      }
    }
    // For text mode, we rely on CSS sizing (auto width, variant height)
    return {
      width: undefined,
      height: undefined,
      innerWidth: undefined,
      innerHeight: undefined,
      shaderWidth: undefined,
      shaderHeight: undefined,
    }
  }, [mode, size])

  useEffect(() => {
    const styleId = "shader-canvas-style-exploded"
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style")
      style.id = styleId
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)
    isHoveredRef.current = true
    if (isPrimary && shaderRef.current) {
      shaderManager.attach(shaderRef.current);
      shaderManager.setSpeed(1);
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    isHoveredRef.current = false
    setIsPressed(false)
    if (isPrimary) shaderManager.setSpeed(0.6);
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isPrimary) {
      shaderManager.setSpeed(2.4)
      setTimeout(() => {
        if (isHoveredRef.current) {
          shaderManager.setSpeed(1)
        } else {
          shaderManager.setSpeed(0.6)
        }
      }, 300)
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const ripple = { x, y, id: rippleId.current++ }

      setRipples((prev) => [...prev, ripple])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id))
      }, 600)
    }

    onClick?.(e)
  }
  // --- END Hoisted Hooks and variables ---

  // Compute classes using buttonVariants - do NOT pass className here to avoid duplication
  const variantClasses = buttonVariants({ variant, size });

  // Fallback to simple button if asChild is true or not primary variant
  if (asChild || !isExploded) {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size }),
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {children || displayLabel}
      </Comp>
    )
  }

  return (
    <div className={cn("relative inline-block perspective-1000", className)}>
      <div
        className={cn(
          "relative transform-style-3d transition-all duration-800",
          variantClasses,
          "border-0 overflow-hidden",
          props.disabled && "opacity-50"
        )}
        style={{
          width: dimensions.width ? `${dimensions.width}px` : undefined,
          height: dimensions.height ? `${dimensions.height}px` : undefined,
          transform: `translateZ(0px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
        }}
      >
          {/* Inner Background Layer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "var(--radius)",
              background: "linear-gradient(180deg, #202020 0%, #000000 100%)",
              zIndex: 0,
            }}
          />

          {/* Shader/Outer Layer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "var(--radius)",
              zIndex: 1,
            }}
          >
            <div
              ref={shaderRef}
              className="shader-container-exploded"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "var(--radius)",
              }}
            />
          </div>

          {/* Content Layer */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            {mode === "icon" ? (
              React.Children.count(children) > 0 && typeof children !== 'string' ? (
                 <div style={{
                  color: "#666666",
                  filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {children}
                </div>
              ) : (
                <Sparkles
                  size={16}
                  style={{
                    color: "#666666",
                    filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))",
                  }}
                />
              )
            ) : (
              <span
                style={{
                  fontSize: "inherit",
                  color: "#666666",
                  fontWeight: "inherit",
                  textShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)",
                  whiteSpace: "nowrap",
                }}
              >
                {displayLabel || children}
              </span>
            )}
          </div>

          <button
            ref={buttonRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            className={cn(
              "absolute inset-0 w-full h-full bg-transparent border-none z-40",
              "cursor-pointer disabled:cursor-not-allowed outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            aria-label={displayLabel || (typeof children === 'string' ? children : undefined)}
            {...props}
          >
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                style={{
                  position: "absolute",
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)",
                  pointerEvents: "none",
                  animation: "ripple-animation 0.6s ease-out",
                }}
              />
            ))}
          </button>
      </div>
    </div>
  )
}

export { Button, buttonVariants }