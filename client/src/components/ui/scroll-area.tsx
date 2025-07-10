import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

// Create type-asserted versions of Radix components
const _ScrollAreaPrimitiveRoot = ScrollAreaPrimitive.Root as React.FC<React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & { className?: string; children?: React.ReactNode }>;
const _ScrollAreaPrimitiveViewport = ScrollAreaPrimitive.Viewport as React.FC<React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport> & { className?: string; children?: React.ReactNode }>;
const _ScrollAreaPrimitiveScrollAreaScrollbar = ScrollAreaPrimitive.ScrollAreaScrollbar as React.FC<React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & { className?: string; children?: React.ReactNode }>;
const _ScrollAreaPrimitiveScrollAreaThumb = ScrollAreaPrimitive.ScrollAreaThumb as React.FC<React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaThumb> & { className?: string; children?: React.ReactNode }>;
const _ScrollAreaPrimitiveCorner = ScrollAreaPrimitive.Corner as React.FC<React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Corner> & { className?: string; children?: React.ReactNode }>;

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <_ScrollAreaPrimitiveRoot
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <_ScrollAreaPrimitiveViewport className="h-full w-full rounded-[inherit]">
      {children}
    </_ScrollAreaPrimitiveViewport>
    <ScrollBar /> {/* ScrollBar is the wrapped component, uses asserted primitives internally */}
    <_ScrollAreaPrimitiveCorner />
  </_ScrollAreaPrimitiveRoot>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <_ScrollAreaPrimitiveScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <_ScrollAreaPrimitiveScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </_ScrollAreaPrimitiveScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
