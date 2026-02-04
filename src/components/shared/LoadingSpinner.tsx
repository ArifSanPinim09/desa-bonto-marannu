import { HTMLAttributes } from "react";
import { cn } from "@/src/lib/utils/cn";

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "white" | "gray";
  text?: string;
}

export default function LoadingSpinner({
  size = "md",
  variant = "primary",
  text,
  className,
  ...props
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const variants = {
    primary: "text-green-700",
    white: "text-white",
    gray: "text-gray-500",
  };

  const borderSizes = {
    sm: "border-2",
    md: "border-3",
    lg: "border-4",
    xl: "border-4",
  };

  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3", className)}
      role="status"
      aria-live="polite"
      aria-label={text || "Loading"}
      {...props}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-current border-t-transparent",
          sizes[size],
          variants[variant],
          borderSizes[size]
        )}
      />
      {text && (
        <p className={cn("text-sm font-medium", variants[variant])}>
          {text}
        </p>
      )}
      <span className="sr-only">{text || "Loading..."}</span>
    </div>
  );
}

// Full page loading spinner
export function FullPageSpinner({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

// Inline loading spinner for buttons or small spaces
export function InlineSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn("inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-t-transparent", className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
