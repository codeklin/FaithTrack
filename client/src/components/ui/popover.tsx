import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

// Create type-asserted versions of Radix components
const _PopoverPrimitiveRoot = PopoverPrimitive.Root as React.FC<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> & { className?: string; children?: React.ReactNode }>;
const _PopoverPrimitiveTrigger = PopoverPrimitive.Trigger as React.FC<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & { className?: string; children?: React.ReactNode }>;
const _PopoverPrimitivePortal = PopoverPrimitive.Portal as React.FC<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal> & { className?: string; children?: React.ReactNode }>;
const _PopoverPrimitiveContent = PopoverPrimitive.Content as React.FC<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { className?: string; children?: React.ReactNode }>;


const Popover = _PopoverPrimitiveRoot
const PopoverTrigger = _PopoverPrimitiveTrigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <_PopoverPrimitivePortal>
    <_PopoverPrimitiveContent
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",
        className
      )}
      {...props}
    />
  </_PopoverPrimitivePortal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
