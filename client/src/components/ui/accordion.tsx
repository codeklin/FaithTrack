import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

// Create type-asserted versions of Radix components
const _AccordionPrimitiveItem = AccordionPrimitive.Item as React.FC<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & { className?: string }>;
const _AccordionPrimitiveTrigger = AccordionPrimitive.Trigger as React.FC<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { className?: string; children?: React.ReactNode }>;
const _AccordionPrimitiveContent = AccordionPrimitive.Content as React.FC<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & { children?: React.ReactNode; className?: string; }>;
// Note: AccordionPrimitive.Header is a simple div, assuming it doesn't need className assertion from props.

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <_AccordionPrimitiveItem
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex"> {/* Header is not asserted as it's not taking className from props */}
    <_AccordionPrimitiveTrigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </_AccordionPrimitiveTrigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <_AccordionPrimitiveContent
    ref={ref}
    // The className on _AccordionPrimitiveContent itself is for its own styling, not from the wrapper's className prop in this case.
    // The wrapper's className is applied to the inner div.
    // We assert className on _AccordionPrimitiveContent in case it's ever passed via ...props or needed for direct styling.
    className={cn("overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down", /* if props.className existed, it would be here */)}
    {...props} // children should be passed correctly via props if not destructured earlier for the primitive
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </_AccordionPrimitiveContent>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
