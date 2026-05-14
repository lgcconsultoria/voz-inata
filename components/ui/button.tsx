import * as React from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "ghost" | "outline"
type Size = "sm" | "md" | "lg"

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-terracota text-white shadow-sm hover:bg-terracota-500 active:bg-terracota-600",
  secondary:
    "bg-verde text-white shadow-sm hover:bg-verde-500 active:bg-verde-700",
  outline:
    "border border-verde text-verde hover:bg-verde-50 active:bg-verde-100",
  ghost: "text-verde hover:bg-verde-50 active:bg-verde-100"
}

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base"
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
)
Button.displayName = "Button"
