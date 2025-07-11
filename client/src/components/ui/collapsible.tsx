"use client"

import * as React from "react" // Import React for FC type
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

// Create type-asserted versions of Radix components
const _Collapsible = CollapsiblePrimitive.Root as React.FC<React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> & { className?: string; children?: React.ReactNode }>;
const _CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger as React.FC<React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger> & { className?: string; children?: React.ReactNode }>;
const _CollapsibleContent = CollapsiblePrimitive.CollapsibleContent as React.FC<React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent> & { className?: string; children?: React.ReactNode }>;

const Collapsible = _Collapsible
const CollapsibleTrigger = _CollapsibleTrigger
const CollapsibleContent = _CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
