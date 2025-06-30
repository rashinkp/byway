import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-xs hover:bg-[var(--secondary-hover)] cursor-pointer",
        destructive:
          "bg-[var(--destructive,#ef4444)] text-white shadow-xs hover:bg-[var(--destructive-hover,#dc2626)] focus-visible:ring-[var(--destructive,#ef4444)]/20 dark:focus-visible:ring-[var(--destructive,#ef4444)]/40 dark:bg-[var(--destructive,#ef4444)]/60",
        outline:
          "border border-[var(--primary-200)] bg-[var(--background)] text-[var(--foreground)] shadow-xs hover:bg-[var(--primary-50)] hover:text-[var(--primary)] dark:bg-[var(--input,transparent)] dark:border-[var(--primary-200)] dark:hover:bg-[var(--primary-100)]",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground,#fff)] shadow-xs hover:bg-[var(--secondary-hover,#0f172a)]",
        ghost:
          "bg-transparent text-[var(--primary)] hover:bg-[var(--primary-50)] hover:text-[var(--primary-hover)] dark:hover:bg-[var(--primary-100)]",
        link: "text-[var(--primary)] cursor-pointer",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
