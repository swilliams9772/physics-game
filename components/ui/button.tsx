import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0.5 border-2 border-primary/30",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0.5 border-2 border-destructive/30",
        outline:
          "border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:-translate-y-1 active:translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0.5 border-2 border-secondary/30",
        ghost: "hover:bg-accent hover:text-accent-foreground border-2 border-transparent hover:border-accent/30",
        link: "text-primary underline-offset-4 hover:underline",
        magical: "bg-gradient-to-r from-primary to-primary/70 text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0.5 border-2 border-primary/30 magic-glow",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-xl px-4 py-2",
        lg: "h-11 rounded-xl px-8 py-3",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
