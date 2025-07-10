"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

// Create type-asserted versions of Radix components
const _MenubarPrimitiveMenu = MenubarPrimitive.Menu as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Menu> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveGroup = MenubarPrimitive.Group as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Group> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitivePortal = MenubarPrimitive.Portal as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Portal> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveRadioGroup = MenubarPrimitive.RadioGroup as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioGroup> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveSub = MenubarPrimitive.Sub as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Sub> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveRoot = MenubarPrimitive.Root as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveTrigger = MenubarPrimitive.Trigger as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveSubTrigger = MenubarPrimitive.SubTrigger as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveSubContent = MenubarPrimitive.SubContent as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveContent = MenubarPrimitive.Content as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveItem = MenubarPrimitive.Item as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveCheckboxItem = MenubarPrimitive.CheckboxItem as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveRadioItem = MenubarPrimitive.RadioItem as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveLabel = MenubarPrimitive.Label as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & { className?: string; children?: React.ReactNode }>;
const _MenubarPrimitiveSeparator = MenubarPrimitive.Separator as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator> & { className?: string }>;
const _MenubarPrimitiveItemIndicator = MenubarPrimitive.ItemIndicator as React.FC<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.ItemIndicator> & { className?: string; children?: React.ReactNode }>;

// Re-exporting with asserted types
const MenubarMenu = _MenubarPrimitiveMenu;
const MenubarGroup = _MenubarPrimitiveGroup;
const MenubarPortal = _MenubarPrimitivePortal;
const MenubarRadioGroup = _MenubarPrimitiveRadioGroup;
const MenubarSub = (props: React.ComponentProps<typeof _MenubarPrimitiveSub>) => <_MenubarPrimitiveSub data-slot="menubar-sub" {...props} />;


const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <_MenubarPrimitiveRoot
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <_MenubarPrimitiveTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <_MenubarPrimitiveSubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </_MenubarPrimitiveSubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <_MenubarPrimitiveSubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPortal> {/* Uses asserted MenubarPortal */}
      <_MenubarPrimitiveContent
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
          className
        )}
        {...props}
      />
    </MenubarPortal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <_MenubarPrimitiveItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <_MenubarPrimitiveCheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <_MenubarPrimitiveItemIndicator>
        <Check className="h-4 w-4" />
      </_MenubarPrimitiveItemIndicator>
    </span>
    {children}
  </_MenubarPrimitiveCheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <_MenubarPrimitiveRadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <_MenubarPrimitiveItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </_MenubarPrimitiveItemIndicator>
    </span>
    {children}
  </_MenubarPrimitiveRadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <_MenubarPrimitiveLabel
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <_MenubarPrimitiveSeparator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut" // Original had .displayname, should be .displayName for consistency if used as a component

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
