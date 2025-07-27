import * as React from "react";

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "error" | "success"
  inputSize?: "default" | "sm" | "lg"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", variant = "default", inputSize = "default", type, ...props }, ref) => {
    // Base classes
    const baseClasses = "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
    
    // Variant classes
    const variantClasses = {
      default: "border-input hover:border-gray-500 focus:border-gray-500",
      error: "border-red-500 hover:border-red-600 focus:border-red-600 focus-visible:ring-red-500",
      success: "border-green-500 hover:border-green-600 focus:border-green-600 focus-visible:ring-green-500"
    }
    
    // Size classes
    const sizeClasses = {
      default: "h-10",
      sm: "h-8 px-2 py-1 text-xs",
      lg: "h-12 px-4 py-3 text-base"
    }
    
    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[inputSize]} ${className}`.trim()
    
    return (
      <input
        type={type}
        className={combinedClasses}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
