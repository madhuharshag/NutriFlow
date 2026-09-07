import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "text" | "circular" | "rectangular";
}

export function LoadingSkeleton({ className, variant = "rectangular" }: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div className={cn("card overflow-hidden border border-border-muted", className)}>
        <div className="skeleton h-40 rounded-none w-full" />
        <div className="p-5 flex flex-col gap-3">
          <div className="skeleton h-6 rounded-lg w-3/4" />
          <div className="skeleton h-4 rounded-lg w-full" />
          <div className="skeleton h-4 rounded-lg w-5/6" />
          <div className="skeleton h-10 rounded-xl w-full mt-2" />
        </div>
      </div>
    );
  }

  const variantClasses = {
    text: "h-4 w-full rounded-md",
    circular: "h-12 w-12 rounded-full",
    rectangular: "h-24 w-full rounded-xl",
  };

  return (
    <div 
      className={cn("skeleton", variantClasses[variant], className)} 
      aria-hidden="true"
    />
  );
}
