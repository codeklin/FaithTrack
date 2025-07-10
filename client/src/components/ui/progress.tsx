"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

// Create type-asserted versions of Radix components
const _ProgressPrimitiveRoot = ProgressPrimitive.Root as React.FC<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { className?: string; children?: React.ReactNode }>;
const _ProgressPrimitiveIndicator = ProgressPrimitive.Indicator as React.FC<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Indicator> & { className?: string; children?: React.ReactNode }>;

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <_ProgressPrimitiveRoot
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <_ProgressPrimitiveIndicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </_ProgressPrimitiveRoot>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
