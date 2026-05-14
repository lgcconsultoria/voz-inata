import * as React from "react"
import { cn } from "@/lib/utils"

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-lg border border-areia bg-white px-4 text-sm text-tinta placeholder:text-argila/70",
      "transition-colors focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/30",
      "disabled:cursor-not-allowed disabled:opacity-60",
      className
    )}
    {...props}
  />
))
Input.displayName = "Input"

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium text-verde", className)}
    {...props}
  />
))
Label.displayName = "Label"
