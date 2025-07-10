import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

// Create type-asserted versions of Radix components
const _RadioGroupPrimitiveRoot = RadioGroupPrimitive.Root as React.FC<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & { className?: string; children?: React.ReactNode }>;
const _RadioGroupPrimitiveItem = RadioGroupPrimitive.Item as React.FC<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & { className?: string; children?: React.ReactNode }>;
const _RadioGroupPrimitiveIndicator = RadioGroupPrimitive.Indicator as React.FC<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator> & { className?: string; children?: React.ReactNode }>;

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <_RadioGroupPrimitiveRoot
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <_RadioGroupPrimitiveItem
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <_RadioGroupPrimitiveIndicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </_RadioGroupPrimitiveIndicator>
    </_RadioGroupPrimitiveItem>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
