
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, RefreshCcw, Circle, X } from "lucide-react";

export type JobStatus = "queued" | "running" | "completed" | "failed";

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          variant: "success",
          icon: Check,
        };
      case "running":
        return {
          label: "Running",
          variant: "warning",
          icon: RefreshCcw,
        };
      case "queued":
        return {
          label: "Queued",
          variant: "secondary",
          icon: Circle,
        };
      case "failed":
        return {
          label: "Failed",
          variant: "destructive",
          icon: X,
        };
      default:
        return {
          label: status,
          variant: "secondary",
          icon: Circle,
        };
    }
  };

  const { label, variant, icon: Icon } = getStatusConfig();

  return (
    <Badge
      variant={variant as any}
      className={cn(
        "gap-1",
        variant === "success" && "bg-success text-success-foreground",
        variant === "warning" && "bg-warning text-warning-foreground",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
