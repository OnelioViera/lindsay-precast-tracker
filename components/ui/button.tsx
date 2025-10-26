import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-105': variant === 'primary',
            'bg-gray-500 text-white hover:bg-gray-600': variant === 'secondary',
            'bg-red-500 text-white hover:bg-red-600': variant === 'destructive',
            'bg-green-500 text-white hover:bg-green-600': variant === 'success',
            'bg-orange-500 text-white hover:bg-orange-600': variant === 'warning',
            'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'default',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }


